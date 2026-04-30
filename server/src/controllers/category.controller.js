import { Category } from "../models/category.model.js";
import { Product } from "../models/Product.model.js";
import ApiError from "../utils/helpers/errorHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";

// Recursive function to build category tree
const buildCategoryTree = (categories, parentId = null) => {
    const tree = [];
    categories
        .filter(cat => String(cat.parentId) === String(parentId))
        .forEach(cat => {
            const children = buildCategoryTree(categories, cat._id);
            const node = { ...cat.toObject(), children };
            tree.push(node);
        });
    return tree;
};

const getCategoryTree = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isVisible: true }).sort({ sortOrder: 1 });
    const tree = buildCategoryTree(categories);
    return res.status(200).json(new ApiResponse(200, tree, "Category tree fetched successfully"));
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, isVisible: true });

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    // Get subtree
    const allCategories = await Category.find({ isVisible: true }).sort({ sortOrder: 1 });
    const subtree = buildCategoryTree(allCategories, category._id);

    // Get products in this category (and potentially subcategories)
    const subCategoryIds = [category._id];
    const findChildren = (catId) => {
        allCategories.forEach(c => {
            if (String(c.parentId) === String(catId)) {
                subCategoryIds.push(c._id);
                findChildren(c._id);
            }
        });
    };
    findChildren(category._id);

    const products = await Product.find({ category: { $in: subCategoryIds }, isActive: true })
        .limit(20);

    return res.status(200).json(new ApiResponse(200, {
        category,
        subtree,
        products
    }, "Category details fetched successfully"));
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, slug, description, parentId, image, sortOrder } = req.body;

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
        throw new ApiError(400, "Category with this slug already exists");
    }

    const category = await Category.create({
        name,
        slug,
        description,
        parentId: parentId || null,
        image,
        sortOrder,
    });

    return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) throw new ApiError(404, "Category not found");
    return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Soft delete
    const category = await Category.findByIdAndUpdate(id, { isVisible: false }, { new: true });
    if (!category) throw new ApiError(404, "Category not found");
    return res.status(200).json(new ApiResponse(200, {}, "Category soft-deleted successfully"));
});

export { 
    getCategoryTree, 
    getCategoryBySlug, 
    createCategory, 
    updateCategory, 
    deleteCategory 
};
