import { Recipe } from "../models/Recipe.model.js";
import { Cart } from "../models/Cart.model.js";
import ApiError from "../utils/helpers/errorHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";

const getRecipes = asyncHandler(async (req, res) => {
    const { tag, cuisine, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = { isPublished: true };
    if (tag) query.tags = tag;
    if (cuisine) query.cuisine = cuisine;

    const recipes = await Recipe.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    
    const total = await Recipe.countDocuments(query);

    return res.status(200).json(new ApiResponse(200, {
        data: recipes,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
    }, "Recipes fetched successfully"));
});

const getRecipeBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const recipe = await Recipe.findOne({ slug, isPublished: true }).populate("ingredients.productId");

    if (!recipe) {
        throw new ApiError(404, "Recipe not found");
    }

    return res.status(200).json(new ApiResponse(200, recipe, "Recipe fetched successfully"));
});

const createRecipe = asyncHandler(async (req, res) => {
    const recipeData = req.body;
    const recipe = await Recipe.create(recipeData);
    return res.status(201).json(new ApiResponse(201, recipe, "Recipe created successfully"));
});

const updateRecipe = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndUpdate(id, req.body, { new: true });
    if (!recipe) throw new ApiError(404, "Recipe not found");
    return res.status(200).json(new ApiResponse(200, recipe, "Recipe updated successfully"));
});

const addRecipeItemsToCart = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate("ingredients.productId");

    if (!recipe) {
        throw new ApiError(404, "Recipe not found");
    }

    const linkedProducts = recipe.ingredients
        .filter(ing => ing.productId)
        .map(ing => ({
            product: ing.productId._id,
            quantity: 1 // Default to 1, user can adjust in cart
        }));

    if (linkedProducts.length === 0) {
        throw new ApiError(400, "No pantry-linked products found in this recipe");
    }

    // Add to user's cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    for (const item of linkedProducts) {
        const itemIndex = cart.items.findIndex(i => i.product.toString() === item.product.toString());
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1;
        } else {
            cart.items.push(item);
        }
    }

    await cart.save();

    return res.status(200).json(new ApiResponse(200, cart, "Recipe ingredients added to cart"));
});

export { getRecipes, getRecipeBySlug, createRecipe, updateRecipe, addRecipeItemsToCart };
