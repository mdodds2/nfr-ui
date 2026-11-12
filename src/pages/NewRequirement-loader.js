import { getNextIdentifier, getCategories } from '../util/http.js';

export const loader = (displayRef) => async () => {
    let nextIdentifier = '';
    if(displayRef.current.categoryId && displayRef.current.subCategoryId) {
        const result = await getNextIdentifier(displayRef.current.categoryId, displayRef.current.subCategoryId);
        if(result) nextIdentifier = result.identifier;
    }
    const categories = await getCategories();
    return { categories, nextIdentifier };
};