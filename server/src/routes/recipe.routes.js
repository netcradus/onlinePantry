import { Router } from "express";
import { 
    getRecipes, 
    getRecipeBySlug, 
    createRecipe, 
    updateRecipe, 
    addRecipeItemsToCart 
} from "../controllers/recipe.controller.js";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getRecipes);
router.route("/:slug").get(getRecipeBySlug);

// Protected routes
router.route("/").post(verifyJWT, isAdmin, createRecipe);
router.route("/:id").put(verifyJWT, isAdmin, updateRecipe);
router.route("/:id/add-to-cart").post(verifyJWT, addRecipeItemsToCart);

export default router;
