import { Product } from "../models/Product.model.js";
import { Category } from "../models/category.model.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";

const searchProducts = asyncHandler(async (req, res) => {
    const {
        q,
        category,
        min,
        max,
        sort = "relevance",
        isOrganic,
        page = 1,
        limit = 20
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build base match
    const matchStage = { isActive: true };

    if (q) {
        matchStage.$text = { $search: q };
    }

    if (isOrganic === "true") {
        matchStage.isOrganic = true;
    }

    if (min !== undefined || max !== undefined) {
        matchStage.price = {};
        if (min !== undefined && min !== '') matchStage.price.$gte = parseFloat(min);
        if (max !== undefined && max !== '') matchStage.price.$lte = parseFloat(max);
        if (Object.keys(matchStage.price).length === 0) delete matchStage.price;
    }

    // Resolve category slug → ObjectId in one query (only when needed)
    if (category) {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);
        const cat = isObjectId
            ? await Category.findById(category).select("_id").lean()
            : await Category.findOne({ slug: category.toLowerCase() }).select("_id").lean();
        if (cat) {
            matchStage.category = cat._id;
        } else {
            // Unknown category → return empty immediately, no DB scan needed
            return res.status(200).json(new ApiResponse(200, {
                data: [],
                total: 0,
                page: pageNum,
                pages: 0,
                facets: { categories: [], priceRange: { min: 0, max: 100 }, dietary: ["Organic", "Vegan", "Gluten-free"] }
            }, "Search results fetched successfully"));
        }
    }

    // Build sort
    let sortStage = { createdAt: -1 };
    if (sort === "relevance" && q) {
        sortStage = { score: { $meta: "textScore" } };
    } else if (sort === "price_asc") {
        sortStage = { price: 1 };
    } else if (sort === "price_desc") {
        sortStage = { price: -1 };
    } else if (sort === "newest") {
        sortStage = { createdAt: -1 };
    } else if (sort === "rating") {
        sortStage = { averageRating: -1 };
    }

    // Single aggregation: products + count + categories in one round-trip
    const [result, categories] = await Promise.all([
        Product.aggregate([
            { $match: matchStage },
            ...(q ? [{ $addFields: { score: { $meta: "textScore" } } }] : []),
            { $sort: sortStage },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limitNum },
                        {
                            $lookup: {
                                from: "categories",
                                localField: "category",
                                foreignField: "_id",
                                as: "category",
                                pipeline: [{ $project: { name: 1, slug: 1 } }]
                            }
                        },
                        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
                        // Only return fields the frontend needs
                        {
                            $project: {
                                name: 1, slug: 1, brand: 1, price: 1, discountPrice: 1,
                                images: { $slice: ["$images", 1] }, // only first image
                                weight: 1, isOrganic: 1, isFeatured: 1, stock: 1,
                                category: 1, averageRating: 1,
                            }
                        }
                    ],
                    total: [{ $count: "count" }]
                }
            }
        ]).allowDiskUse(false),
        Category.find({ isVisible: true }).select("name slug").lean(),
    ]);

    const data = result[0]?.data || [];
    const total = result[0]?.total?.[0]?.count || 0;

    // Light HTTP cache: 60 seconds for unauthenticated catalog browsing
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=120");

    return res.status(200).json(new ApiResponse(200, {
        data,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        facets: {
            categories,
            priceRange: { min: 0, max: 100 },
            dietary: ["Organic", "Vegan", "Gluten-free"]
        }
    }, "Search results fetched successfully"));
});

export { searchProducts };
