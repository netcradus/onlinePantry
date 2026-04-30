import { Router } from "express";
import { 
    getCategoryTree, 
    getCategoryBySlug, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/category.controller.js";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getCategoryTree);
router.route("/:slug").get(getCategoryBySlug);

// Protected routes (Admin only)
router.route("/").post(verifyJWT, isAdmin, createCategory);
router.route("/:id")
    .put(verifyJWT, isAdmin, updateCategory)
    .delete(verifyJWT, isAdmin, deleteCategory);

export default router;
