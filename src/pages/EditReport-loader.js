import { getCategories, getReport } from '../util/http.js';
import { buildCartItems } from '../util/report-cart.js';

export const loader = (cartRef) => async ({ params }) => {
    const [report, categories] = await Promise.all([getReport(params.id), getCategories()]);
    cartRef.current.setItems(buildCartItems(report, categories));
    return { report, categories };
};