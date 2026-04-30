import { Router } from "express";
import {
    getAllBlogs,
    getBlogBySlug,
    createBlog,
    deleteBlog,
} from "../controllers/blog.controller.js";
import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.route("/").get(getAllBlogs);
router.route("/:slug").get(getBlogBySlug);

// Admin routes
router.route("/").post(
    verifyJWT,
    authorizeRoles("admin"),
    upload.single("image"),
    createBlog
);

router.route("/:id").delete(
    verifyJWT,
    authorizeRoles("admin"),
    deleteBlog
);

export default router;
