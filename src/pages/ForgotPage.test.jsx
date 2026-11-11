import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import ForgotPage from './ForgotPage.jsx';

vi.mock('../components/CredentialsForm.jsx', () => ({
  default: ({ mode }) => <div>CredentialsForm {mode}</div>,
}));

describe('Forgot Password', () => {
  it('renders the default page', () => {
    render(<ForgotPage />);
    expect(screen.getByText('CredentialsForm forgot')).toBeInTheDocument();
  });
});
