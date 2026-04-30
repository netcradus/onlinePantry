import asyncHandler from "../utils/helpers/asyncHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import ApiError from "../utils/helpers/errorHandler.js";
import { Cart } from "../models/Cart.model.js";
import { Product } from "../models/Product.model.js";

export const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name price images price discountPrice");

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    return res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, selectedCombo } = req.body;
    const userId = req.user._id;

    // Fetch product to get snapshot details
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let finalPrice = product.discountPrice || product.price;
    let multiplier = 1;
    let comboName = null;

    // --- COMBO VALIDATION (Security Hardening) ---
    if (selectedCombo) {
        const combo = product.combos?.find(c => c.name === selectedCombo);
        if (!combo) {
            throw new ApiError(400, "Invalid combo selected");
        }
        finalPrice = combo.price;
        multiplier = combo.multiplier;
        comboName = combo.name;
    }

    // Check Stock (considering multiplier)
    const requiredStock = quantity * multiplier;
    if (product.stock < requiredStock) {
        throw new ApiError(400, `Insufficient stock. Required: ${requiredStock}, Available: ${product.stock}`);
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [
                {
                    product: productId,
                    quantity,
                    name: product.name,
                    price: finalPrice,
                    image: product.images?.[0] || "",
                    selectedCombo: comboName,
                    multiplier
                },
            ],
        });
    } else {
        // Find item match (Product ID + Combo must match)
        const itemIndex = cart.items.findIndex((item) => {
            const sameProduct = item.product.toString() === productId;
            const sameCombo = item.selectedCombo === comboName || (!item.selectedCombo && !comboName);
            return sameProduct && sameCombo;
        });

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            // Update snapshot prices/details
            cart.items[itemIndex].name = product.name;
            cart.items[itemIndex].price = finalPrice;
            cart.items[itemIndex].image = product.images?.[0] || "";
            cart.items[itemIndex].multiplier = multiplier; // Ensure multiplier is sync
        } else {
            cart.items.push({
                product: productId,
                quantity,
                name: product.name,
                price: finalPrice,
                image: product.images?.[0] || "",
                selectedCombo: comboName,
                multiplier
            });
        }
    }
    await cart.save();

    // Populate for response
    await cart.populate("items.product");

    return res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product", "name price images price discountPrice");

    return res.status(200).json(new ApiResponse(200, updatedCart, "Item removed from cart"));
});

export const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
        if (quantity > 0) {
            cart.items[existingItemIndex].quantity = quantity;
        } else {
            // If quantity is 0 or less, remove item
            cart.items.splice(existingItemIndex, 1);
        }
    } else {
        throw new ApiError(404, "Item not found in cart");
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.product", "name price images price discountPrice");

    return res.status(200).json(new ApiResponse(200, updatedCart, "Cart updated"));
});


export const syncCart = asyncHandler(async (req, res) => {
    const { localCartItems } = req.body; // Array of { product: id, quantity: n }

    if (!localCartItems || !Array.isArray(localCartItems)) {
        // Just return existing server cart if no local items
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name price images price discountPrice");
        return res.status(200).json(new ApiResponse(200, cart, "Cart synced"));
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Merge logic
    for (const localItem of localCartItems) {
        const product = await Product.findById(localItem.product);
        if (!product) continue;

        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === localItem.product
        );

        if (existingItemIndex > -1) {
            // Optional: Strategy to add or replace. Usually adding is safer for merging guest sessions.
            cart.items[existingItemIndex].quantity += localItem.quantity;
            // Update snapshot prices/details
            cart.items[existingItemIndex].name = product.name;
            cart.items[existingItemIndex].price = product.discountPrice || product.price;
            cart.items[existingItemIndex].image = product.images?.[0] || "";
        } else {
            cart.items.push({
                product: localItem.product,
                quantity: localItem.quantity,
                name: product.name,
                price: product.discountPrice || product.price,
                image: product.images?.[0] || "",
            });
        }
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.product", "name price images price discountPrice");

    return res.status(200).json(new ApiResponse(200, updatedCart, "Cart merged successfully"));
});
