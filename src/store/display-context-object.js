import { createContext } from 'react';

export const DisplayContext = createContext({
    categoryId: null, setCategoryId: () => {},
    subCategoryId: null, setSubCategoryId: () => {},
    subCategories: null, setSubCategories: () => {},
    cartCount: 0, setCartCount: () => {},
});
