import mongoose, { Schema } from "mongoose";

const recipeSchema = new Schema(
    {
        title: {
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
        description: {
            type: String,
            required: true,
        },
        heroImage: {
            type: String, // Cloudinary URL
        },
        prepTime: {
            type: Number, // minutes
        },
        cookTime: {
            type: Number, // minutes
        },
        servings: {
            type: Number,
            default: 1,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium",
        },
        cuisine: {
            type: String,
        },
        tags: [String],
        ingredients: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: false, // nullable for items not in pantry
                },
                name: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: String, // "200g", "2 cloves"
                },
                isOptional: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        steps: [
            {
                order: Number,
                text: String,
                imageUrl: String,
            },
        ],
        nutritionPer100g: {
            calories: Number,
            protein: Number,
            carbs: Number,
            fat: Number,
        },
        author: {
            type: String,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

recipeSchema.index({ tags: 1 });

export const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
