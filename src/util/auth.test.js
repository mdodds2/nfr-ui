import { describe, it, expect, beforeEach } from 'vitest';
import { getAuthToken, setAuthToken, logout, getUserData, checkAuthLoader } from './auth';

describe('auth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('setAuthToken stores the token', () => {
    setAuthToken('abc');
    expect(localStorage.getItem('token')).toBe('abc');
  });

  it('setAuthToken with null removes the token', () => {
    setAuthToken('abc');
    setAuthToken(null);
    expect(localStorage.getItem('token')).toBe(null);
  });

  it('getAuthToken returns the stored token', () => {
    localStorage.setItem('token', 'abc');
    expect(getAuthToken()).toBe('abc');
  });

  it('getAuthToken returns null when there is no token', () => {
    expect(getAuthToken()).toBeNull();
  });

  it('logout removes the token', () => {
    setAuthToken('abc');
    logout();
    expect(getAuthToken()).toBeNull();
  });

  it('getUserData with no token', () => {
    setAuthToken(null);
    const userData = getUserData();
    expect(userData).toEqual({ noAuth: true});
  });


  const fakeJwt = (payload) => 'x.' + btoa(JSON.stringify(payload)) + '.y';
  it('getUserData decodes a stored token', () => {
    const payload = { sub: '1', name: 'Mike', email: 'mike@example.com', role: 'ADMIN', iat: 1000, exp: 2000 };
    setAuthToken(fakeJwt(payload));

    expect(getUserData()).toEqual({
      id: '1',
      name: 'Mike',
      email: 'mike@example.com',
      role: 'ADMIN',
      lastLoggedIn: 1000,
      expiry: 2000,
    });
  });

  it('checkAuthLoader with no token', () => {
    const authLoader = checkAuthLoader();
    expect(authLoader.status).toBe(302);
    expect(authLoader.headers.get('Location')).toBe('/login');
  });

  it('checkAuthLoader with a token does not redirect', () => {
    setAuthToken('abc');
    expect(checkAuthLoader()).toBeUndefined();
  });

});