import { Testimonial } from "../models/Testimonial.model.js";
import ApiError from "../utils/helpers/errorHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";

export const getAllTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, testimonials, "Testimonials fetched successfully"));
});

export const createTestimonial = asyncHandler(async (req, res) => {
    const { name, message, rating, avatar } = req.body;

    if (!name || !message) {
        throw new ApiError(400, "Name and message are required");
    }

    const testimonial = await Testimonial.create({
        name,
        message,
        rating: rating || 5,
        avatar,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, testimonial, "Testimonial created successfully"));
});

export const updateTestimonial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, message, rating, avatar, isActive } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        { name, message, rating, avatar, isActive },
        { new: true, runValidators: true }
    );

    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, testimonial, "Testimonial updated successfully"));
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Testimonial deleted successfully"));
});
