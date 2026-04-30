import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    selectedCombo: {
        type: String,
        required: false, // Optional for base product
    },
    multiplier: {
        type: Number,
        default: 1,
    },
    // Snapshots for data integrity
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false, default: "" },
});

const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
