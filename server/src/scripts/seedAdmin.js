import mongoose from "mongoose";
import { User } from "../models/User.model.js";
import { env } from "../configs/env.config.js";

const seedAdmin = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("Connected to DB");

        const adminEmail = "admin@pantry.com";
        const adminPassword = "adminpassword123";

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        await User.create({
            firstName: "Pantry",
            lastName: "Admin",
            email: adminEmail,
            password: adminPassword,
            role: "admin",
            isVerified: true
        });

        console.log("Admin created successfully");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
