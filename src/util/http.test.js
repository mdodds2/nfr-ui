import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch, getCategories } from './http';
import { getAuthToken, logout } from './auth';

// mock the whole auth module (like @Mock)
vi.mock('./auth', () => ({
  getAuthToken: vi.fn(),
  setAuthToken: vi.fn(),
  logout: vi.fn(),
}));

// small helper to fake a fetch Response
const res = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

describe('apiFetch', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('adds the bearer token and returns the response', async () => {
    getAuthToken.mockReturnValue('abc');
    fetch.mockResolvedValue(res(200));

    const response = await apiFetch('/categories');

    expect(response.status).toBe(200);
    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain('/categories');
    expect(options.headers.Authorization).toBe('Bearer abc');
    expect(options.credentials).toBe('include');
  });

  it('refreshes once on 401 and retries', async () => {
    fetch
      .mockResolvedValueOnce(res(401))                    // original call
      .mockResolvedValueOnce(res(200, { token: 'new' }))  // /auth/refresh
      .mockResolvedValueOnce(res(200));                   // retry

    const response = await apiFetch('/categories');

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch.mock.calls[1][0]).toContain('/auth/refresh');
  });

  it('logs out when refresh fails', async () => {
      localStorage.setItem('token', 'abc');
      fetch
        .mockResolvedValueOnce(res(401))                    // original call
        .mockResolvedValueOnce(res(401));

      const response = await apiFetch('/categories');
      expect(response.status).toBe(401);
      expect(logout).toHaveBeenCalledTimes(1);
  });

  it('auth paths never retry', async () => {
      fetch
        .mockResolvedValueOnce(res(401));

      const response = await apiFetch('/auth/login');
      expect(response.status).toBe(401);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(logout).not.toHaveBeenCalled();
    });
});

describe('getCategories', () => {
  it('returns the JSON body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res(200, [{ id: 1 }])));
    expect(await getCategories()).toEqual([{ id: 1 }]);
  });
});