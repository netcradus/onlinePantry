import { Blog } from "../models/Blog.model.js";
import ApiError from "../utils/helpers/errorHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";

export const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ isPublished: true })
        .populate("author", "firstName lastName")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("author", "firstName lastName");

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

export const createBlog = asyncHandler(async (req, res) => {
    const { title, content, tags } = req.body;

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    let imageUrl = "";
    if (req.file) {
        const result = await uploadOnCloudinary(req.file.path);
        if (result) imageUrl = result.url;
    }

    const blog = await Blog.create({
        title,
        slug: title.toLowerCase().split(" ").join("-") + "-" + Date.now(),
        content,
        author: req.user._id,
        image: imageUrl,
        tags: tags?.split(",").map(t => t.trim()),
        isPublished: true, // Default to true for Phase 1
    });

    return res
        .status(201)
        .json(new ApiResponse(201, blog, "Blog created successfully"));
});

export const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Blog deleted successfully"));
});
