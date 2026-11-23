import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useActionData, useLoaderData, useRouteLoaderData, useNavigation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import { useOrg } from '../../store/org-context-object.js'; // match Admin.jsx's import
import ShowMembers from './ShowMembers.jsx';

vi.mock('./MemberRow.jsx', () => ({
  default: () => (
    <tr>
      <td>MemberRow component</td>
    </tr>
  ),
}));

vi.mock('react-router-dom', () => ({
  Form: ({ children, ...props }) => <form {...props}>{children}</form>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useActionData: vi.fn(),
  useLoaderData: vi.fn(),
  useNavigation: vi.fn(),
  useRouteLoaderData: vi.fn(),
}));

vi.mock('../../store/org-context-object.js', () => ({ useOrg: vi.fn() }));

const members = [
  { userId: '123', name: 'Test User', email: 'test.user@domain.com', orgRole: 'MEMBER' },
];

function renderShowMembers({
  loaderData,
  routeLoaderData,
  org = { orgs: [{ id: '123', name: 'Test Org', slug: 'test-org' }], currentOrgId: '123' },
  navState,
} = {}) {
  useLoaderData.mockReturnValue(loaderData ?? members);
  useRouteLoaderData.mockReturnValue(org);
  useNavigation.mockReturnValue({ state: navState ?? 'idle' });
  useOrg.mockReturnValue(org);
  return render(<ShowMembers />);
}

describe('ShowMembers', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders default component', () => {
    renderShowMembers();
    expect(screen.getByRole('heading', { name: 'Members - Test Org' })).toBeInTheDocument();
    expect(screen.getByText('MemberRow component')).toBeInTheDocument();
  });

  it('renders default component as submitting', () => {
    renderShowMembers({ navState: 'submitting' });
    expect(screen.getByText('Adding…')).toBeInTheDocument();
  });

  it('returns an error on action', () => {
    useActionData.mockReturnValue({ error: 'Unknown email.' });
    renderShowMembers();
    expect(screen.getByText('Unknown email.')).toBeInTheDocument();
  });

  it('multiple members', () => {
    renderShowMembers({
      loaderData: [
        { userId: '123', name: 'Test User', email: 'test.user@domain.com', orgRole: 'MEMBER' },
        {
          userId: '456',
          name: 'Another User',
          email: 'another.user@domain.com',
          orgRole: 'ORG_ADMIN',
        },
      ],
    });
    expect(screen.getAllByText('MemberRow component')).toHaveLength(2);
  });

  it('clears the form after a successful add', async () => {
    const { rerender } = renderShowMembers();
    const user = userEvent.setup();
    const email = screen.getByPlaceholderText('user@example.com');
    await user.type(email, 'new.user@domain.com');

    useActionData.mockReturnValue({ ok: true });
    rerender(<ShowMembers />);

    expect(email).toHaveValue('');
  });
});
