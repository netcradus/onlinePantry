import mongoose from "mongoose";
import { env } from "../configs/env.config.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/Product.model.js";
import { User } from "../models/User.model.js";
import { buildProductsForCategories, categoriesData as sharedCategoriesData } from "./seedData.js";

const categoriesData = [
    { name: "Bakery", slug: "bakery", icon: "🍞" },
    { name: "Frozen", slug: "frozen", icon: "🍦" },
    { name: "Meat", slug: "meat", icon: "🥩" },
    { name: "Fish", slug: "fish", icon: "🐟" },
    { name: "Rice", slug: "rice", icon: "🌾" },
    { name: "Spices", slug: "spices", icon: "🌶️" },
    { name: "Drinks", slug: "drinks", icon: "🥤" },
    { name: "Fruits", slug: "fruits", icon: "🍎" },
    { name: "Vegetables", slug: "vegetables", icon: "🥦" }
];

const productTemplates = {
    Bakery: [
        { name: "Sourdough Bread", price: 3.50, weight: "400g", img: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb" },
        { name: "Butter Croissant", price: 1.20, weight: "70g", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a" },
        { name: "Wholemeal Loaf", price: 1.80, weight: "800g", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Chocolate Muffin", price: 2.00, weight: "120g", img: "https://images.unsplash.com/photo-1582211594533-268f4f1edeb9" },
        { name: "Baguette", price: 1.10, weight: "250g", img: "https://images.unsplash.com/photo-1597079910443-60c43fc4f729" }
    ],
    Fruits: [
        { name: "Royal Gala Apples", price: 2.50, weight: "6 pack", img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce" },
        { name: "Fairtrade Bananas", price: 1.00, weight: "5 items", img: "https://images.unsplash.com/photo-1571771894821-ad99026.png" },
        { name: "Victorian Strawberries", price: 3.00, weight: "400g", img: "https://images.unsplash.com/photo-1464960350423-93c67414319b" },
        { name: "Blueberries", price: 2.20, weight: "150g", img: "https://images.unsplash.com/photo-1497534446932-c946965835ad" },
        { name: "Satsuma Oranges", price: 1.50, weight: "500g", img: "https://images.unsplash.com/photo-1557800636-894a64c1696f" }
    ],
    Vegetables: [
        { name: "Broccoli Florets", price: 0.80, weight: "375g", img: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc" },
        { name: "English Spinach", price: 1.50, weight: "200g", img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb" },
        { name: "Vine Tomatoes", price: 2.00, weight: "500g", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea" },
        { name: "Red Onions", price: 1.20, weight: "1kg", img: "https://images.unsplash.com/photo-1508747703725-719777637510" },
        { name: "Organic Carrots", price: 0.90, weight: "500g", img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37" }
    ],
    Meat: [
        { name: "Chicken Breast", price: 6.50, weight: "500g", img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791" },
        { name: "Beef Mince 5% Fat", price: 5.00, weight: "500g", img: "https://images.unsplash.com/photo-1588168333622-2b3ca2709994" },
        { name: "Pork Loin Chops", price: 4.80, weight: "4 pack", img: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6" },
        { name: "Lamb Diced", price: 8.00, weight: "400g", img: "https://images.unsplash.com/photo-1603048297172-c92544798d5a" }
    ],
    Drinks: [
        { name: "Still Spring Water", price: 0.50, weight: "500ml", img: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d" },
        { name: "Fresh Orange Juice", price: 2.20, weight: "1L", img: "https://images.unsplash.com/photo-1613478223719-2ab80260f45c" },
        { name: "Oat Milk Barista", price: 1.90, weight: "1L", img: "https://images.unsplash.com/photo-1615485240384-184293880353" },
        { name: "Sparkling Elderflower", price: 2.50, weight: "750ml", img: "https://images.unsplash.com/photo-1527661591475-527312dd65f5" }
    ]
};

// Fill missing templates with generic data for demo
const allCategoryNames = categoriesData.map(c => c.name);
allCategoryNames.forEach(cat => {
    if (!productTemplates[cat]) {
        productTemplates[cat] = [
            { name: `${cat} Item A`, price: 2.99, weight: "500g", img: "https://images.unsplash.com/photo-1542838132-92c53300491e" },
            { name: `${cat} Item B`, price: 4.50, weight: "1kg", img: "https://images.unsplash.com/photo-1542838132-92c53300491e" },
            { name: `${cat} Item C`, price: 1.75, weight: "250g", img: "https://images.unsplash.com/photo-1542838132-92c53300491e" }
        ];
    }
});

const seed = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(env.MONGODB_URI);
        console.log("Connected! 🌱 Starting Seed...");

        // 1. Setup Admin User
        let admin = await User.findOne({ role: "admin" });
        if (!admin) {
            console.log("Creating default admin...");
            admin = await User.create({
                firstName: "Pantry",
                lastName: "Admin",
                email: "admin@onlinepantry.com",
                password: "Password123!",
                role: "admin",
                isVerified: true
            });
        }

        // 2. Clear & Seed Categories
        await Category.deleteMany({});
        const createdCategories = await Category.insertMany(sharedCategoriesData);
        console.log(`Seeded ${createdCategories.length} categories.`);

        // 3. Seed Products (18 per category)
        await Product.deleteMany({});
        const productsToInsert = buildProductsForCategories(createdCategories, 18);
        await Product.insertMany(productsToInsert);

        createdCategories.forEach((category) => {
            console.log(`- Seeded 18 products for ${category.name}`);
        });
        const totalProducts = productsToInsert.length;

        console.log(`\n✅ Successfully seeded ${totalProducts} products!`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seed();
