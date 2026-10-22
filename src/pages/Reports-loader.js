import { getReportsForUser } from '../util/http.js';

export async function loader() {
    const reports = await getReportsForUser();
    return reports;
}