import { getOrganizationsForUser } from '../../util/http.js';

export async function loader() {
  const orgs = await getOrganizationsForUser();
  return orgs;
}
