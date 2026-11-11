import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import MainNavigation from './MainNavigation.jsx';
import { getUserData } from '../util/auth';

vi.mock('react-router-dom', () => ({ NavLink: ({ children, to }) => <a href={to}>{children}</a> }));
vi.mock('../util/auth', () => ({ getUserData: vi.fn() }));

describe('MainNavigation', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('regular user sees links but no Admin', () => {
    getUserData.mockReturnValue({ role: 'USER' });
    render(<MainNavigation />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/main');
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveAttribute('href', '/reports');
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/main/profile');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/main/about');
    expect(screen.getByRole('link', { name: 'Logout' })).toHaveAttribute('href', '/logout');
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('admin sees the Admin link', () => {
    getUserData.mockReturnValue({ role: 'ADMIN' });
    render(<MainNavigation />);
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/main/admin');
  });

});
