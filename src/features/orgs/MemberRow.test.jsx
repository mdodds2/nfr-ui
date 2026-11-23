import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MemberRow from './MemberRow.jsx';

const member = {
  name: 'Test User',
  email: 'test.user@domain.com',
  userId: '234',
  orgRole: 'MEMBER',
};

const mockSubmit = vi.fn();
let mockFetcher;
vi.mock('react-router-dom', () => ({
  useFetcher: () => mockFetcher,
}));

function renderRow(member) {
  render(
    <table>
      <tbody>
        <MemberRow member={member} />
      </tbody>
    </table>
  );
}

describe('MemberRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetcher = {
      Form: ({ children, ...props }) => <form {...props}>{children}</form>,
      submit: mockSubmit,
      data: undefined,
      formData: undefined,
      state: 'idle',
    };
  });

  it('renders the row', () => {
    renderRow(member);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test.user@domain.com')).toBeInTheDocument();
  });

  it('change the org role', async () => {
    renderRow(member);
    const [orgRoleCombo] = screen.getAllByRole('combobox');
    const user = userEvent.setup();
    await user.selectOptions(orgRoleCombo, 'Org Admin');
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith(expect.any(HTMLFormElement), { method: 'patch' });
  });

  it('shows the error from the action', () => {
    mockFetcher.data = { error: 'An organization needs at least one org admin.' };
    renderRow(member);
    expect(screen.getByText('An organization needs at least one org admin.')).toBeInTheDocument();
  });
});
