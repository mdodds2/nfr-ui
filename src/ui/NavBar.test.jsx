import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider, useRouteError } from 'react-router-dom';

import NavBar from './NavBar.jsx';
import { getUserData } from '../util/auth.js';
import { OrgProvider } from '../store/org-context.jsx';

vi.mock('../util/auth.js', () => ({ getUserData: vi.fn() }));
vi.mock('./HamburgerComponent.jsx', () => ({ default: () => <div>Hamburger</div> }));
vi.mock('../features/users/UserProfile.jsx', () => ({ default: () => <div>UserProfile</div> }));

const reportTitle = 'Quality Attributes Report Builder';
function renderNavBar(user = { name: 'Test User', role: 'USER', orgs: [] }) {
  getUserData.mockReturnValue(user);
  vi.stubEnv('VITE_APP_TITLE', reportTitle);
  const router = createMemoryRouter([{ id: 'auth', path: '/', loader: () => user, element: <OrgProvider orgs={user.orgs}><NavBar /></OrgProvider>, HydrateFallback: () => null }]);
  return render(<RouterProvider router={router} />);
}

function ErrorProbe() {
    const e = useRouteError();
    console.log('ROUTE ERROR:', e);
    return <div>error</div>;
}

describe('NavBar', () => {
  beforeEach(() => vi.resetAllMocks());
  afterEach(() => vi.unstubAllEnvs());

  it('shows default display', async () => {
    renderNavBar();
    expect(await screen.findByRole('heading', { level: 2, name: reportTitle })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: reportTitle })).toBeInTheDocument();
    expect(screen.getByText('TU')).toBeInTheDocument();
  });

  it('clicking initials opens and Close hides the profile', async () => {
    renderNavBar();
    expect(await screen.findByRole('heading', { level: 2, name: reportTitle })).toBeInTheDocument();
    expect(screen.queryByText('UserProfile')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('TU'));
    expect(screen.getByText('UserProfile')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('UserProfile')).not.toBeInTheDocument();
  });

  it('shows no initials when the user has no name', async () => {
    const { container } = renderNavBar({ role: 'USER', orgs: [] });
    expect(await screen.findByRole('heading', { level: 2, name: reportTitle })).toBeInTheDocument();
    expect(screen.queryByText('UserProfile')).not.toBeInTheDocument();
    expect(container.querySelector('.initials-circle')).toBeEmptyDOMElement();
  });

  it('clicking the backdrop hides the profile', async () => {
    renderNavBar();
    await userEvent.click(await screen.findByText('TU'));
    await userEvent.click(screen.getByTestId('modal-backdrop'));
    expect(screen.queryByText('UserProfile')).not.toBeInTheDocument();
  });

});
