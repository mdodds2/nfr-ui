import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import Organizations from './Organizations.jsx';
import { getUserData } from '../../util/auth.js';

const cOrgs = [
  { id: '123', name: 'Test Org', slug: 'test-org' },
  { id: '234', name: 'Another Org', slug: 'another-org' },
];

vi.mock('../../util/auth.js', () => ({ getUserData: vi.fn() }));

const admin = { id: 1, name: 'Test User', email: 'test.user@domain.com', role: 'ADMIN' };
const user = { id: 1, name: 'Test User', email: 'test.user@domain.com', role: 'USER' };

function renderOrganizations({ orgs = cOrgs } = {}) {
  return render(<Organizations orgs={orgs} />);
}

describe('Organizations', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders page as admin', () => {
    getUserData.mockReturnValue(admin);
    renderOrganizations();
    expect(screen.getByRole('heading', {level: 2, name: 'All Organizations'})).toBeInTheDocument();
    expect(screen.queryByRole('heading', {level: 2, name: 'Your Organizations'})).not.toBeInTheDocument();
    expect(screen.getByText('Test Org')).toBeInTheDocument();
    expect(screen.getByText('Another Org')).toBeInTheDocument();
  });

  it('renders page as user', () => {
    getUserData.mockReturnValue(user);
    renderOrganizations();
    expect(screen.getByRole('heading', {level: 2, name: 'Your Organizations'})).toBeInTheDocument();
    expect(screen.queryByRole('heading', {level: 2, name: 'All Organizations'})).not.toBeInTheDocument();
    expect(screen.getByText('Test Org')).toBeInTheDocument();
    expect(screen.getByText('Another Org')).toBeInTheDocument();
  });

  it('renders no table when there are no orgs', () => {
    getUserData.mockReturnValue(user);
    renderOrganizations({ orgs: [] });
    expect(screen.getByRole('heading', { name: 'Your Organizations' })).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('defaults orgs when the prop is missing', () => {
    getUserData.mockReturnValue(user);
    render(<Organizations />);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
