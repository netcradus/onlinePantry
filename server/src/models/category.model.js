import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
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
        description: {
            type: String,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        image: {
            type: String, // Cloudinary URL
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        isVisible: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for hierarchical queries and slug lookups
categorySchema.index({ parentId: 1 });

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
