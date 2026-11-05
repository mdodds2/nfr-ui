import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from './Login-action';
import { apiFetch } from '../util/http.js';
import { setAuthToken } from '../util/auth.js';

vi.mock('../util/http.js', () => ({ apiFetch: vi.fn() }));
vi.mock('../util/auth.js', () => ({ setAuthToken: vi.fn() }));

const res = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const loginRequest = (email, password) => {
  const form = new FormData();
  form.append('email', email);
  form.append('password', password);
  return new Request('http://localhost/login', { method: 'POST', body: form });
};

describe('Login action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('saves the token and redirects to /main on success', async () => {
    apiFetch.mockResolvedValueOnce(res(200, { token: 'abc' }));

    const result = await action({ request: loginRequest('user@example.com', 'secret') });

    expect(setAuthToken).toHaveBeenCalledWith('abc');
    expect(result.status).toBe(302);
    expect(result.headers.get('Location')).toBe('/main');

    const [path, options] = apiFetch.mock.calls[0];
    expect(path).toBe('/auth/login');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ email: 'user@example.com', password: 'secret' });
  });

  it.each([400,401])('returns the login error on %i', async (status) => {
    apiFetch.mockResolvedValueOnce(res(status));
    const result = await action({ request: loginRequest('user@example.com', 'secret') });
    expect(result.error).toBe('Invalid email or password. Please try again.');
    expect(setAuthToken).not.toHaveBeenCalled();
  });

  it('throws a 500 error', async () => {
    apiFetch.mockResolvedValueOnce(res(500));
    const error = await action({ request: loginRequest('user@example.com', 'secret') }).catch(e => e);
    expect(error.status).toBe(500);
    expect(await error.json()).toEqual({ message: 'Could not authenticate user' });
    expect(setAuthToken).not.toHaveBeenCalled();
  });
});

