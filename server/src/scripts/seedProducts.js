
import mongoose from "mongoose";
import { Product } from "../models/Product.model.js";
import { Category } from "../models/category.model.js";
import connectDB from "../configs/database.js";
import { buildProductsForCategories, categoriesData as sharedCategoriesData } from "./seedData.js";

const categories = [
    {
        name: "Juices",
        slug: "juices",
        description: "Herbal juices for natural healing",
    },
    {
        name: "Powders",
        slug: "powders",
        description: "Pure ayurvedic churnas and powders",
    },
    {
        name: "Combos",
        slug: "combos",
        description: "Value packs for complete care",
    },
];

const products = [
    {
        name: "She Care Juice",
        slug: "she-care-juice",
        categorySlug: "juices",
        description: "A natural tonic for women's health, helping in hormonal balance and vitality.",
        price: 450,
        stock: 100,
        ingredients: ["Ashoka", "Lodhra", "Shatavari"],
        benefits: ["Hormonal balance", "Improved vitality", "Menstrual health"],
        usageInstructions: "30ml twice a day before meals",
        images: ["https://krishnaayurved.com/cdn/shop/files/1_11_2674e0d4-8e36-4d2a-8b89-9a25925046d3.jpg?v=1704276183"],
    },
    {
        name: "Diabic Care Juice",
        slug: "diabic-care-juice",
        categorySlug: "juices",
        description: "Helps regulate blood sugar levels naturally with Karela and Jamun.",
        price: 490,
        stock: 100,
        ingredients: ["Karela", "Jamun", "Gurmar"],
        benefits: ["Regulates blood sugar", "Purifies blood", "Boosts metabolism"],
        usageInstructions: "30ml twice a day empty stomach",
        images: ["https://krishnaayurved.com/cdn/shop/files/1_6_68c07659-1664-4e4f-a9cb-6b6672323f46.jpg?v=1704275037"],
    },
    {
        name: "Cholesterol Care Juice",
        slug: "cholesterol-care-juice",
        categorySlug: "juices",
        description: "Effective in managing cholesterol levels and supporting heart health.",
        price: 520,
        stock: 80,
        ingredients: ["Garlic", "Ginger", "Lemon", "Apple Cider Vinegar", "Honey"],
        benefits: ["Heart health", "Manages cholesterol", "Improves circulation"],
        usageInstructions: "15-30ml with warm water morning empty stomach",
        images: ["https://krishnaayurved.com/cdn/shop/files/1_4_5613347f-8c3b-4171-8051-766722d3d98d.jpg?v=1704274384"],
    },
    {
        name: "Shapefix Juice",
        slug: "shapefix-juice",
        categorySlug: "juices",
        description: "Natural formula for weight management and detoxification.",
        price: 480,
        stock: 120,
        ingredients: ["Medohar Guggul", "Vrikshamla", "Triphala"],
        benefits: ["Weight management", "Detox", "Metabolism boost"],
        usageInstructions: "30ml twice a day before meals",
        images: ["https://krishnaayurved.com/cdn/shop/files/1_10_7f9e830e-1175-47e9-a316-168128464682.jpg?v=1704275815"],
    },
    {
        name: "IBS Care Juice",
        slug: "ibs-care-juice",
        categorySlug: "juices",
        description: "Soothing relief for Irritable Bowel Syndrome.",
        price: 460,
        stock: 50,
        ingredients: ["Bel Swaras", "Kutaj", "Mulethi"],
        benefits: ["Digestion support", "Relieves IBS symptoms", "Gut health"],
        usageInstructions: "30ml twice a day after meals",
        images: ["https://krishnaayurved.com/cdn/shop/files/1_7_e3955639-6511-4089-8086-538186526839.jpg?v=1704275304"],
    },
    {
        name: "Freshoeaze Powder",
        slug: "freshoeaze-powder",
        categorySlug: "powders",
        description: "Herbal laxative powder for constipation relief.",
        price: 350,
        stock: 200,
        ingredients: ["Senna", "Haritaki", "Ajwain"],
        benefits: ["Relieves constipation", "Improves digestion", "Non-habit forming"],
        usageInstructions: "1 tsp with warm water at bedtime",
        images: ["https://krishnaayurved.com/cdn/shop/files/1_15_c0b60454-0714-416b-a279-38029272338c.jpg?v=1704277742"],
    },
    {
        name: "Thyro Balance Juice",
        slug: "thyro-balance-juice",
        categorySlug: "juices",
        description: "Supports thyroid function and hormonal balance.",
        price: 550,
        stock: 60,
        ingredients: ["Kanchanar", "Guggul", "Varun"],
        benefits: ["Thyroid support", "Reduces swelling", "Detoxifies"],
        usageInstructions: "30ml twice daily",
        images: ["https://krishnaayurved.com/cdn/shop/files/1_13_4a964344-9333-4f0e-b2d9-361043831818.jpg?v=1704276722"],
    },
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log("Connected to DB for seeding...");

        // Seed Categories
        console.log("Seeding Categories...");
        const createdCategories = [];

        for (const category of sharedCategoriesData) {
            const createdCategory = await Category.findOneAndUpdate(
                { slug: category.slug },
                category,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            createdCategories.push(createdCategory);
            console.log(`Updated/Created Category: ${category.name}`);
        }

        // Seed Products
        console.log("Seeding Products...");
        const productsToSeed = buildProductsForCategories(createdCategories, 6);
        for (const product of productsToSeed) {
            await Product.findOneAndUpdate(
                { slug: product.slug },
                product,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`Updated/Created Product: ${product.name}`);
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();
