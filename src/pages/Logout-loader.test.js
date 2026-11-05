import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loader } from './Logout-loader';
import { logout } from "../util/auth.js";

vi.mock('../util/auth.js', () => ({ logout: vi.fn() }));

let displayRef;

describe('Logout loader', () => {

  beforeEach(() => {
    vi.resetAllMocks();
    displayRef = { current: { setCategoryId: vi.fn(), setSubCategoryId: vi.fn(), setSubCategories: vi.fn() } };
  });

  it('logs the user out', async () => {
    const result = await loader(displayRef)();
    expect(result).toBeNull();
    expect(logout).toHaveBeenCalledTimes(1);
    expect(displayRef.current.setCategoryId).toHaveBeenCalledWith(null);
    expect(displayRef.current.setSubCategoryId).toHaveBeenCalledWith(null);
    expect(displayRef.current.setSubCategories).toHaveBeenCalledWith(null);
  });

  it('does not reset the display when logout throws', async () => {
    logout.mockImplementationOnce(() => { throw new Error('boom'); });
    await expect(loader(displayRef)()).rejects.toThrow('boom');
    expect(displayRef.current.setCategoryId).not.toHaveBeenCalled();
  });
});