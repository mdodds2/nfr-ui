import { createContext, useState } from 'react';

export const DisplayContext = createContext({
    categoryId: null,
    setCategoryId: () => {},
    subCategoryId: null,
    setSubCategoryId: () => {},
    subCategories: null,
    setSubCategories: () => {},
    cartCount: 0,
    setCartCount: () => {},
});

export default function DisplayContextProvider( {children} ) {

    const [categoryId, setCategoryId] = useState();
    const [subCategoryId, setSubCategoryId] = useState();
    const [subCategories, setSubCategories] = useState();
    const [cartCount, setCartCount] = useState(0);

    const displayCtx = {
        categoryId,
        setCategoryId,
        subCategoryId,
        setSubCategoryId,
        subCategories,
        setSubCategories,
        cartCount,
        setCartCount,
    };

    return <DisplayContext.Provider value={displayCtx}>
        {children}
    </DisplayContext.Provider>
}

