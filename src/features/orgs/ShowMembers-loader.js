import { getMembersForOrganization } from '../../util/http.js';

export async function loader({ params }) {
  return await getMembersForOrganization(params.orgId);
}
