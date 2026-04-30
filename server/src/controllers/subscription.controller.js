import { Subscription } from "../models/Subscription.model.js";
import { Order } from "../models/Order.model.js";
import ApiError from "../utils/helpers/errorHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";

const getSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({ userId: req.user._id }).populate("items.productId");
    return res.status(200).json(new ApiResponse(200, subscriptions, "Subscriptions fetched successfully"));
});

const createSubscription = asyncHandler(async (req, res) => {
    const { items, frequency, preferredSlotTime } = req.body;
    
    if (!items || items.length === 0) {
        throw new ApiError(400, "Items are required");
    }

    // Calculate next delivery date (e.g. tomorrow)
    const nextDelivery = new Date();
    nextDelivery.setDate(nextDelivery.getDate() + 1);

    const subscription = await Subscription.create({
        userId: req.user._id,
        items,
        frequency,
        nextDelivery,
        preferredSlotTime,
        status: "active",
    });

    return res.status(201).json(new ApiResponse(201, subscription, "Subscription created successfully"));
});

const updateSubscription = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { items, frequency, status, preferredSlotTime } = req.body;

    const subscription = await Subscription.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { $set: { items, frequency, status, preferredSlotTime } },
        { new: true }
    );

    if (!subscription) {
        throw new ApiError(404, "Subscription not found");
    }

    return res.status(200).json(new ApiResponse(200, subscription, "Subscription updated successfully"));
});

const cancelSubscription = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subscription = await Subscription.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { $set: { status: "cancelled" } },
        { new: true }
    );

    if (!subscription) {
        throw new ApiError(404, "Subscription not found");
    }

    return res.status(200).json(new ApiResponse(200, subscription, "Subscription cancelled successfully"));
});

const getSubscriptionHistory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const orders = await Order.find({ subscriptionId: id, user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, orders, "Subscription history fetched successfully"));
});

export { getSubscriptions, createSubscription, updateSubscription, cancelSubscription, getSubscriptionHistory };
