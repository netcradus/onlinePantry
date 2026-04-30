import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    sendOTP,
    verifyOTP,
    registerCustomer,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
    registerSchema,
    loginSchema,
} from "../utils/validators/user.validator.js";

const router = Router();

// Strict Limiter for Auth Routes (Prevents Brute Force)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 requests per hour
    message: "Too many login/register attempts, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
});

router.route("/register").post(authLimiter, validate(registerSchema), registerUser);
router.route("/login").post(authLimiter, validate(loginSchema), loginUser);

router.route("/send-otp").post(authLimiter, sendOTP);
router.route("/verify-otp").post(authLimiter, verifyOTP);
router.route("/register-customer").post(authLimiter, registerCustomer);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
