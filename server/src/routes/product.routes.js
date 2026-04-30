import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from "../controllers/product.controller.js";
import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.route("/").get(getAllProducts);
router.route("/:id").get(getProductById);

// Secured routes
router.use(verifyJWT);
router.use(authorizeRoles("admin"));

router
    .route("/")
    .post(upload.array("images", 5), createProduct);

router
    .route("/:id")
    .patch(upload.array("images", 5), updateProduct)
    .delete(deleteProduct);

export default router;
