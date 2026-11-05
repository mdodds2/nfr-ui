import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loader } from './NewReport-loader';
import { getCategories } from '../util/http.js';

vi.mock('../util/http.js', () => ({ getCategories: vi.fn() }));

const categories = [{ id: 2, name: 'Performance' }];

describe('New Report loader', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads the categories', async () => {
    getCategories.mockResolvedValueOnce(categories);
    const result = await loader();
    expect(getCategories).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ categories });
  });

  it('does not load categories when a fetch fails', async () => {
    getCategories.mockRejectedValueOnce(new Error('boom'));
    await expect(loader()).rejects.toThrow('boom');
  });
});