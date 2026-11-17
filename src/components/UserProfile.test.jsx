import { render, screen, within } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import UserProfile from './UserProfile.jsx';
import { getUserData } from '../util/auth.js';

vi.mock('../util/auth.js', () => ({ getUserData: vi.fn() }));

const mockUser = {
  id: 42,
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER',
  lastLoggedIn: 1700000000,
  expiry: 1700003600,
};

const mockOrgs = [
        {
            id: 'abc',
            name: 'Test Org',
            slug: 'test-org',
        }
    ];

function renderUserProfile(user = mockUser, orgs = []) {
  getUserData.mockReturnValue(user);
  render(<UserProfile orgs={orgs}/>);
}

describe('UserProfile', () => {
  beforeEach(() => vi.resetAllMocks());

  it('renders headings and table headers', () => {
    renderUserProfile();
    expect(screen.getByRole('heading', { name: 'User Profile' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'User Attribute' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Value' })).toBeInTheDocument();
  });

  it('renders each user attribute', () => {
    renderUserProfile();
    const rows = screen.getAllByRole('row').slice(1); // skip header row
    const expected = [
      ['System id:', '42'],
      ['Name:', 'Test User'],
      ['Email:', 'test@example.com'],
      ['Role:', 'USER'],
      ['Last Logged In:', new Date(1700000000 * 1000).toLocaleString()],
      ['Login Expiry:', new Date(1700003600 * 1000).toLocaleString()],
    ];
    expect(rows).toHaveLength(expected.length);
    rows.forEach((row, i) => {
      const cells = within(row).getAllByRole('cell');
      expect(cells[0]).toHaveTextContent(expected[i][0]);
      expect(cells[1]).toHaveTextContent(expected[i][1]);
    });
  });

  it('renders Organizations page', () => {
    renderUserProfile(mockUser, mockOrgs);
    expect(screen.getByRole('heading', { level: 2, name: 'Your Organizations' })).toBeInTheDocument();
    expect(screen.getByText('Test Org')).toBeInTheDocument();
    expect(screen.getByText('test-org')).toBeInTheDocument();
  });

});
