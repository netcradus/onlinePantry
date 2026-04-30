import { Product } from "../models/Product.model.js";
import { Category } from "../models/category.model.js";
import ApiError from "../utils/helpers/errorHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const MAX_IMAGES = 5;

const createProduct = asyncHandler(async (req, res) => {
    let {
        name,
        slug,
        categoryId,
        description,
        price,
        ingredients, // Expecting array or stringified array
        benefits,
        usageInstructions,
        stock,
        sku,
        isFeatured,
        combos,
    } = req.body;
    console.log("req.body - from create product controller", req.body);

    if (!name || !categoryId || !description || !price) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    if (!slug) {
        slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    // Validate Category
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
        throw new ApiError(409, "Product with this slug already exists");
    }

    // Handle Images
    const imagesLocalPaths = req.files?.map((file) => file.path);
    if (!imagesLocalPaths || imagesLocalPaths.length === 0) {
        throw new ApiError(400, "At least one product image is required");
    }

    const imageUrls = await Promise.all(
        imagesLocalPaths.map(async (path) => {
            const uploaded = await uploadOnCloudinary(path);
            return uploaded?.secure_url;
        })
    );

    const validImageUrls = imageUrls.filter((url) => url !== null);

    if (validImageUrls.length === 0) {
        throw new ApiError(500, "Error uploading images");
    }

    const product = await Product.create({
        name,
        slug,
        category: categoryId,
        description,
        price,
        ingredients: Array.isArray(ingredients) ? ingredients : [], // Simple validation
        benefits: Array.isArray(benefits) ? benefits : [],
        combos: typeof combos === 'string' ? JSON.parse(combos) : (Array.isArray(combos) ? combos : []),
        usageInstructions,
        images: validImageUrls,
        stock: stock || 0,
        sku,
        isFeatured: isFeatured || false,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully"));
});

const getAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, search, minPrice, maxPrice, sort, concern } = req.query;

    const matchStage = {};

    if (category) {
        const cat = await Category.findOne({ $or: [{ _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }, { slug: category }] });
        if (cat) {
            matchStage.category = cat._id;
        }
    }

    if (search) {
        matchStage.name = { $regex: search, $options: "i" };
    }

    if (minPrice || maxPrice) {
        matchStage.price = {};
        if (minPrice) matchStage.price.$gte = Number(minPrice);
        if (maxPrice) matchStage.price.$lte = Number(maxPrice);
    }

    if (concern) {
        const concerns = concern.split(',');
        matchStage.benefits = { $in: concerns.map(c => new RegExp(c, 'i')) };
    }

    if (req.query.isFeatured) {
        matchStage.isFeatured = req.query.isFeatured === 'true';
    }

    let sortStage = { createdAt: -1 };
    if (sort) {
        switch (sort) {
            case 'price_asc':
                sortStage = { price: 1 };
                break;
            case 'price_desc':
                sortStage = { price: -1 };
                break;
            case 'category_asc':
                sortStage = { "category.name": 1 };
                break;
            case 'category_desc':
                sortStage = { "category.name": -1 };
                break;
            case 'oldest':
                sortStage = { createdAt: 1 };
                break;
            case 'newest':
            default:
                sortStage = { createdAt: -1 };
                break;
        }
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const pipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
            }
        },
        { $sort: sortStage },
        {
            $facet: {
                products: [
                    { $skip: skip },
                    { $limit: limitNum }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        }
    ];

    const result = await Product.aggregate(pipeline);
    const products = result[0].products;
    const total = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;

    return res
        .status(200)
        .json(new ApiResponse(200, { products, total, page: pageNum, pages: Math.ceil(total / limitNum) }, "Products fetched successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id).populate("category");
    } else {
        product = await Product.findOne({ slug: id }).populate("category");
    }

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product fetched successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    const fields = ["name", "slug", "description", "price", "stock", "sku", "isFeatured", "categoryId", "usageInstructions"];
    fields.forEach(field => {
        if (req.body[field] !== undefined) {
            if (field === "categoryId") product.category = req.body[field];
            else product[field] = req.body[field];
        }
    });

    if (req.body.ingredients) product.ingredients = req.body.ingredients;
    if (req.body.benefits) product.benefits = req.body.benefits;
    if (req.body.combos) product.combos = typeof req.body.combos === 'string' ? JSON.parse(req.body.combos) : req.body.combos;

    if (req.files && req.files.length > 0) {
        const imagesLocalPaths = req.files.map((file) => file.path);
        const imageUrls = await Promise.all(
            imagesLocalPaths.map(async (path) => {
                const uploaded = await uploadOnCloudinary(path);
                return uploaded?.secure_url;
            })
        );
        const valid = imageUrls.filter(u => u !== null);
        product.images.push(...valid);
    }

    await product.save();

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
