import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loader } from './NewRequirement-loader.js';
import { getCategories, getNextIdentifier } from '../util/http.js';

vi.mock('../util/http.js', () => ({ getCategories: vi.fn(), getNextIdentifier: vi.fn() }));

const categories = [{ id: 1, name: 'Test category' }];

describe('New Requirement loader', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads the categories, identifier', async () => {
    getCategories.mockResolvedValueOnce(categories);
    getNextIdentifier.mockResolvedValueOnce({ identifier: 'TST-TST-01' });
    const displayRef = { current: { categoryId: 1, subCategoryId: 10 } };
    const result = await loader(displayRef)();
    expect(getCategories).toHaveBeenCalledTimes(1);
    expect(getNextIdentifier).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual({ categories, nextIdentifier: 'TST-TST-01' });
  });

  it('does not load a requirement when a fetch fails', async () => {
    getCategories.mockRejectedValueOnce(new Error('boom'));
    const displayRef = { current: { categoryId: 1, subCategoryId: 10 } };
    await expect(loader(displayRef)()).rejects.toThrow('boom');
  });

  it('skips the identifier when no sub-characteristic is selected', async () => {
    getCategories.mockResolvedValueOnce(categories);
    const result = await loader({ current: {} })();
    expect(getNextIdentifier).not.toHaveBeenCalled();
    expect(result).toEqual({ categories, nextIdentifier: '' });
  });

});