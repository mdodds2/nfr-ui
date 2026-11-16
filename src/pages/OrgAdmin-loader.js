import { getOrganizationsForUser } from '../util/http.js';

export async function loader() {
console.log('in loader');
    const orgs = await getOrganizationsForUser();
    return orgs;
}