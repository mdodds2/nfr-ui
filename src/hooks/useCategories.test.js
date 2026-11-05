import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import useCategories from './useCategories';
import { getCategories } from '../util/http';

vi.mock('../util/http', () => ({ getCategories: vi.fn() }));

describe('useCategories', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('starts in a loading state', async () => {
    let resolve;
    getCategories.mockReturnValueOnce(new Promise((r) => { resolve = r; }));

    const { result } = renderHook(() => useCategories());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.categories).toEqual([]);
    expect(result.current.errorText).toBeNull();

    await act(async () => {
      resolve([]);
    });
  });

  it('loads categories on success', async () => {
    const categories = [{ id: 2, name: 'Performance' }];
    getCategories.mockResolvedValueOnce(categories);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getCategories).toHaveBeenCalledTimes(1);
    expect(result.current.categories).toEqual(categories);
    expect(result.current.errorText).toBeNull();
  });

  it('sets errorText when getCategories fails', async () => {
    getCategories.mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorText).toEqual('Something went wrong when loading Categories');
    expect(result.current.categories).toEqual([]);
  });

});