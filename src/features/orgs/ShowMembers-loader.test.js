import { describe, it, expect, vi, beforeEach } from 'vitest';

import { loader } from './ShowMembers-loader';
import { getMembersForOrganization } from '../../util/http.js';

vi.mock('../../util/http.js', () => ({ getMembersForOrganization: vi.fn() }));

const members = [
  { userId: '1', name: 'Test User', email: 'test.user@domain.com', orgRole: 'MEMBER' },
  { userId: '2', name: 'Another User', email: 'another.user@domain.com', orgRole: 'ORG_ADMIN' },
];

describe('ShowMembers loader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads all members', async () => {
    getMembersForOrganization.mockResolvedValueOnce(members);
    const result = await loader({ params: { orgId: '123' } });
    expect(getMembersForOrganization).toHaveBeenCalledWith('123');
    expect(result).toEqual(members);
  });

  it('does not load the members when a fetch fails', async () => {
    getMembersForOrganization.mockRejectedValueOnce(new Error('boom'));
    await expect(loader({ params: { orgId: '123' } })).rejects.toThrow('boom');
  });
});
