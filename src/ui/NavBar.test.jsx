import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NavBar from './NavBar.jsx';
import { getUserData } from '../util/auth.js';

vi.mock('../util/auth.js', () => ({ getUserData: vi.fn() }));
vi.mock('./HamburgerComponent.jsx', () => ({ default: () => <div>Hamburger</div> }));
vi.mock('../components/UserProfile.jsx', () => ({ default: () => <div>UserProfile</div> }));

const reportTitle = 'Quality Attributes Report Builder';
function renderNavBar(user = { name: 'Test User', role: 'USER' }) {
  getUserData.mockReturnValue(user);
  vi.stubEnv('VITE_APP_TITLE', reportTitle);
  return render(<NavBar />);
}

describe('NavBar', () => {
  beforeEach(() => vi.resetAllMocks());
  afterEach(() => vi.unstubAllEnvs());

  it('shows default display', () => {
    renderNavBar();
    expect(screen.getByRole('heading', { level: 2, name: reportTitle })).toBeInTheDocument();
    expect(screen.getByText('TU')).toBeInTheDocument();
  });

  it('clicking initials opens and Close hides the profile', async () => {
    renderNavBar();
    expect(screen.queryByText('UserProfile')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('TU'));
    expect(screen.getByText('UserProfile')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('UserProfile')).not.toBeInTheDocument();
  });

  it('shows no initials when the user has no name', () => {
    const { container } = renderNavBar({ role: 'USER' });
    expect(container.querySelector('.initials-circle')).toBeEmptyDOMElement();
  });

  it('clicking the backdrop hides the profile', async () => {
    renderNavBar();
    await userEvent.click(screen.getByText('TU'));
    await userEvent.click(screen.getByTestId('modal-backdrop'));
    expect(screen.queryByText('UserProfile')).not.toBeInTheDocument();
  });
});
