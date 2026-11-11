import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import Logout from './Logout.jsx';

vi.mock('react-router-dom', () => ({ NavLink: ({ children, to }) => <a href={to}>{children}</a> }));

describe('Logout', () => {
  it('renders logout page', () => {
    render(<Logout />);
    expect(screen.getByRole('heading', { name: 'Logged out.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in again' })).toHaveAttribute('href', '/');
  });
});
