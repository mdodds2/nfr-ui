import { getCategories } from '../util/http.js';

// NewReport-loader.js
export const loader = async () => ({ categories: await getCategories() });