import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        frequency: {
            type: String,
            enum: ["weekly", "fortnightly", "monthly"],
            required: true,
        },
        nextDelivery: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "paused", "cancelled"],
            default: "active",
        },
        preferredSlotTime: {
            type: String, // "morning" | "afternoon" | "evening"
            required: true,
        },
        discountPct: {
            type: Number,
            default: 5,
        },
        totalOrders: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
