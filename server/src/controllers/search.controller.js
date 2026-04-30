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

    const skip = (page - 1) * limit;

    // Build Query
    let query = { isActive: true };
    
    if (q) {
        query.$text = { $search: q };
    }

    if (category) {
        const cat = await Category.findOne({ 
            $or: [
                { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }, 
                { slug: category.toLowerCase() }
            ] 
        });
        if (cat) query.category = cat._id;
    }

    if (min !== undefined || max !== undefined) {
        query.price = {};
        if (min !== undefined && min !== '') query.price.$gte = parseFloat(min);
        if (max !== undefined && max !== '') query.price.$lte = parseFloat(max);
        
        // Remove empty price query if neither min nor max were valid numbers
        if (Object.keys(query.price).length === 0) delete query.price;
    }

    if (isOrganic === "true") {
        query.isOrganic = true;
    }

    // Build Sort
    let sortOptions = {};
    if (sort === "relevance" && q) {
        sortOptions.score = { $meta: "textScore" };
    } else if (sort === "price_asc") {
        sortOptions.price = 1;
    } else if (sort === "price_desc") {
        sortOptions.price = -1;
    } else if (sort === "newest") {
        sortOptions.createdAt = -1;
    } else if (sort === "rating") {
        sortOptions.averageRating = -1;
    }

    // Execute Search
    const products = await Product.find(query, q ? { score: { $meta: "textScore" } } : {})
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("category", "name slug");

    const total = await Product.countDocuments(query);

    // Get Facets
    const categories = await Category.find({ isVisible: true }).select("name slug");

    return res.status(200).json(new ApiResponse(200, {
        data: products,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        facets: {
            categories,
            priceRange: { min: 0, max: 100 },
            dietary: ["Organic", "Vegan", "Gluten-free"]
        }
    }, "Search results fetched successfully"));
});

export { searchProducts };
