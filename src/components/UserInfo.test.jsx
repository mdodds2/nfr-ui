import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UserInfo from './UserInfo.jsx';
import { getUserData, setAuthToken } from '../util/auth.js';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  NavLink: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a>,
  useNavigate: () => mockNavigate,
}));
vi.mock('../util/auth.js', () => ({ getUserData: vi.fn(), setAuthToken: vi.fn() }));

function renderUserInfo(user = { name: 'Test User', role: 'USER' }) {
  getUserData.mockReturnValue(user);
  render(<UserInfo />);
}

describe('UserInfo', () => {
  beforeEach(() => vi.resetAllMocks());

  it('shows initials on the button', () => {
    renderUserInfo();
    expect(screen.getByRole('button', { name: 'TU' })).toBeInTheDocument();
  });

  it('shows empty initials when there is no name', () => {
    renderUserInfo({ role: 'USER' });
    expect(screen.getAllByRole('button')[0]).toBeEmptyDOMElement();
  });

  it('dropdown starts closed and toggles open/closed', async () => {
    const user = userEvent.setup();
    renderUserInfo();
    const dropdown = screen.getByRole('heading', { name: 'Test User' }).parentElement;
    expect(dropdown).not.toHaveClass('active');
    await user.click(screen.getByRole('button', { name: 'TU' }));
    expect(dropdown).toHaveClass('active');
    await user.click(screen.getByRole('button', { name: 'TU' }));
    expect(dropdown).not.toHaveClass('active');
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    renderUserInfo();
    const dropdown = screen.getByRole('heading', { name: 'Test User' }).parentElement;
    await user.click(screen.getByRole('button', { name: 'TU' }));
    await user.click(document.body);
    expect(dropdown).not.toHaveClass('active');
  });

  it('regular user sees Profile and About, no Admin', () => {
    renderUserInfo();
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/main/profile');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/main/about');
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('admin sees Admin link', () => {
    renderUserInfo({ name: 'Mike Dodds', role: 'ADMIN' });
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/main/admin');
  });

  it('logout clears token and navigates', async () => {
    const user = userEvent.setup();
    renderUserInfo();
    await user.click(screen.getByRole('button', { name: 'Logout' }));
    expect(setAuthToken).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('/logout');
  });
});