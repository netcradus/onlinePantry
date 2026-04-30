import mongoose, { Schema } from "mongoose";
import { Product } from "./Product.model.js";

const reviewSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            trim: true,
        },
        body: {
            type: String,
            required: true,
        },
        verifiedPurchase: {
            type: Boolean,
            default: false,
        },
        images: [String], // Cloudinary URLs
        helpfulVotes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent multiple reviews from same user for same product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// After save middleware: recalculate product.averageRating, product.ratingsCount.
reviewSchema.post("save", async function () {
    const Review = this.constructor;
    const stats = await Review.aggregate([
        { $match: { productId: this.productId } },
        {
            $group: {
                _id: "$productId",
                avgRating: { $avg: "$rating" },
                nRatings: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(this.productId, {
            averageRating: Math.round(stats[0].avgRating * 10) / 10,
            ratingsCount: stats[0].nRatings,
        });
    } else {
        await Product.findByIdAndUpdate(this.productId, {
            averageRating: 0,
            ratingsCount: 0,
        });
    }
});

export const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
