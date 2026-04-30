import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    syncCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getCart).post(addToCart).patch(updateCartItemQuantity);
router.route("/sync").post(syncCart);
router.route("/:productId").delete(removeFromCart);

export default router;
