import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from './ForgotPage-action';
import { forgotPassword } from '../util/http.js';

vi.mock('../util/http.js', () => ({ forgotPassword: vi.fn() }));

const res = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const forgotPasswordRequest = (email) => {
  const form = new FormData();
  form.append('email', email);
  return new Request('http://localhost/forgot-password', { method: 'POST', body: form });
};

describe('Forgot password action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Success', async () => {
    forgotPassword.mockResolvedValueOnce(res(200));
    const request = { request: forgotPasswordRequest('user@test.com') };
    const result = await action(request);
    expect(result.status).toBe(302);
    expect(result.headers.get('Location')).toBe('/login');
    expect(forgotPassword).toHaveBeenCalledTimes(1);

    expect(forgotPassword).toHaveBeenCalledWith({ email: 'user@test.com' });
  });

});

