import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouteLoaderData } from "react-router-dom";

import HamburgerComponent from './HamburgerComponent.jsx';
import { useOrg } from "../store/org-context-object.js";

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, onClick }) => (
    <a href={to} onClick={onClick}>
      {children}
    </a>
  ),
  useRouteLoaderData: vi.fn()
}));
vi.mock('../store/org-context-object.js', () => ({ useOrg: vi.fn() }));
vi.mock('hamburger-react', () => ({
  default: ({ toggled, toggle }) => <button onClick={() => toggle(!toggled)}>Toggle</button>,
}));

describe('HamburgerComponent', () => {

  beforeEach(() => {
    vi.resetAllMocks();
    useRouteLoaderData.mockReturnValue({ id: 111, name: "Test User", email: "test.user@domain.com", role: "USER" });
    useOrg.mockReturnValue({
        orgs: [{ id: '222', name: 'Test Org', slug: 'test-org', role: 'MEMBER' },{ id: '333', name: 'Second Org', slug: 'second-org', orgRole: 'ORG_ADMIN' }],
        currentOrgId: '222',
    });
  });

  it('hamburger is initially rendered closed', () => {
    render(<HamburgerComponent />);
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('open hamburger menu', async () => {
    render(<HamburgerComponent />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('user does not get Admin link', async () => {
    render(<HamburgerComponent />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('platform admin gets Admin link', async () => {
    useRouteLoaderData.mockReturnValue({ id: 111, name: "Test User", email: "test.user@domain.com", role: "ADMIN" });
    render(<HamburgerComponent />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('role admin gets Admin link', async () => {
    useOrg.mockReturnValue({
        orgs: [{ id: '222', name: 'Test Org', slug: 'test-org', role: 'MEMBER' },{ id: '333', name: 'Second Org', slug: 'second-org', orgRole: 'ORG_ADMIN' }],
        currentOrgId: '333',
    });
    render(<HamburgerComponent />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('clicking any link should close the hamburger menu', async () => {
    render(<HamburgerComponent />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    await userEvent.click(screen.getByText('Reports'));
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });
});
