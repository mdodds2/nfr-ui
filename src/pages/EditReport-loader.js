import { getCategories, getReport } from '../util/http.js';

export async function loader({ params }) {
    const reportId = params.id;
    const report = await getReport(reportId);

    const categories = await getCategories();

    const data = {
        report,
        categories
    }

    return data;
}