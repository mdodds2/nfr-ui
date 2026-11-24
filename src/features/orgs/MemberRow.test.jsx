import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFetcher } from 'react-router-dom';

import MemberRow from './MemberRow.jsx';

const member = {
  name: 'Test User',
  email: 'test.user@domain.com',
  userId: '234',
  orgRole: 'MEMBER',
};

const mockSubmit = vi.fn();
let roleFetcher;
let deleteFetcher;
let call;

vi.mock('react-router-dom', () => ({
  useFetcher: vi.fn(),
}));

function makeFetcher() {
  return {
    Form: ({ children, ...props }) => <form {...props}>{children}</form>,
    submit: mockSubmit,
    data: undefined,
    formData: undefined,
    state: 'idle',
  };
}

function renderRow(member) {
  return render(
    <table><tbody><MemberRow member={member} /></tbody></table>
  );
}

describe('MemberRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    roleFetcher = makeFetcher();
    deleteFetcher = makeFetcher();
    call = 0;
    vi.mocked(useFetcher).mockImplementation(() =>
      call++ % 2 === 0 ? roleFetcher : deleteFetcher
    );
  });

  it('renders the row', () => {
    renderRow(member);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test.user@domain.com')).toBeInTheDocument();
  });

  it('change the org role', async () => {
    renderRow(member);
    const orgRoleCombo = screen.getByRole('combobox');
    const user = userEvent.setup();
    await user.selectOptions(orgRoleCombo, 'Org Admin');
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith(expect.any(HTMLFormElement), { method: 'patch' });
  });

  it('shows the role error under the select', () => {
    roleFetcher.data = { error: 'An organization needs at least one org admin.' };
    renderRow(member);
    expect(screen.getByText('An organization needs at least one org admin.')).toBeInTheDocument();
  });

  it('shows the delete error in the Action cell', () => {
    deleteFetcher.data = { error: 'Cannot remove the last Org Admin.' };
    renderRow(member);
    const cell = screen.getByRole('button', { name: 'Delete' }).closest('td');
    expect(within(cell).getByText('Cannot remove the last Org Admin.')).toBeInTheDocument();
  });

  it('Clicking delete shows Confirm Delete and Cancel', async () => {
    renderRow(member);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', {name: 'Delete' }));
    expect(screen.getByRole('button', { name: 'Confirm Delete'})).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel'})).toBeInTheDocument();
  });

  it('Clicking Cancel button brings back Delete button', async () => {
    renderRow(member);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', {name: 'Delete' }));
    expect(screen.queryByRole('button', { name: 'Delete'})).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', {name: 'Cancel' }));
    expect(screen.getByRole('button', { name: 'Delete'})).toBeInTheDocument();
  });

  it('Clicking Confirm Delete calls submit with a delete method', async () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    deleteFetcher.Form = ({ children, ...props }) => <form {...props} onSubmit={onSubmit}>{children}</form>;
    renderRow(member);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', {name: 'Delete' }));
    await user.click(screen.getByRole('button', {name: 'Confirm Delete' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].target).toHaveAttribute('method', 'delete');
  });

  it('Reset after error', async () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    deleteFetcher.Form = ({ children, ...props }) => <form {...props} onSubmit={onSubmit}>{children}</form>;
    const { rerender } = renderRow(member);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', {name: 'Delete' }));
    await user.click(screen.getByRole('button', {name: 'Confirm Delete' }));
    deleteFetcher.data = { error: 'Cannot remove the last Org Admin.' };
    rerender(
      <table><tbody><MemberRow member={member} /></tbody></table>
    );
    expect(screen.getByRole('button', { name: 'Delete'})).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirm Delete'})).not.toBeInTheDocument();
  });


});
