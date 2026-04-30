import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
    selectedCombo: {
        type: String,
        required: false,
    },
    multiplier: {
        type: Number,
        default: 1,
    },
    image: {
        type: String,
        required: false,
        default: ""
    },
});

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [orderItemSchema],
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true },
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentMode: {
            type: String,
            enum: ["razorpay", "whatsapp"],
            default: "razorpay"
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "pending_payment", "paid", "failed", "refunded"],
            default: "pending",
        },
        orderStatus: {
            type: String,
            enum: ["processing", "awaiting_confirmation", "confirmed", "packing", "dispatched", "reached_station", "out_for_delivery", "delivered", "cancelled"],
            default: "processing",
        },
        paymentId: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
        },
        deliveredAt: {
            type: Date,
        },
        confirmedAt: {
            type: Date,
        },
        confirmedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        notifications: {
            whatsappSent: { type: Boolean, default: false },
            smsSent: { type: Boolean, default: false },
            notifiedAt: { type: Date },
        },
        deliverySlot: {
            type: Schema.Types.ObjectId,
            ref: "DeliverySlot",
        },
        subscriptionId: {
            type: Schema.Types.ObjectId,
            ref: "Subscription",
        },
    },
    { timestamps: true }
);

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
