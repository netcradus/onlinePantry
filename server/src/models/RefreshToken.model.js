import mongoose, { Schema } from "mongoose";

const refreshTokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
        revoked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const RefreshToken = mongoose.models.RefreshToken || mongoose.model("RefreshToken", refreshTokenSchema);
