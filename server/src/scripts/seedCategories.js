import mongoose from "mongoose";
import { Category } from "../models/category.model.js";
import { env } from "../configs/env.config.js";
import { categoriesData } from "./seedData.js";

const seedCategories = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing categories
        await Category.deleteMany({});
        console.log("Cleared existing categories.");

        // Insert new categories
        await Category.insertMany(categoriesData);
        console.log("Seeded grocery categories successfully!");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
};

seedCategories();
