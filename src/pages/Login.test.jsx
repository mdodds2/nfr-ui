import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import LoginPage from './Login.jsx';

vi.mock('../components/CredentialsForm.jsx', () => ({
  default: ({ mode }) => <div>CredentialsForm {mode}</div>,
}));

describe('Login', () => {
  it('renders the default page', () => {
    render(<LoginPage />);
    expect(screen.getByText('CredentialsForm login')).toBeInTheDocument();
  });
});
