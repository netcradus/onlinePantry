import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import asyncHandler from "../utils/helpers/asyncHandler.js";
import ApiError from "../utils/helpers/errorHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import { Order } from "../models/Order.model.js";
import { Product } from "../models/Product.model.js";
import { Payment } from "../models/Payment.model.js";
import { Cart } from "../models/Cart.model.js";
import { env } from "../configs/env.config.js";
import { NotificationService } from "../services/notification.service.js";
import { OrderService } from "../services/order.service.js";

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId, status, confirmationDetails } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(orderId).session(session).populate("user");
        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        // State Machine Validation
        const validTransitions = {
            processing: ["packing", "cancelled"],
            packing: ["dispatched", "cancelled"],
            dispatched: ["reached_station", "out_for_delivery", "delivered", "cancelled"],
            reached_station: ["out_for_delivery", "delivered", "cancelled"],
            out_for_delivery: ["delivered", "cancelled"],
            delivered: [],
            cancelled: [],
            awaiting_confirmation: ["confirmed", "cancelled"], // Added transition
            confirmed: ["packing", "cancelled"] // Confirmed orders go to packing
        };

        // Allow "confirmed" from "awaiting_confirmation" via WhatsApp flow
        // The original map didn't have awaiting_confirmation key explicitly in previous code, 
        // but we need to support it. 

        // Strict Guard for Double Confirmation
        if (status === "confirmed" && order.orderStatus === "confirmed") {
            throw new ApiError(400, "Order is already confirmed");
        }

        // --- WHATSAPP STOCK DECREMENT & CONFIRMATION ---
        if (status === "confirmed" && order.paymentMode === "whatsapp") {
            // 1. Audit Trail
            order.confirmedAt = new Date();
            order.confirmedBy = req.user._id;

            // 2. Atomic Stock Decrement
            for (const item of order.items) {
                const multiplier = item.multiplier || 1;
                const decrementQty = item.quantity * multiplier;

                // Atomic update: only decrement if stock >= decrementQty
                const result = await Product.updateOne(
                    { _id: item.product, stock: { $gte: decrementQty } },
                    { $inc: { stock: -decrementQty } }
                ).session(session);

                if (result.modifiedCount === 0) {
                    throw new ApiError(400, `Insufficient stock for product ${item.product} (Qty: ${decrementQty})`);
                }
            }
        }

        order.orderStatus = status;
        if (status === "delivered") {
            order.deliveredAt = Date.now();
            order.paymentStatus = "paid";
        }

        await order.save({ session });
        await session.commitTransaction();

        // --- NOTIFICATIONS (Non-blocking) ---
        // Run outside transaction so failure doesn't rollback the order
        try {
            if (status === "confirmed" && confirmationDetails) {
                const results = await NotificationService.sendOrderConfirmation(order.user, order, confirmationDetails);

                // Update notification flags - this is a separate write, okay if it fails or is async
                await Order.findByIdAndUpdate(order._id, {
                    "notifications.whatsappSent": results.whatsapp,
                    "notifications.smsSent": results.sms,
                    "notifications.notifiedAt": new Date()
                });
            } else {
                // Standard status update notification
                if (order.user) {
                    await NotificationService.sendOrderStatusUpdate(order.user, order, status);
                }
            }
        } catch (error) {
            console.error("Failed to send status update notification:", error);
            // We do NOT throw here, confirmation is already committed.
        }

        return res.status(200).json(new ApiResponse(200, order, "Order status updated"));

    } catch (error) {
        console.error("Order Status Update Failed:", error);
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

let razorpayInstance;
try {
    razorpayInstance = new Razorpay({
        key_id: env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
        key_secret: env.RAZORPAY_KEY_SECRET || "dummysecret",
    });
} catch (error) {
    console.error("Razorpay initialization failed:", error);
}

export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress } = req.body;

    // 1. Fetch Cart to calculate amount
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    // 2. Calculate Total Amount & Validate Stock
    let totalAmount = 0;
    for (const item of cart.items) {
        if (!item.product) continue;

        let price = item.product.discountPrice || item.product.price;
        let multiplier = 1;

        if (item.selectedCombo) {
            const combo = item.product.combos?.find(c => c.name === item.selectedCombo);
            if (combo) {
                price = combo.price;
                multiplier = combo.multiplier;
            }
        }

        const requiredStock = item.quantity * multiplier;

        // Check Stock
        if (item.product.stock < requiredStock) {
            throw new ApiError(400, `Insufficient stock for ${item.product.name}`);
        }
        totalAmount += price * item.quantity;
    }

    // --- WHATSAPP MODE CHECK ---
    if (env.PAYMENT_MODE === 'whatsapp') {
        // A. Duplicate Pending Order Check
        const existingOrder = await Order.findOne({
            user: req.user._id,
            paymentMode: "whatsapp",
            orderStatus: "awaiting_confirmation"
        });

        if (existingOrder) {
            return res.status(400).json(new ApiResponse(400, null, "You already have a pending WhatsApp order. Please wait for confirmation."));
        }

        // B. Create Pending Order (No Stock Decrement Yet)
        const order = await Order.create({
            user: req.user._id,
            items: cart.items.map(item => {
                let multiplier = 1;
                if (item.selectedCombo) {
                    const combo = item.product.combos?.find(c => c.name === item.selectedCombo);
                    if (combo) multiplier = combo.multiplier;
                }
                return {
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.product.images?.[0] || "",
                    selectedCombo: item.selectedCombo,
                    multiplier: multiplier
                };
            }),
            totalAmount,
            shippingAddress,
            paymentMode: "whatsapp",
            paymentStatus: "pending", // Or "pending_payment"
            orderStatus: "awaiting_confirmation"
        });

        // C. Generate WhatsApp Message
        const orderDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const adminNumber = env.ADMIN_WHATSAPP_NUMBER;

        let message = `🛒 *New Order Request - Online Pantry*\n\n`;
        message += `*Order ID:* #${order._id.toString().slice(-6).toUpperCase()}\n`;
        message += `*Date:* ${orderDate}\n\n`;
        message += `*Customer Details:*\nName: ${req.user.firstName} ${req.user.lastName}\nPhone: ${shippingAddress.phone}\nAddress: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zip}\n\n`;
        message += `*Items:*\n`;

        cart.items.forEach(item => {
            const comboText = item.selectedCombo ? ` (${item.selectedCombo})` : '';
            message += `- ${item.product.name}${comboText} x${item.quantity} - ₹${item.price * item.quantity}\n`;
        });

        message += `\n*Total Amount: ₹${totalAmount}*\n\n`;
        message += `Please confirm this order.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodedMessage}`;

        // D. Clear Cart
        console.log("Attempting to delete cart:", cart._id);
        const deletedCart = await Cart.findByIdAndDelete(cart._id);
        console.log("Cart deletion result:", deletedCart ? "Deleted" : "Not Found/Failed");

        return res.status(201).json(new ApiResponse(201, { whatsappUrl, orderId: order._id }, "WhatsApp Order Created"));
    }

    // --- RAZORPAY MODE ---

    // 3. Create Razorpay Order
    // Serialize address safely
    const addressString = JSON.stringify(shippingAddress || {});
    // Truncate if too long (Razorpay limit ~2KB total for notes). 
    // If address is huge, we might need another strategy, but standard address is fine.

    const options = {
        amount: totalAmount * 100, // Amount in paise
        currency: "INR",
        receipt: `order_${Date.now()}`,
        notes: {
            userId: req.user._id.toString(),
            cartId: cart._id.toString(),
            shippingAddress: addressString.substring(0, 1000) // Safety limit
        }
    };

    let razorpayOrder;
    try {
        if (razorpayInstance) {
            razorpayOrder = await razorpayInstance.orders.create(options);
        } else {
            // Mock for dev
            razorpayOrder = {
                id: `order_${Date.now()}_mock`,
                amount: options.amount,
                status: 'created',
                notes: options.notes
            };
        }
    } catch (error) {
        throw new ApiError(500, "Unable to create Razorpay order");
    }

    // Don't create DB order yet. Just return the razorpay details.
    return res.status(200).json(new ApiResponse(200, { razorpayOrder }, "Razorpay order created"));
});

export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress } = req.body;

    // 0. Idempotency Check (Critical)
    const existingPayment = await Payment.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existingPayment) {
        return res.status(200).json(new ApiResponse(200, { orderId: existingPayment.order }, "Payment already processed"));
    }

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", env.RAZORPAY_KEY_SECRET || "dummysecret")
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        throw new ApiError(400, "Invalid signature");
    }

    // 2. Use Service for Atomic Fulfillment
    // We need to fetch cart here to pass to service, or let service fetch it?
    // Service expects `cartItems`. Let's fetch cart here to validate it exists for *this* user context.

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart not found or empty during verification");
    }

    // Calculate total amount again for safety (or trust cart calculation within service?)
    // Service calculates based on passed items.
    // We'll calculate here to pass `totalAmount` to service.
    let totalAmount = 0;
    for (const item of cart.items) {
        if (item.product) {
            totalAmount += (item.product.discountPrice || item.product.price) * item.quantity;
        }
    }

    const { order } = await OrderService.fulfillOrder({
        user: req.user,
        cartItems: cart.items,
        shippingAddress, // From Frontend
        totalAmount,
        paymentDetails: {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature
        }
    });

    return res.status(200).json(new ApiResponse(200, { orderId: order._id }, "Payment verified and Order created successfully"));
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Order.countDocuments({ user: req.user._id });

    return res.status(200).json(new ApiResponse(200, { orders, total, page, pages: Math.ceil(total / limit) }, "Orders fetched"));
});

export const getAllOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Admin sees more
    const skip = (page - 1) * limit;

    const orders = await Order.find()
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Order.countDocuments();

    return res.status(200).json(new ApiResponse(200, { orders, total, page, pages: Math.ceil(total / limit) }, "Orders fetched"));
});



export const getRevenueStats = asyncHandler(async (req, res) => {
    const revenueAggregation = await Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }
        }
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;
    const totalOrders = await Order.countDocuments();

    const ordersByStatus = await Order.aggregate([
        {
            $group: {
                _id: "$orderStatus",
                count: { $sum: 1 }
            }
        }
    ]);

    // Format ordersByStatus for easier frontend consumption map/object
    const statusMap = {};
    ordersByStatus.forEach(stat => {
        statusMap[stat._id] = stat.count;
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    totalRevenue,
                    totalOrders,
                    ordersByStatus: statusMap
                },
                "Revenue stats fetched successfully"
            )
        );
});
