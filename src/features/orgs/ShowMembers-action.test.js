import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from './ShowMembers-action';
import { addMemberToOrganization, updateMemberRole } from '../../util/http.js';

vi.mock('../../util/http.js', () => ({
  addMemberToOrganization: vi.fn(),
  updateMemberRole: vi.fn(),
}));

const res = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const createRequest = (method, orgId, email, orgRole, userId) => {
  const form = new FormData();
  if ('PATCH' === method) {
    form.append('userId', userId);
    form.append('orgRole', orgRole);
  } else {
    form.append('email', email);
    form.append('orgRole', orgRole);
  }
  const url =
    'http://localhost/organizations/' +
    orgId +
    '/members' +
    (method === 'PATCH' ? '/' + userId : '');
  return new Request(url, { method: method, body: form });
};

describe('New Member action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Add member to org', async () => {
    addMemberToOrganization.mockResolvedValueOnce(res(200));
    await action({
      request: createRequest('POST', '123', 'test.user@domain.com', 'MEMBER', null),
      params: { orgId: '123' },
    });
    expect(addMemberToOrganization).toHaveBeenCalledWith('123', {
      email: 'test.user@domain.com',
      orgRole: 'MEMBER',
    });
  });

  it('Add member api returns an error on 400', async () => {
    addMemberToOrganization.mockResolvedValueOnce(res(400));
    const result = await action({
      request: createRequest('POST', '123', 'test.user@domain.com', 'MEMBER', null),
      params: { orgId: '123' },
    });
    expect(result.status).toBe(400);
    expect(result.error).toBe('Bad request data.');
    expect(addMemberToOrganization).toHaveBeenCalledTimes(1);
  });

  it('Add member api returns an error on 404', async () => {
    addMemberToOrganization.mockResolvedValueOnce(res(404));
    const result = await action({
      request: createRequest('POST', '123', 'test.user@domain.com', 'MEMBER', null),
      params: { orgId: '123' },
    });
    expect(result.status).toBe(404);
    expect(result.error).toBe('Unknown email.');
    expect(addMemberToOrganization).toHaveBeenCalledTimes(1);
  });

  it('Add member api returns an error on 409', async () => {
    addMemberToOrganization.mockResolvedValueOnce(res(409));
    const result = await action({
      request: createRequest('POST', '123', 'test.user@domain.com', 'MEMBER', null),
      params: { orgId: '123' },
    });
    expect(result.status).toBe(409);
    expect(result.error).toBe('User is already a member of this organization.');
    expect(addMemberToOrganization).toHaveBeenCalledTimes(1);
  });

  it('Add member api returns an error on 500', async () => {
    addMemberToOrganization.mockResolvedValueOnce(res(500));
    const result = await action({
      request: createRequest('POST', '123', 'test.user@domain.com', 'MEMBER', null),
      params: { orgId: '123' },
    });
    expect(result.status).toBe(500);
    expect(result.error).toBe('System error when adding member.');
    expect(addMemberToOrganization).toHaveBeenCalledTimes(1);
  });

  it('Update member role', async () => {
    updateMemberRole.mockResolvedValueOnce(res(200));
    await action({
      request: createRequest('PATCH', '123', 'test.user@domain.com', 'MEMBER', '234'),
      params: { orgId: '123' },
    });
    expect(updateMemberRole).toHaveBeenCalledWith('123', '234', { orgRole: 'MEMBER' });
  });

  it('Attempt to remove the last org_admin', async () => {
    updateMemberRole.mockResolvedValueOnce(res(409));
    const result = await action({
      request: createRequest('PATCH', '123', 'test.user@domain.com', 'MEMBER', '234'),
      params: { orgId: '123' },
    });
    expect(result.status).toBe(409);
    expect(result.error).toBe('An organization needs at least one org admin.');
    expect(updateMemberRole).toHaveBeenCalledTimes(1);
  });

  it('Attempt to update role, 500 error', async () => {
    updateMemberRole.mockResolvedValueOnce(res(500));
    const result = await action({
      request: createRequest('PATCH', '123', 'test.user@domain.com', 'MEMBER', '234'),
      params: { orgId: '123' },
    });
    expect(result.status).toBe(500);
    expect(result.error).toBe('System error when updating role.');
    expect(updateMemberRole).toHaveBeenCalledTimes(1);
  });
});
