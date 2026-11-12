import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from './DeleteRequirement-action';
import { deleteRequirement } from '../util/http.js';

vi.mock('../util/http.js', () => ({ deleteRequirement: vi.fn() }));

const res = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

describe('Delete Requirement action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it.each([400, 409])('Delete Requirement api returns an error on %i', async (status) => {
    deleteRequirement.mockResolvedValueOnce(res(status, { status, message: 'An error has occurred' }));
    const result = await action({ params: {'id': '1'} });
    expect(result).toEqual({ status, error: 'An error has occurred' });
    expect(deleteRequirement).toHaveBeenCalledTimes(1);
  });

  it('500 error', async () => {
    deleteRequirement.mockResolvedValueOnce(res(500, {status: 500, message: "System error when deleting requirement"}));
    const result = await action({ params: {'id': '1'} });
    expect(result).toEqual({ error: 'System error when deleting requirement' })
    expect(deleteRequirement).toHaveBeenCalledTimes(1);
  });

  it('Success', async () => {
    deleteRequirement.mockResolvedValueOnce(res(204));
    const result = await action({ params: {'id': '1'} });
    expect(result.status).toBe(302);
    expect(result.headers.get('Location')).toBe('/main/admin');
    expect(deleteRequirement).toHaveBeenCalledWith('1');
  });
});
