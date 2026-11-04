import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect } from "react-router-dom";
import { loader } from './ShowReport-loader';
import { getReport, getCategories } from '../util/http.js';
import { checkAuthLoader } from "../util/auth.js";

vi.mock('../util/http.js', () => ({ getReport: vi.fn(), getCategories: vi.fn() }));
vi.mock('../util/auth.js', () => ({ checkAuthLoader: vi.fn() }));

const report = { id: 1, name: 'Report' };
const categories = [{ id: 2, name: 'Performance' }];

describe('Show Report loader', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads the report and categories', async () => {
    getReport.mockResolvedValueOnce(report);
    getCategories.mockResolvedValueOnce(categories);
    const result = await loader({ params: { id: '1' } });
    expect(getReport).toHaveBeenCalledWith('1');
    expect(getCategories).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ report, categories });
  });

  it('redirects to login when not authenticated', async () => {
    checkAuthLoader.mockReturnValueOnce(redirect('/login'));
    const result = await loader({ params: { id: '1' } });
    expect(result.status).toBe(302);
    expect(result.headers.get('Location')).toBe('/login');
    expect(getReport).not.toHaveBeenCalled();
  });

  it('does not load the report when a fetch fails', async () => {
    getReport.mockRejectedValueOnce(new Error('boom'));
    getCategories.mockResolvedValueOnce(categories);
    await expect(loader({ params: { id: '1' } })).rejects.toThrow('boom');
  });
});