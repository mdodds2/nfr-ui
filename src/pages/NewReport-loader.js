import { getCategories } from '../util/http';

export async function loader() {

    const categories = await getCategories();

    const data = {
        categories,
    }

    return data;
}