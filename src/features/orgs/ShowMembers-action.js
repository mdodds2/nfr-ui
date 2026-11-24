import { addMemberToOrganization, updateMemberRole, removeMember } from '../../util/http';

export const action = async ({ request, params }) => {
  const formData = await request.formData();

  if (request.method === 'PATCH') {
    const response = await updateMemberRole(params.orgId, formData.get('userId'), {
      orgRole: formData.get('orgRole'),
    });
    if (response.status === 409)
      return { status: 409, error: 'An organization needs at least one org admin.' };
    if (!response.ok) return { status: response.status, error: 'System error when updating role.' };
    return { ok: true };
  }

  if (request.method === 'DELETE') {
    const response = await removeMember(params.orgId, formData.get('userId'));
    if (response.status === 409)
      return { status: 409, error: 'Cannot remove the last Org Admin.' };
    if (!response.ok) return { status: response.status, error: 'System error when deleting member.' };
    return { ok: true };
  }

  const requestData = {
    email: formData.get('email'),
    orgRole: formData.get('orgRole'),
  };

  const response = await addMemberToOrganization(params.orgId, requestData);

  if (response.status === 400) {
    return { status: 400, error: 'Bad request data.' };
  }

  if (response.status === 404) {
    return { status: 404, error: 'Unknown email.' };
  }

  if (response.status === 409) {
    return { status: 409, error: 'User is already a member of this organization.' };
  }

  if (!response.ok) {
    return { status: response.status, error: 'System error when adding member.' };
  }

  return { ok: true };
};
