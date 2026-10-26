import { logout } from '../util/auth.js';

export const loader = (displayContext) => async () => {
    logout();

    displayContext.setCategoryId(null);
    displayContext.setSubCategoryId(null);
    displayContext.setSubCategories(null);

    return null;
}