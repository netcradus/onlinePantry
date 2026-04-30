import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import {
    createOrder,
    verifyPayment,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getRevenueStats,
} from "../controllers/order.controller.js";

const router = Router();

// Strict Limiter for Payments
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 payment attempts per 15 mins
    message: "Too many payment attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

router.use(verifyJWT);

router.route("/").post(paymentLimiter, createOrder);
router.route("/verify").post(paymentLimiter, verifyPayment);
router.route("/my-orders").get(getMyOrders);
router.route("/admin/all").get(authorizeRoles("admin"), getAllOrders);
router.route("/admin/revenue").get(authorizeRoles("admin"), getRevenueStats);
router.route("/admin/status").patch(authorizeRoles("admin"), updateOrderStatus);

export default router;
