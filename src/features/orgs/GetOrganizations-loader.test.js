import { describe, it, expect, vi, beforeEach } from 'vitest';

import { loader } from './GetOrganizations-loader';
import { getOrganizationsForUser } from '../../util/http.js';

vi.mock('../../util/http.js', () => ({ getOrganizationsForUser: vi.fn() }));

const orgs = [
  { id: '1', name: 'Test Org', slug: 'test-org' },
  { id: '2', name: 'Another Org', slug: 'another-org' },
];

describe('GetOrganizations loader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads all orgs', async () => {
    getOrganizationsForUser.mockResolvedValueOnce(orgs);
    const result = await loader();
    expect(getOrganizationsForUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual(orgs);
  });

  it('does not load the orgs when a fetch fails', async () => {
    getOrganizationsForUser.mockRejectedValueOnce(new Error('boom'));
    await expect(loader()).rejects.toThrow('boom');
  });
});
