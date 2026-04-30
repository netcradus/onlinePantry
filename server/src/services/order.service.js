import { Product } from "../models/Product.model.js";
import { Order } from "../models/Order.model.js";
import { Payment } from "../models/Payment.model.js";
import { Cart } from "../models/Cart.model.js";
import { NotificationService } from "./notification.service.js";
import { broadcastToRole, emitToUser } from "../socket/socket.js";

export const OrderService = {
    /**
     * Fulfills an order: Atomic Stock Decrement -> Order Create -> Payment Record -> Cart Clear
     */
    fulfillOrder: async ({ user, cartItems, shippingAddress, totalAmount, paymentDetails, deliverySlotId }) => {
        const decrementedProducts = [];
        const orderItems = [];

        try {
            // 1. Prepare Order Items
            for (const item of cartItems) {
                const price = item.product.discountPrice || item.product.price;

                const orderItem = {
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: price,
                    image: item.product.images?.[0] || ""
                };

                orderItems.push(orderItem);
            }

            // 2. Atomic Stock Decrement
            for (const item of orderItems) {
                const updatedProduct = await Product.updateOne(
                    { _id: item.product, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } }
                );

                if (updatedProduct.modifiedCount === 0) {
                    throw new Error(`Stock conflict for ${item.name}`);
                }

                decrementedProducts.push({ id: item.product, quantity: item.quantity });
            }

            // 3. Create DB Order
            const order = await Order.create({
                user: user._id,
                items: orderItems,
                shippingAddress,
                totalAmount,
                paymentStatus: "paid",
                orderStatus: "processing",
                deliverySlot: deliverySlotId
            });

            // 4. Create Payment Record
            const payment = await Payment.create({
                razorpayOrderId: paymentDetails.razorpayOrderId,
                razorpayPaymentId: paymentDetails.razorpayPaymentId,
                razorpaySignature: paymentDetails.razorpaySignature,
                amount: totalAmount,
                currency: "GBP",
                user: user._id,
                order: order._id,
                status: "success",
            });

            order.paymentId = payment._id;
            await order.save();

            // 5. Clear Cart
            await Cart.findOneAndUpdate({ user: user._id }, { $set: { items: [] } });

            // 6. Real-time Events
            broadcastToRole("admin", "new_order", { orderId: order._id, total: totalAmount });
            
            // Notify User
            emitToUser(user._id, "order_status_update", { 
                orderId: order._id, 
                status: "processing",
                message: "Your order has been placed successfully!"
            });

            // 7. Notifications (Non-blocking)
            try {
                await NotificationService.sendOrderPlaced(user, order);
            } catch (notifyError) {
                console.error("Failed to send notification:", notifyError);
            }

            return { order, payment };

        } catch (error) {
            console.error("Order Fulfillment Failed. Rolling back stock...", error.message);
            for (const record of decrementedProducts) {
                await Product.updateOne({ _id: record.id }, { $inc: { stock: record.quantity } });
            }
            throw error;
        }
    }
};
