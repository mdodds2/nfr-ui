export const loader = (displayContext) => async () => {
    displayContext.setCategoryId(null);
    displayContext.setSubCategoryId(null);
    displayContext.setSubCategories(null);
}