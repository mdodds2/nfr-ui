import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loader } from './Reports-loader';
import { getReportsForUser } from '../util/http.js';

vi.mock('../util/http.js', () => ({ getReportsForUser: vi.fn() }));

const reports = [{ id: 1, name: 'Report 1' }, { id: 2, name: 'Report 2' }];

describe('Reports loader', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads all reports for user', async () => {
    getReportsForUser.mockResolvedValueOnce(reports);
    const result = await loader();
    expect(getReportsForUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual(reports);
  });

  it('does not load the reports when a fetch fails', async () => {
    getReportsForUser.mockRejectedValueOnce(new Error('boom'));
    await expect(loader()).rejects.toThrow('boom');
  });
});