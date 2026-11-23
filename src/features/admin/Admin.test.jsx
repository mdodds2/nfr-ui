import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouteLoaderData } from "react-router-dom";

import Admin from './Admin.jsx';
import { useOrg } from '../../store/org-context-object.js'; // match Admin.jsx's import

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
  useRouteLoaderData: vi.fn(),
}));
vi.mock('../../store/org-context-object.js', () => ({ useOrg: vi.fn() }));

function renderAdminPage({ routeLoaderData = { name: 'Test User', role: 'ADMIN' }, org = { orgs: [], currentOrgId: null } } = {}) {
  useRouteLoaderData.mockReturnValue(routeLoaderData);
  useOrg.mockReturnValue(org);
  return render(<Admin />);
}

describe('AdminPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('default display', () => {
    renderAdminPage({ routeLoaderData: { name: 'Test User', role: 'ADMIN' } });
    expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'User Admin' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quality Attribute Admin' })).toBeInTheDocument();
  });

  it('click on tiles', async () => {
    renderAdminPage({ routeLoaderData: { name: 'Test User', role: 'ADMIN' }, org: { orgs: [{ id: 'o1', orgRole: 'ORG_ADMIN' }], currentOrgId: 'o1' } });

    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'User Admin' }));
    expect(mockNavigate).toHaveBeenCalledWith('/users');

    await user.click(screen.getByRole('button', { name: 'Quality Attribute Admin' }));
    expect(mockNavigate).toHaveBeenCalledWith('/requirements/displayAll');
  });

  it('click on tiles as org admin', async () => {
    renderAdminPage({ routeLoaderData: { name: 'Test User', role: 'USER' }, org: { orgs: [{ id: 'o1', orgRole: 'ORG_ADMIN' }], currentOrgId: 'o1' } });

    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Members' }));
    expect(mockNavigate).toHaveBeenCalledWith('/organizations/o1/members');

    await user.click(screen.getByRole('button', { name: 'Organization Settings' }));
    expect(mockNavigate).toHaveBeenCalledWith('/organizations');

  });

});
