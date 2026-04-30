export const categoriesData = [
    {
        name: "Bakery",
        slug: "bakery",
        description: "Fresh breads, buns, cakes and baked snacks.",
        sortOrder: 1,
    },
    {
        name: "Frozen",
        slug: "frozen",
        description: "Ready-to-cook frozen foods and desserts.",
        sortOrder: 2,
    },
    {
        name: "Meat",
        slug: "meat",
        description: "Fresh chicken, mutton and other meat cuts.",
        sortOrder: 3,
    },
    {
        name: "Fish",
        slug: "fish",
        description: "Fresh and frozen fish and seafood.",
        sortOrder: 4,
    },
    {
        name: "Rice",
        slug: "rice",
        description: "Daily-use rice, premium rice and poha.",
        sortOrder: 5,
    },
    {
        name: "Spices",
        slug: "spices",
        description: "Whole spices, masalas and seasoning essentials.",
        sortOrder: 6,
    },
    {
        name: "Drinks",
        slug: "drinks",
        description: "Juices, milk drinks, tea and everyday beverages.",
        sortOrder: 7,
    },
    {
        name: "Fruits",
        slug: "fruits",
        description: "Seasonal fresh fruits sourced for daily grocery needs.",
        sortOrder: 8,
    },
    {
        name: "Vegetables",
        slug: "vegetables",
        description: "Fresh vegetables for home cooking and salads.",
        sortOrder: 9,
    },
];

export const productTemplates = {
    Bakery: [
        { name: "Milk Bread Loaf", price: 45, weight: "400g", unit: "1 loaf", brand: "Daily Bake", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Pav Buns", price: 35, weight: "200g", unit: "6 pcs", brand: "Fresh Oven", image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec" },
        { name: "Butter Croissant", price: 55, weight: "90g", unit: "1 pc", brand: "Daily Bake", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a" },
        { name: "Tea Cake", price: 120, weight: "300g", unit: "1 pack", brand: "Sweet Crumb", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587" },
        { name: "Whole Wheat Bread", price: 50, weight: "400g", unit: "1 loaf", brand: "Brown Grain", image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73" },
        { name: "Garlic Bread Sticks", price: 80, weight: "180g", unit: "1 pack", brand: "Fresh Oven", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
    ],
    Frozen: [
        { name: "Frozen Green Peas", price: 110, weight: "500g", unit: "1 pack", brand: "IceFresh", image: "https://images.unsplash.com/photo-1582515073490-39981397c445" },
        { name: "Veg Momos", price: 140, weight: "400g", unit: "20 pcs", brand: "Quick Bite", image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5f" },
        { name: "French Fries", price: 150, weight: "750g", unit: "1 pack", brand: "Crispo", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f" },
        { name: "Frozen Sweet Corn", price: 95, weight: "400g", unit: "1 pack", brand: "IceFresh", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Chicken Nuggets", price: 220, weight: "400g", unit: "1 pack", brand: "Quick Bite", image: "https://images.unsplash.com/photo-1562967914-608f82629710" },
        { name: "Vanilla Ice Cream Tub", price: 180, weight: "700ml", unit: "1 tub", brand: "Cream Bell", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb" },
    ],
    Meat: [
        { name: "Chicken Curry Cut", price: 220, weight: "500g", unit: "1 pack", brand: "Farm Fresh", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791" },
        { name: "Chicken Boneless", price: 280, weight: "500g", unit: "1 pack", brand: "Farm Fresh", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781" },
        { name: "Mutton Curry Cut", price: 520, weight: "500g", unit: "1 pack", brand: "Prime Cuts", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f" },
        { name: "Chicken Keema", price: 260, weight: "500g", unit: "1 pack", brand: "Farm Fresh", image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba" },
        { name: "Chicken Drumsticks", price: 240, weight: "500g", unit: "1 pack", brand: "Farm Fresh", image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637" },
        { name: "Mutton Mince", price: 560, weight: "500g", unit: "1 pack", brand: "Prime Cuts", image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a" },
    ],
    Fish: [
        { name: "Rohu Fish Cut", price: 260, weight: "500g", unit: "1 pack", brand: "Sea Basket", image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44" },
        { name: "Salmon Fillet", price: 650, weight: "250g", unit: "1 pack", brand: "Ocean Catch", image: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9" },
        { name: "Prawns Medium", price: 420, weight: "250g", unit: "1 pack", brand: "Ocean Catch", image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47" },
        { name: "Tilapia Fillet", price: 320, weight: "400g", unit: "1 pack", brand: "Sea Basket", image: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c" },
        { name: "Sardine Whole", price: 180, weight: "500g", unit: "1 pack", brand: "Harbour Fresh", image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62" },
        { name: "Fish Fingers", price: 240, weight: "300g", unit: "1 pack", brand: "Ocean Catch", image: "https://images.unsplash.com/photo-1559847844-5315695dadae" },
    ],
    Rice: [
        { name: "Basmati Rice", price: 340, weight: "5kg", unit: "1 bag", brand: "Royal Grain", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c" },
        { name: "Sona Masoori Rice", price: 290, weight: "5kg", unit: "1 bag", brand: "Daily Grain", image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906" },
        { name: "Kolam Rice", price: 315, weight: "5kg", unit: "1 bag", brand: "Daily Grain", image: "https://images.unsplash.com/photo-1516684732162-798a0062be99" },
        { name: "Brown Rice", price: 140, weight: "1kg", unit: "1 pack", brand: "Healthy Harvest", image: "https://images.unsplash.com/photo-1516685018646-549d52a8c7f3" },
        { name: "Idli Rice", price: 75, weight: "1kg", unit: "1 pack", brand: "Kitchen Select", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5" },
        { name: "Thick Poha", price: 60, weight: "1kg", unit: "1 pack", brand: "Kitchen Select", image: "https://images.unsplash.com/photo-1603046891744-1f76eb10aec2" },
    ],
    Spices: [
        { name: "Turmeric Powder", price: 38, weight: "200g", unit: "1 pack", brand: "Spice Craft", image: "https://images.unsplash.com/photo-1615485925873-7ecbbe90f635" },
        { name: "Red Chilli Powder", price: 65, weight: "200g", unit: "1 pack", brand: "Spice Craft", image: "https://images.unsplash.com/photo-1509358273864-bd4f0c7a7471" },
        { name: "Coriander Powder", price: 45, weight: "200g", unit: "1 pack", brand: "Spice Craft", image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757" },
        { name: "Garam Masala", price: 72, weight: "100g", unit: "1 pack", brand: "Masala House", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d" },
        { name: "Cumin Seeds", price: 58, weight: "100g", unit: "1 pack", brand: "Masala House", image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f" },
        { name: "Mustard Seeds", price: 28, weight: "100g", unit: "1 pack", brand: "Masala House", image: "https://images.unsplash.com/photo-1599909535441-84d7c2f06f7f" },
    ],
    Drinks: [
        { name: "Full Cream Milk", price: 34, weight: "500ml", unit: "1 pouch", brand: "Amul", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150" },
        { name: "Orange Juice", price: 125, weight: "1L", unit: "1 carton", brand: "Tropicana", image: "https://images.unsplash.com/photo-1613478223719-2ab80260f45c" },
        { name: "Lassi Sweet", price: 25, weight: "200ml", unit: "1 bottle", brand: "Verka", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8" },
        { name: "Masala Soda", price: 40, weight: "750ml", unit: "1 bottle", brand: "Fizz Up", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd" },
        { name: "Tender Coconut Water", price: 50, weight: "300ml", unit: "1 pack", brand: "Raw Pressery", image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc" },
        { name: "Tea Premix", price: 180, weight: "250g", unit: "1 pack", brand: "Tea Time", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" },
    ],
    Fruits: [
        { name: "Banana Robusta", price: 48, weight: "1 dozen", unit: "12 pcs", brand: "Farm Fresh", image: "https://images.unsplash.com/photo-1574226516831-e1dff420e37f" },
        { name: "Apple Royal Gala", price: 180, weight: "1kg", unit: "1 pack", brand: "Orchard Select", image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce" },
        { name: "Orange Nagpur", price: 95, weight: "1kg", unit: "1 pack", brand: "Citrus Farm", image: "https://images.unsplash.com/photo-1547514701-42782101795e" },
        { name: "Papaya", price: 62, weight: "1 pc", unit: "1 pc", brand: "Farm Fresh", image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe" },
        { name: "Pomegranate", price: 145, weight: "1kg", unit: "1 pack", brand: "Orchard Select", image: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc" },
        { name: "Watermelon", price: 55, weight: "1kg", unit: "cut price/kg", brand: "Farm Fresh", image: "https://images.unsplash.com/photo-1563114773-84221bd62daa" },
    ],
    Vegetables: [
        { name: "Potato", price: 35, weight: "1kg", unit: "1 pack", brand: "Farm Fresh", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Onion", price: 42, weight: "1kg", unit: "1 pack", brand: "Farm Fresh", image: "https://images.unsplash.com/photo-1508747703725-719777637510" },
        { name: "Tomato", price: 38, weight: "1kg", unit: "1 pack", brand: "Farm Fresh", image: "https://images.unsplash.com/photo-1546470427-e7ac89b8d379" },
        { name: "Cauliflower", price: 48, weight: "1 pc", unit: "1 pc", brand: "Green Basket", image: "https://images.unsplash.com/photo-1510627498534-cf7e9002facc" },
        { name: "Lady Finger", price: 45, weight: "500g", unit: "1 pack", brand: "Green Basket", image: "https://images.unsplash.com/photo-1603048719539-9ecb35f2d5e6" },
        { name: "Spinach", price: 25, weight: "250g", unit: "1 bunch", brand: "Green Basket", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb" },
    ],
};

export const buildProductsForCategories = (createdCategories, itemsPerCategory = 18) =>
    createdCategories.flatMap((category) => {
        const templates = productTemplates[category.name] || [];

        if (templates.length === 0) {
            throw new Error(`No product templates configured for category: ${category.name}`);
        }

        return Array.from({ length: itemsPerCategory }, (_, index) => {
            const template = templates[index % templates.length];
            const cycle = Math.floor(index / templates.length);
            const suffix = cycle === 0 ? "" : ` ${cycle + 1}`;
            const baseSlug = template.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            const discountPrice = index % 5 === 0 ? Math.round(template.price * 0.92) : undefined;

            return {
                name: `${template.name}${suffix}`,
                slug: `${category.slug}-${baseSlug}-${index + 1}`,
                category: category._id,
                brand: template.brand,
                description: `${template.name} from the ${category.name} section. Everyday grocery quality with dependable freshness and value.`,
                weight: template.weight,
                unit: template.unit,
                price: template.price,
                discountPrice,
                stock: 25 + ((index * 7) % 60),
                images: [`${template.image}?auto=format&fit=crop&q=80&w=900`],
                isFeatured: index < 3,
                isActive: true,
                subscriptionEligible: ["Rice", "Spices", "Drinks"].includes(category.name),
                countryOfOrigin: "India",
                expiryDisplay: ["Fruits", "Vegetables", "Meat", "Fish"].includes(category.name)
                    ? "Best consumed within 2-3 days"
                    : "Best before 3-6 months",
                averageRating: 4.1 + ((index % 7) * 0.1),
                ratingsCount: 12 + index,
                tags: [category.slug, template.brand.toLowerCase().replace(/\s+/g, "-"), baseSlug],
            };
        });
    });
