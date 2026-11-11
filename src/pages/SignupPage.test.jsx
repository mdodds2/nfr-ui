import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import SignupPage from './SignupPage.jsx';

vi.mock('../components/CredentialsForm.jsx', () => ({
  default: ({ mode }) => <div>CredentialsForm {mode}</div>,
}));

describe('Signup', () => {
  it('renders the default page', () => {
    render(<SignupPage />);
    expect(screen.getByText('CredentialsForm signup')).toBeInTheDocument();
  });
});
