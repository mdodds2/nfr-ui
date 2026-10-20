export function findCategoryBySubCategoryId(categories, subCategoryId) {
    return categories.find(cat => cat.subCategories.some(sc => sc.id === subCategoryId));
}
export function findSubCategory(subCategories, id) {
    return subCategories.find(sc => sc.id === id) ?? null;
}
export function buildCartItems(report, categories) {
    if (!report?.requirements || !report.measurements) return [];
    return report.requirements.map(requirement => {
        const category = findCategoryBySubCategoryId(categories, requirement.subCategoryId);
        const subCategory = findSubCategory(category.subCategories, requirement.subCategoryId);
        const m = report.measurements.find(x => x.requirementId === requirement.id) ?? {};
        return {
            requirement, category, subCategory,
            id: m.id ?? "",
            targetValue: m.targetValue ?? "",
            thresholdValue: m.thresholdValue ?? "",
            unit: m.unit ?? "",
            measurementMethod: m.measurementMethod ?? "",
            trigger: m.trigger ?? "",
            context: m.context ?? "",
            systemResponse: m.systemResponse ?? "",
            owner: m.owner ?? "",
            acceptanceCriteria: m.acceptanceCriteria ?? "",
            notes: m.notes ?? "",
        };
    });
}
