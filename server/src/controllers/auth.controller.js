import { User } from "../models/User.model.js";
import { OTP } from "../models/OTP.model.js";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import ApiError from "../utils/helpers/errorHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";
import { env } from "../configs/env.config.js";
import logger from "../utils/logger/winston.config.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        logger.error("Error generating tokens: " + error.message, { stack: error.stack });
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and access token"
        );
    }
};

export const registerUser = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, role } = req.body;

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    // Default role is customer if not specified or if attempts to create admin without specific logic (optional security: force admin creation only via seed)
    // For now allowing role to be passed but strictly for this demo.
    const userRole = role || "customer";

    const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role: userRole,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged In Successfully"
            )
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
        };

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// OTP Methods

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        throw new ApiError(400, "Phone number is required");
    }

    const otp = generateOTP();

    // Save to DB
    await OTP.create({ phone, otp });

    // Send via Twilio (if configured)
    if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_PHONE_NUMBER) {
        try {
            const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
            await client.messages.create({
                body: `Your OnlinePantry verification code is: ${otp}`,
                from: env.TWILIO_PHONE_NUMBER,
                to: phone,
            });
        } catch (error) {
            logger.error("Twilio Error: ", error);
            // Don't fail the request if SMS fails in dev, just log it. 
            // In PROD, we might want to throw.
            if (env.NODE_ENV === "production") {
                throw new ApiError(500, "Failed to send SMS");
            }
        }
    } else {
        logger.info(`OTP for ${phone}: ${otp}`); // For Dev
    }

    return res.status(200).json(new ApiResponse(200, {}, "OTP sent successfully"));
});

export const verifyOTP = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        throw new ApiError(400, "Phone and OTP are required");
    }

    const otpRecord = await OTP.findOne({ phone, otp });

    if (!otpRecord) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    // OTP Valid. Check if user exists.
    const user = await User.findOne({ phone });

    // Delete OTP after usage
    await OTP.deleteOne({ _id: otpRecord._id });

    if (user) {
        // User exists -> Login
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser,
                        accessToken,
                        refreshToken,
                        isNewUser: false,
                    },
                    "User logged in successfully"
                )
            );
    } else {
        // User does not exist -> Return verification sign to allow registration
        // We can sign the phone number to ensure it was verified.
        const verificationToken = jwt.sign(
            { phone, verified: true },
            env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" } // 15 mins to register
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    isNewUser: true,
                    verificationToken,
                },
                "OTP verified. Please proceed to registration."
            )
        );
    }
});

export const registerCustomer = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, verificationToken } = req.body;

    if (!verificationToken) {
        throw new ApiError(400, "Verification token is required");
    }

    let phone;
    try {
        const decoded = jwt.verify(verificationToken, env.ACCESS_TOKEN_SECRET);
        if (!decoded.verified || !decoded.phone) {
            throw new ApiError(400, "Invalid verification token");
        }
        phone = decoded.phone;
    } catch (error) {
        throw new ApiError(400, "Invalid or expired verification token");
    }

    // Check if phone already taken (race condition)
    const existingUserByPhone = await User.findOne({ phone });
    if (existingUserByPhone) {
        throw new ApiError(409, "Phone number already registered. Please login.");
    }

    // Check email uniqueness if provided
    if (email) {
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            throw new ApiError(409, "Email already registered.");
        }
    }

    const user = await User.create({
        firstName,
        lastName,
        ...(email && { email }), // Only set email if provided
        phone,
        role: "customer",
        password: `pwd_${Date.now()}_${Math.random()}`, // Random password for OTP users
        isVerified: true, // Phone verified
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, { user: createdUser, accessToken, refreshToken }, "Customer registered successfully"));
});
