import asyncHandler from "../utils/helpers/asyncHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import ApiError from "../utils/helpers/errorHandler.js";
import { User } from "../models/User.model.js";
import { OTP } from "../models/OTP.model.js";
import { sendEmail } from "../services/notification.service.js";
import logger from "../utils/logger/winston.config.js";

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});

export const updateAddress = asyncHandler(async (req, res) => {
    const { street, city, state, zip, country, isDefault } = req.body;

    // Simplified address update: just pushing to array for now
    const user = await User.findById(req.user._id);

    // If setting default, unset others
    if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({ street, city, state, zip, country, isDefault });
    await user.save();

    return res.status(200).json(new ApiResponse(200, user, "Address added successfully"));
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, phone } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                firstName,
                lastName,
                phone: phone || undefined // Start using undefined for sparse unique index if not provided, though typically sent empty. Better: use what's passed.
            }
        },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
    // Admin only
    const users = await User.find({ role: "customer" }).select("-password -refreshToken").sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const getUserDetails = asyncHandler(async (req, res) => {
    // Admin only
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");

    // Also fetch orders for this user to simplify frontend
    const { Order } = await import("../models/Order.model.js"); // Importing here to avoid circular dep if any, though likely fine at top
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, { user, orders }, "User details fetched successfully"));
});

export const sendEmailOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    // Check if email already in use by another user
    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
        throw new ApiError(409, "Email is already registered to another account");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB
    await OTP.create({ email, otp, type: "verify-email" });

    // Send Email
    const subject = "Verify your email address - Online Pantry";
    const message = `Your email verification code is: ${otp}\nThis code will expire in 10 minutes.`;

    // In dev or if SENDGRID_API_KEY is not configured, it will fallback to console.log inside sendEmail
    const sent = await sendEmail(email, subject, message);

    if (!sent) {
        logger.info(`Email Verification OTP for ${email}: ${otp}`); // For Dev if email fails
    }

    return res.status(200).json(new ApiResponse(200, {}, "Email verification OTP sent successfully"));
});

export const verifyEmailOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const otpRecord = await OTP.findOne({ email, otp, type: "verify-email" });

    if (!otpRecord) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    // Update User Email
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { email } },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    // Delete OTP after usage
    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json(new ApiResponse(200, user, "Email updated successfully"));
});
