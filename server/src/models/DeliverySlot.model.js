import mongoose, { Schema } from "mongoose";

const deliverySlotSchema = new Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String, // "09:00"
            required: true,
        },
        endTime: {
            type: String, // "11:00"
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
            default: 40,
        },
        booked: {
            type: Number,
            default: 0,
        },
        zone: {
            type: String, // delivery postcode zone
            required: true,
        },
        price: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual field to check availability
deliverySlotSchema.virtual("isAvailable").get(function () {
    return this.booked < this.capacity;
});

// Static query helper to get available slots for a date and zone
deliverySlotSchema.statics.getAvailableForDate = function (date, zone) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.find({
        date: { $gte: startOfDay, $lte: endOfDay },
        zone: zone,
        $expr: { $lt: ["$booked", "$capacity"] }
    });
};

// Atomic booking method
deliverySlotSchema.statics.book = async function (slotId) {
    const result = await this.findOneAndUpdate(
        {
            _id: slotId,
            $expr: { $lt: ["$booked", "$capacity"] }
        },
        { $inc: { booked: 1 } },
        { new: true }
    );
    
    if (!result) {
        throw new Error("Slot is full or not found");
    }
    
    return result;
};

export const DeliverySlot = mongoose.models.DeliverySlot || mongoose.model("DeliverySlot", deliverySlotSchema);
