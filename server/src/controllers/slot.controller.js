import { DeliverySlot } from "../models/DeliverySlot.model.js";
import ApiError from "../utils/helpers/errorHandler.js";
import ApiResponse from "../utils/helpers/apiResponse.js";
import asyncHandler from "../utils/helpers/asyncHandler.js";

const getSlots = asyncHandler(async (req, res) => {
    const { date, zone } = req.query;
    if (!date || !zone) {
        throw new ApiError(400, "Date and zone are required");
    }

    const slots = await DeliverySlot.getAvailableForDate(date, zone);
    return res.status(200).json(new ApiResponse(200, slots, "Available slots fetched successfully"));
});

const createSlotsBulk = asyncHandler(async (req, res) => {
    const { slots } = req.body; // Array of slot objects { date, startTime, endTime, capacity, zone, price }
    if (!Array.isArray(slots) || slots.length === 0) {
        throw new ApiError(400, "Slots array is required");
    }

    const createdSlots = await DeliverySlot.insertMany(slots);
    return res.status(201).json(new ApiResponse(201, createdSlots, "Slots created successfully"));
});

const updateSlot = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { capacity, price } = req.body;

    const slot = await DeliverySlot.findByIdAndUpdate(
        id,
        { $set: { capacity, price } },
        { new: true }
    );

    if (!slot) {
        throw new ApiError(404, "Slot not found");
    }

    return res.status(200).json(new ApiResponse(200, slot, "Slot updated successfully"));
});

const deleteSlot = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const slot = await DeliverySlot.findByIdAndDelete(id);

    if (!slot) {
        throw new ApiError(404, "Slot not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Slot deleted successfully"));
});

export { getSlots, createSlotsBulk, updateSlot, deleteSlot };
