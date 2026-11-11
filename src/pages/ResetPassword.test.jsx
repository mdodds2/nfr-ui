import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import ResetPassword from './ResetPassword.jsx';

vi.mock('../components/CredentialsForm.jsx', () => ({
  default: ({ mode }) => <div>CredentialsForm {mode}</div>,
}));

describe('Reset Password', () => {
  it('renders the default page', () => {
    render(<ResetPassword />);
    expect(screen.getByText('CredentialsForm reset')).toBeInTheDocument();
  });
});
