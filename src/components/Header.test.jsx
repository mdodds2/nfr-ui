import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

import Header from './Header.jsx';

describe('Header', () => {
  it('shows initial page load', () => {
    vi.stubEnv('VITE_APP_TITLE', 'Test Title');
    render(<Header />);
    expect(
      screen.getByRole('heading', { name: 'Test Title' })
    ).toBeInTheDocument();
  });
});
