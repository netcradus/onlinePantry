import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    getUserProfile,
    updateAddress,
    updateUserProfile,
    getAllUsers,
    getUserDetails,
    sendEmailOtp,
    verifyEmailOtp
} from "../controllers/user.controller.js";

const router = Router();

router.use(verifyJWT); // Secure all routes

router.route("/profile").get(getUserProfile).patch(updateUserProfile);
router.route("/admin/all").get(getAllUsers);
router.route("/admin/:userId").get(getUserDetails);
router.route("/address").post(updateAddress);

// Email Verification
router.route("/send-email-otp").post(sendEmailOtp);
router.route("/verify-email-otp").post(verifyEmailOtp);

export default router;
