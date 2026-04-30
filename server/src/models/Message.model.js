import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        chat: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        attachments: [
            {
                url: String,
                type: String,
            },
        ],
        readBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
