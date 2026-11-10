import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useActionData } from 'react-router-dom';

import CredentialsForm from './CredentialsForm.jsx';

vi.mock('react-router-dom', () => ({
  Form: ({ children }) => <form>{children}</form>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useActionData: vi.fn(),
}));

function renderCredentialsForm({ mode = 'signup', actionData = vi.fn(), } = {}) {
    useActionData.mockReturnValue(actionData ?? null);
    return render(
        <CredentialsForm mode={mode}/>
    );
}

describe('CredentialsForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  it('renders default page, default mode is signup', () => {
    renderCredentialsForm();
    expect(screen.getByRole('heading', { name: 'Software Quality Attributes Report Builder' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Password *')).toBeInTheDocument();
    expect(screen.queryByLabelText('New Password *')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Forgot password?' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Create Account' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute('href', '/');
  });

  it('renders a login page', () => {
    renderCredentialsForm({ mode: 'login' });
    expect(screen.getByRole('heading', { name: 'Software Quality Attributes Report Builder' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Password *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '/forgot');
    expect(screen.getByRole('link', { name: 'Create Account' })).toHaveAttribute('href', '/signup');
  });

  it('renders a reset password page', () => {
    renderCredentialsForm({ mode: 'reset' });
    expect(screen.getByRole('heading', { name: 'Software Quality Attributes Report Builder' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Email *')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Password *')).not.toBeInTheDocument();
    expect(screen.getByLabelText('New Password *')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders a forgot password page', () => {
    renderCredentialsForm({ mode: 'forgot' });
    expect(screen.getByRole('heading', { name: 'Software Quality Attributes Report Builder' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.queryByLabelText('Password *')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('New Password *')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Confirm New Password *')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Request Password Change' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('action returns an error', () => {
    renderCredentialsForm({ actionData: {error: 'something went wrong'} });
    expect(screen.getByText('something went wrong')).toBeInTheDocument();
  });

});