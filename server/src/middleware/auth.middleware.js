import jwt from "jsonwebtoken";
import ApiError from "../utils/helpers/errorHandler.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";
import { User } from "../models/User.model.js";
import { env } from "../configs/env.config.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(
                403,
                `Role: ${req.user.role} is not allowed to access this resource`
            );
        }
        next();
    };
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Admin resource! Access denied");
    }
    next();
};
