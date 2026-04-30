import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../models/Product.model.js";
import { User } from "../models/User.model.js";
import { Review } from "../models/Review.model.js";

dotenv.config();

const REVIEW_COMMENTS = {
    positive: [
        "Absolutely love this product! Highly recommended.",
        "Great quality and fast delivery. Will order again.",
        "Really effective, started seeing results in a week.",
        "The best herbal product I have used so far.",
        "Excellent packaging and genuine product.",
        "Value for money. Very satisfied with the purchase.",
        "Tastes good and feels very natural.",
        "My family uses this regularly, very reliable.",
        "Five stars! Exceeded my expectations.",
        "A must-have for daily wellness routine."
    ],
    neutral: [
        "Good product, but delivery was delayed.",
        "It's okay, not bad but not great either.",
        "Decent quality for the price.",
        "Met expectations, nothing extraordinary.",
        "Product is fine, but packaging could be better."
    ]
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Fetch all products
        const products = await Product.find({});
        if (products.length === 0) {
            console.log("No products found. Run seedProducts.js first.");
            process.exit(1);
        }

        // Fetch generic users (excluding admins if possible, though not strictly necessary for seeding)
        let users = await User.find({ role: { $ne: "admin" } });

        // If fewer than 5 users, create some dummy users
        if (users.length < 5) {
            console.log("Creating dummy users for reviews...");
            const dummyUsers = [
                { firstName: "Aarav", lastName: "Sharma", email: "aarav.sharma@example.com", password: "password123", phone: "9876543210" },
                { firstName: "Vivaan", lastName: "Patel", email: "vivaan.patel@example.com", password: "password123", phone: "9876543211" },
                { firstName: "Aditya", lastName: "Gupta", email: "aditya.gupta@example.com", password: "password123", phone: "9876543212" },
                { firstName: "Vihaan", lastName: "Singh", email: "vihaan.singh@example.com", password: "password123", phone: "9876543213" },
                { firstName: "Arjun", lastName: "Reddy", email: "arjun.reddy@example.com", password: "password123", phone: "9876543214" },
                { firstName: "Sai", lastName: "Kumar", email: "sai.kumar@example.com", password: "password123", phone: "9876543215" },
                { firstName: "Reyansh", lastName: "Joshi", email: "reyansh.joshi@example.com", password: "password123", phone: "9876543216" },
                { firstName: "Ayaan", lastName: "Mehta", email: "ayaan.mehta@example.com", password: "password123", phone: "9876543217" },
                { firstName: "Krishna", lastName: "Iyer", email: "krishna.iyer@example.com", password: "password123", phone: "9876543218" },
                { firstName: "Ishaan", lastName: "Verma", email: "ishaan.verma@example.com", password: "password123", phone: "9876543219" }
            ];

            for (const u of dummyUsers) {
                const exists = await User.findOne({ email: u.email });
                if (!exists) {
                    await User.create(u);
                }
            }
            users = await User.find({ role: { $ne: "admin" } });
        }

        console.log(`Found ${products.length} products and ${users.length} users.`);

        // Clear existing reviews? Maybe strictly for seeding purposes, but let's be careful.
        // Let's just append for now, or maybe checks if reviews exist.
        // Actually, for a clean seed, clearing is often better.
        // await Review.deleteMany({});
        // console.log("Cleared existing reviews.");

        let reviewCount = 0;

        for (const product of products) {
            // Check if product already has reviews
            const existingReviewsCount = await Review.countDocuments({ product: product._id });
            if (existingReviewsCount > 3) continue; // Skip if already populated

            // Generate 3-7 reviews per product
            const numReviews = Math.floor(Math.random() * 5) + 3;
            // Shuffle users to pick random reviewers
            const shuffledUsers = users.sort(() => 0.5 - Math.random()).slice(0, numReviews);

            for (const user of shuffledUsers) {
                // Mix of 4 and 5 star ratings mostly, some neutral
                const isPositive = Math.random() > 0.2;
                const rating = isPositive ? (Math.random() > 0.7 ? 5 : 4) : 3;
                const comment = isPositive ? getRandomElement(REVIEW_COMMENTS.positive) : getRandomElement(REVIEW_COMMENTS.neutral);

                // Set created date to some time in the past
                const daysAgo = Math.floor(Math.random() * 30);
                const createdAt = new Date();
                createdAt.setDate(createdAt.getDate() - daysAgo);

                await Review.create({
                    user: user._id,
                    product: product._id,
                    rating,
                    comment,
                    isVerifiedPurchase: Math.random() > 0.3, // 70% chance of being verified (simulated)
                    createdAt
                });
                reviewCount++;
            }
        }

        console.log(`Seeded ${reviewCount} new reviews successfully.`);
        process.exit();
    } catch (error) {
        console.error("Error seeding reviews:", error);
        process.exit(1);
    }
};

seedReviews();
