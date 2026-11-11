import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HamburgerComponent from './HamburgerComponent.jsx';
import { getUserData } from '../util/auth';

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, onClick }) => (
    <a href={to} onClick={onClick}>
      {children}
    </a>
  ),
}));
vi.mock('../util/auth', () => ({ getUserData: vi.fn() }));
vi.mock('hamburger-react', () => ({
  default: ({ toggled, toggle }) => <button onClick={() => toggle(!toggled)}>Toggle</button>,
}));

describe('HamburgerComponent', () => {
  it('hamburger is initially rendered closed', () => {
    getUserData.mockReturnValue({ role: 'USER' });
    render(<HamburgerComponent />);
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('open hamburger menu', async () => {
    getUserData.mockReturnValue({ role: 'USER' });
    render(<HamburgerComponent />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('admin user gets Admin link', async () => {
    getUserData.mockReturnValue({ role: 'ADMIN' });
    render(<HamburgerComponent />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('clicking any link should close the hamburger menu', async () => {
    getUserData.mockReturnValue({ role: 'USER' });
    render(<HamburgerComponent />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    await userEvent.click(screen.getByText('Reports'));
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });
});
