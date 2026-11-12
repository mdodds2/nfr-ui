import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch, getCategories, getCategory, getSubCategories, getRequirementsForSubCategory, getRequirement, getNextIdentifier, getReportsForUser, getReport, getUser, addNewRequirement, updateRequirement, addNewReport, updateReport, deleteReport, forgotPassword, resetPassword, deleteRequirement } from './http';
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

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals()
});

describe('apiFetch', () => {

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

  it('logs out and redirects when refresh fails', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign });
    fetch
      .mockResolvedValueOnce(res(401))     // original call
      .mockResolvedValueOnce(res(401));    // auth/refresh fails

    const response = await apiFetch('/categories');

    expect(response.status).toBe(401);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(logout).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith('/login');
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

describe('GET helpers', () => {

  it('returns the categories JSON body', async () => {
    fetch.mockResolvedValueOnce(res(200, [{ id: 1 }]));
    expect(await getCategories()).toEqual([{ id: 1 }]);
  });

  it('returns the categories, gives error', async () => {
    fetch.mockResolvedValueOnce(res(500));
    await expect(getCategories()).rejects.toThrow('failed: 500');
  });

  it('returns the category JSON body', async () => {
    const category = { id: 1, name: 'Performance', subCategories: [] };
    fetch.mockResolvedValueOnce(res(200, category));
    expect(await getCategory(1)).toEqual(category);
    const [url] = fetch.mock.calls[0];
     expect(url).toContain('/categories/1');
  });

  it('returns the subCategories JSON body', async () => {
    fetch.mockResolvedValueOnce(res(200, [{ id: 1 }]));
    expect(await getSubCategories()).toEqual([{ id: 1 }]);
  });

  it('returns the requirements JSON body', async () => {
    fetch.mockResolvedValueOnce(res(200, [{ id: 10, subCategory: 1 }]));
    expect(await getRequirementsForSubCategory(1)).toEqual([{ id: 10, subCategory: 1 }]);
    const [url] = fetch.mock.calls[0];
    expect(url).toContain('/requirements/subCategory/1');
  });

  it('returns the requirement JSON body', async () => {
    fetch.mockResolvedValueOnce(res(200, { id: 10, subCategory: 1 }));
    expect(await getRequirement(1)).toEqual({ id: 10, subCategory: 1 });
    const [url] = fetch.mock.calls[0];
    expect(url).toContain('/requirements/1');
  });

  it('returns the next identifier', async () => {
    fetch.mockResolvedValueOnce(res(200, 'abc-def-1'));
    expect(await getNextIdentifier(1, 2)).toEqual('abc-def-1');
    const [url] = fetch.mock.calls[0];
    expect(url).toContain('/requirements/nextIdentifier/1/2');
  });

  it('returns the reports for logged on user', async () => {
    const reports = [{id: 1, name: 'report1', measurements: {} }];
    fetch.mockResolvedValueOnce(res(200, reports));
    expect(await getReportsForUser()).toEqual(reports);
  });

  it('gets a report by id', async () => {
    const report = {id: 1, name: 'report1'};
    fetch.mockResolvedValueOnce(res(200, report));
    expect(await getReport(1)).toEqual(report);
    const [url] = fetch.mock.calls[0];
    expect(url).toContain('/reports/1');
  });

  it('gets current user', async () => {
    const user = {id: 1, name: 'Test User'};
    fetch.mockResolvedValueOnce(res(200, user));
    expect(await getUser()).toEqual(user);
    const [url] = fetch.mock.calls[0];
    expect(url).toContain('/users/me');
  });
});

describe('write helpers', () => {

  it('update a report for current user', async () => {
    const report = { id: 100, name: 'Test Report' };
    fetch.mockResolvedValueOnce(res(200, report));

    const result = await updateReport(100, report);
    expect(result.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain('/reports/100');
    expect(options.method).toBe('PUT');
    expect(JSON.parse(options.body)).toEqual(report);
  });

  it('deletes a report for the current user', async () => {
    fetch.mockResolvedValueOnce(res(204));
    const result = await deleteReport(100);
    expect(result.status).toBe(204);
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain('/reports/100');
    expect(options.method).toBe('DELETE');
  });

  it('adds a requirement', async () => {
    const requirement = { id: 100, name: 'Response time' };
    fetch.mockResolvedValueOnce(res(200, requirement));

    const result = await addNewRequirement(requirement);
    expect(result.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toMatch(/\/requirements$/)
    expect(JSON.parse(options.body)).toEqual(requirement)
    expect(options.method).toBe('POST');
  });

  it('updates a requirement', async () => {
    const requirement = { id: 100, name: 'Response time' };
    fetch.mockResolvedValueOnce(res(200, requirement));

    const result = await updateRequirement(100, requirement);
    expect(result.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain('/requirements/100');
    expect(JSON.parse(options.body)).toEqual(requirement)
    expect(options.method).toBe('PATCH');
  });

  it('deletes a requirement', async () => {
    fetch.mockResolvedValueOnce(res(204));

    const result = await deleteRequirement(100);
    expect(result.status).toBe(204);
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain('/requirements/100');
    expect(options.method).toBe('DELETE');
  });

  it('adds a new report', async () => {
    const report = { id: 100, name: 'Test Report' };
    fetch.mockResolvedValueOnce(res(200, report));

    const result = await addNewReport(report);
    expect(result.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toMatch(/\/reports$/)
    expect(JSON.parse(options.body)).toEqual(report)
    expect(options.method).toBe('POST');
  });
});

describe('auth endpoints', () => {

  it('will send the user a recovery url', async () => {
    const request = { email: 'user@domain.com'};
    fetch.mockResolvedValueOnce(res(200, request));

    const result = await forgotPassword(request);
    expect(result.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain('/auth/forgot-password');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual(request);
  });

  it('will update the user password', async () => {
    const request = { token: "abc", newPassword: 'NEW_PASSWORD'};
    fetch.mockResolvedValueOnce(res(200, request));

    const result = await resetPassword(request);
    expect(result.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain('/auth/reset-password');
    expect(options.method).toEqual('POST');
    expect(JSON.parse(options.body)).toEqual(request);
  });
});
