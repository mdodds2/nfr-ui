import { getCategories, getReport, getUser } from "../util/http.js";

import { checkAuthLoader } from "../util/auth.js";

export async function loader({ params }) {
    const redirectResponse = checkAuthLoader();
    if (redirectResponse) return redirectResponse;

    const reportId = params.id;

    const [report, categories] = await Promise.all([getReport(reportId), getCategories()]);

    const user = await getUser();

    const data = {
        report,
        categories,
        user
    }

    return data;
}
