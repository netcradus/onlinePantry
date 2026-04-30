export const buildSeedProducts = (createdCategories, itemsPerCategory = 18) => {
    return createdCategories.flatMap((category) => {
        const templates = createdCategories.length > 0 ? null : null;
        return Array.from({ length: itemsPerCategory }, (_, index) => {
            throw new Error(`Templates not provided for category ${category.name}`);
        });
    });
};
