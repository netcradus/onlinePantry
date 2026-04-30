import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        brand: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        ingredients: [String],
        weight: {
            type: String, // e.g. "500g", "1kg"
        },
        unit: {
            type: String, // e.g. "each", "pack of 6"
        },
        nutritionFacts: {
            calories: Number,
            protein: Number,
            carbs: Number,
            fat: Number,
            fibre: Number,
        },
        price: {
            type: Number,
            required: true,
        },
        discountPrice: Number,
        images: [String], // cloudinary urls
        stock: {
            type: Number,
            default: 0,
        },
        sku: String,
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isOrganic: {
            type: Boolean,
            default: false,
        },
        countryOfOrigin: {
            type: String,
        },
        expiryDisplay: {
            type: String, // "Best before 6 months"
        },
        aisleNumber: {
            type: Number,
        },
        subscriptionEligible: {
            type: Boolean,
            default: false,
        },
        tags: [String], // for recipe linking
        ratingsCount: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        usageInstructions: String,
    },
    {
        timestamps: true,
    }
);

// Indexes for Performance
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ name: "text", brand: "text", tags: "text" }); // Text index for search

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
