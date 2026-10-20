import { getUserData } from '../util/auth.js';
import { getReportsForUser } from '../util/http.js';

export async function loader() {
    const reports = await getReportsForUser(getUserData().id);
    return reports;
}