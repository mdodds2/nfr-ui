import { getCategories } from '../util/http.js';

export const loader = (cartContext) => async () => {
    cartContext.clearCart();
    const categories = await getCategories();
    return { categories };
};