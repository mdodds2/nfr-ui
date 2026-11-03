import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from './ResetPassword-action';
import { resetPassword } from '../util/http.js';

vi.mock('../util/http.js', () => ({ resetPassword: vi.fn() }));

const res = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const resetPasswordRequest = (newPassword, confirmPassword) => {
  const form = new FormData();
  form.append('newPassword', newPassword);
  form.append('confirmPassword', confirmPassword);
  return new Request('http://localhost/reset-password?token=abc', { method: 'POST', body: form });
};

describe('Reset password action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Reset passwords do not match', async () => {
    const result = await action({ request: resetPasswordRequest('secret', 'badsecret') });
    expect(result).toEqual({ error: 'Passwords do not match' });
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it('500 error', async () => {
    resetPassword.mockResolvedValueOnce(res(500, {error: 'This reset link is invalid or has expired.'}));
    const result = await action({ request: resetPasswordRequest('secret', 'secret') });
    expect(result).toEqual({ error: 'This reset link is invalid or has expired.' });
  });

  it('Success', async () => {
    resetPassword.mockResolvedValueOnce(res(200));
    const request = { request: resetPasswordRequest('secret', 'secret') };
    const result = await action(request);
    expect(result.status).toBe(302);
    expect(result.headers.get('Location')).toBe('/login');
    expect(resetPassword).toHaveBeenCalledTimes(1);

    expect(resetPassword).toHaveBeenCalledWith({ token: 'abc', newPassword: 'secret' });
  });

  it('Network error', async () => {
    resetPassword.mockRejectedValueOnce(new Error('Network down'));
    const result = await action({ request: resetPasswordRequest('secret', 'secret') });
    expect(result).toEqual({ error: 'Could not reach the server.  Please try again.' });
  });
});

