import { Router } from "express";
import { addReview, getProductReviews, voteHelpful } from "../controllers/review.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.route("/product/:id").get(getProductReviews);

// Protected routes
router.route("/product/:productId").post(verifyJWT, addReview);
router.route("/:id/helpful").put(verifyJWT, voteHelpful);

export default router;
