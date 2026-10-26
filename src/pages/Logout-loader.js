import { logout } from '../util/auth.js';

export const loader = (displayRef) => async () => {
    logout();

    displayRef.current.setCategoryId(null);
    displayRef.current.setSubCategoryId(null);
    displayRef.current.setSubCategories(null);

    return null;
}