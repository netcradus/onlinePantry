import crypto from "crypto";
import asyncHandler from "../utils/helpers/asyncHandler.js";
import ApiError from "../utils/helpers/errorHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import { User } from "../models/User.model.js";
import { Cart } from "../models/Cart.model.js";
import { Payment } from "../models/Payment.model.js";
import { OrderService } from "../services/order.service.js";
import { env } from "../configs/env.config.js";

export const handleRazorpayWebhook = asyncHandler(async (req, res) => {
    // 1. Verify Signature
    const shasum = crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET || "dummysecret");
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== req.headers["x-razorpay-signature"]) {
        throw new ApiError(400, "Invalid webhook signature");
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === "payment.captured") {
        const paymentDetails = payload.payment.entity;
        const razorpayOrderId = paymentDetails.order_id;
        const razorpayPaymentId = paymentDetails.id;
        const notes = paymentDetails.notes || {};

        // 2. Check Idempotency
        const existingPayment = await Payment.findOne({ razorpayPaymentId });
        if (existingPayment) {
            return res.status(200).json(new ApiResponse(200, {}, "Payment already processed"));
        }

        // 3. Reconstruct Context from Notes
        const userId = notes.userId;
        const shippingAddressString = notes.shippingAddress;

        if (!userId || !shippingAddressString) {
            console.error("Webhook Error: Missing metadata in notes", notes);
            return res.status(200).json({ status: "ignored", message: "Missing metadata" });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error("Webhook Error: User not found", userId);
            return res.status(200).json({ status: "ignored", message: "User not found" });
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            // Edge case: Cart cleared but payment late? 
            // Or maybe multiple webhook retries but idempotency check failed?
            console.error("Webhook Error: Cart empty for user", userId);
            return res.status(200).json({ status: "ignored", message: "Cart empty" });
        }

        let shippingAddress;
        try {
            shippingAddress = JSON.parse(shippingAddressString);
        } catch (e) {
            console.error("Webhook Error: Invalid address JSON");
            return res.status(200).json({ status: "ignored", message: "Invalid address" });
        }

        // 4. Fulfill Order via Service
        // Calculate total from cart items found
        let totalAmount = 0;
        for (const item of cart.items) {
            if (item.product) {
                totalAmount += (item.product.discountPrice || item.product.price) * item.quantity;
            }
        }

        try {
            await OrderService.fulfillOrder({
                user: user,
                cartItems: cart.items,
                shippingAddress,
                totalAmount,
                paymentDetails: {
                    razorpayOrderId: razorpayOrderId,
                    razorpayPaymentId: razorpayPaymentId,
                    razorpaySignature: "webhook_verified" // Webhook effectively verifies signature
                }
            });
            return res.status(200).json(new ApiResponse(200, { status: "success" }, "Order fulfilled via webhook"));
        } catch (error) {
            console.error("Webhook Fulfillment Error:", error);
            // We return 200 to stop Razorpay from retrying indefinitely if it's a logic error (e.g., stock)
            // Ideally 500 triggers retry, but if stock is gone, retry won't fix it.
            // For now return 200 to acknowledge receipt.
            return res.status(200).json({ status: "failed", message: error.message });
        }
    }

    return res.status(200).json(new ApiResponse(200, {}, "Event ignored"));
});
