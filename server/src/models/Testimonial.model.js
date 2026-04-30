import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5,
        },
        avatar: String,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
