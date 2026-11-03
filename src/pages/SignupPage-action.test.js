import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from './SignupPage-action';
import { apiFetch } from '../util/http.js';

vi.mock('../util/http.js', () => ({ apiFetch: vi.fn() }));
vi.mock('../util/auth.js', () => ({ setAuthToken: vi.fn() }));

const res = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const signupRequest = (name, email, password, confirmPassword) => {
  const form = new FormData();
  form.append('name', name);
  form.append('email', email);
  form.append('password', password);
  form.append('confirmPassword', confirmPassword);
  return new Request('http://localhost/signup', { method: 'POST', body: form });
};

describe('Signup action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('passwords do not match', async () => {
    const result = await action({ request: signupRequest('Test User', 'user@example.com', 'secret', 'badsecret') });
    expect(result).toEqual({ message: 'Passwords do not match', status: 422 });
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it.each([400, 409])('signup returns an error on %i', async (status) => {
    apiFetch.mockResolvedValueOnce(res(status, {status, message:  'An error has occurred'}));
    const result = await action({ request: signupRequest('Test User', 'user@example.com', 'secret', 'secret') });
    expect(result.status).toBe(status);
    expect(result.message).toBe('An error has occurred');
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });

  it('500 error', async () => {
    apiFetch.mockResolvedValueOnce(res(500, {status: 500, message:  'An error has occurred'}));
    const error = await action({ request: signupRequest('Test User', 'user@example.com', 'secret', 'secret') }).catch(e => e);
    expect(error.status).toBe(500);
    expect(await error.json()).toEqual({ message: 'Could not add user' });
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });

  it('Success', async () => {
    apiFetch.mockResolvedValueOnce(res(201));
    const request = { request: signupRequest('Test User', 'user@example.com', 'secret', 'secret') };
    const result = await action(request);
    expect(result.status).toBe(302);
    expect(result.headers.get('Location')).toBe('/');
    expect(apiFetch).toHaveBeenCalledTimes(1);

    const [path, options] = apiFetch.mock.calls[0];
    expect(path).toBe('/users');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({"name":"Test User","email":"user@example.com","password":"secret"});
  });
});

