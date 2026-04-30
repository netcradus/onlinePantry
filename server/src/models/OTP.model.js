
import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
    {
        phone: {
            type: String, // Made optional for email verification
        },
        email: {
            type: String,
        },
        otp: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["registration", "login", "forgot-password", "verify-email"],
            default: "login",
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => Date.now() + 10 * 60 * 1000,
            index: { expires: '10m' },
        },
    },
    { timestamps: true }
);

export const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);
