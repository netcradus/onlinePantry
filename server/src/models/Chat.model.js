import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
    },
    { timestamps: true }
);

export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
