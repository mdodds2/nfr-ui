import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ChangePassword from './ChangePassword.jsx';
import { apiFetch } from '../util/http.js';

vi.mock('../util/http.js', () => ({ apiFetch: vi.fn() }))

describe('ChangePassword', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  it('renders default page', () => {
    render(<ChangePassword />);
    expect(screen.getByRole('button', { name: 'Change Password' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Change Password Form' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Current Password *')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('New Password *')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Confirm New Password *')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('open the change password form', async () => {
    render(<ChangePassword />);
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: 'Change Password' });
    await user.click(button);
    expect(screen.getByRole('heading', { name: 'Change Password Form' })).toBeInTheDocument();
    expect(screen.getByLabelText('Current Password *')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password *')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('password mismatch', async () => {
    render(<ChangePassword />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Change Password' }));
    await user.type(screen.getByLabelText('Current Password *'), 'secret12');
    await user.type(screen.getByLabelText('New Password *'), 'abcdefgh');
    await user.type(screen.getByLabelText('Confirm New Password *'), 'ijklmnop');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('successfully change password', async () => {
    apiFetch.mockResolvedValue({ ok: true});

    render(<ChangePassword />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Change Password' }));
    await user.type(screen.getByLabelText('Current Password *'), 'oldPassword');
    await user.type(screen.getByLabelText('New Password *'), 'newPassword');
    await user.type(screen.getByLabelText('Confirm New Password *'), 'newPassword');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(apiFetch).toHaveBeenCalledWith(
      '/users/me/change-password',
      expect.objectContaining({
        body: JSON.stringify({ oldPassword: 'oldPassword', newPassword: 'newPassword' }),
      })
    );
    expect(await screen.findByText('Password successfully changed.')).toBeInTheDocument();
  });

  it('API error', async () => {
    apiFetch.mockResolvedValue({ ok: false, json: async () => ({ error: 'Current password is wrong' }) });

    render(<ChangePassword />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Change Password' }));
    await user.type(screen.getByLabelText('Current Password *'), 'oldPassword');
    await user.type(screen.getByLabelText('New Password *'), 'newPassword');
    await user.type(screen.getByLabelText('Confirm New Password *'), 'newPassword');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Current password is wrong')).toBeInTheDocument();
  });

  it('API error with message', async () => {
    apiFetch.mockResolvedValue({ ok: false, json: async () => ({ message: 'Current password is wrong' }) });

    render(<ChangePassword />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Change Password' }));
    await user.type(screen.getByLabelText('Current Password *'), 'oldPassword');
    await user.type(screen.getByLabelText('New Password *'), 'newPassword');
    await user.type(screen.getByLabelText('Confirm New Password *'), 'newPassword');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Current password is wrong')).toBeInTheDocument();
  });

  it('API error with no message', async () => {
    apiFetch.mockResolvedValue({ ok: false, json: async () => ({}) });

    render(<ChangePassword />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Change Password' }));
    await user.type(screen.getByLabelText('Current Password *'), 'oldPassword');
    await user.type(screen.getByLabelText('New Password *'), 'newPassword');
    await user.type(screen.getByLabelText('Confirm New Password *'), 'newPassword');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Unable to change password')).toBeInTheDocument();
  });

});