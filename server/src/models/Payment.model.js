import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        razorpayOrderId: {
            type: String,
            required: true,
        },
        razorpayPaymentId: {
            type: String,
        },
        razorpaySignature: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "INR",
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        },
        method: {
            type: String,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
        },
    },
    { timestamps: true }
);

// Idempotency: prevent duplicate payments
paymentSchema.index({ razorpayPaymentId: 1 }, { unique: true, sparse: true });

export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
