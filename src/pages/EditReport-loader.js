import { getCategories, getReport } from '../util/http.js';
import { buildCartItems } from '../util/report-cart.js';

export const loader = (cartContext) => async ({ params }) => {
    const [report, categories] = await Promise.all([getReport(params.id), getCategories()]);
    cartContext.setItems(buildCartItems(report, categories));
    return { report, categories };
};