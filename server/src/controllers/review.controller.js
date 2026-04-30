import { Review } from "../models/Review.model.js";
import { Product } from "../models/Product.model.js";
import { Order } from "../models/Order.model.js";
import ApiError from "../utils/helpers/errorHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";

const addReview = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { rating, title, body, images } = req.body;
    const userId = req.user._id;

    if (!rating || !body) {
        throw new ApiError(400, "Rating and body are required");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Check if user has already reviewed
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this product");
    }

    // Check if verified purchase
    const order = await Order.findOne({
        user: userId,
        "items.product": productId,
        orderStatus: "delivered"
    });

    const review = await Review.create({
        userId,
        productId,
        rating,
        title,
        body,
        images,
        verifiedPurchase: !!order
    });

    // Note: Product stats are updated via Review post-save middleware

    return res.status(201).json(new ApiResponse(201, review, "Review added successfully"));
});

const getProductReviews = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = "recent" } = req.query;
    const skip = (page - 1) * limit;

    let sortQuery = { createdAt: -1 };
    if (sort === "helpful") sortQuery = { helpfulVotes: -1 };

    const reviews = await Review.find({ productId: id })
        .populate("userId", "firstName lastName avatar")
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Review.countDocuments({ productId: id });

    return res.status(200).json(new ApiResponse(200, {
        data: reviews,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
    }, "Reviews fetched successfully"));
});

const voteHelpful = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
        id,
        { $inc: { helpfulVotes: 1 } },
        { new: true }
    );

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    return res.status(200).json(new ApiResponse(200, review, "Voted helpful successfully"));
});

export { addReview, getProductReviews, voteHelpful };
