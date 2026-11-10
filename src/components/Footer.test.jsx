import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Footer from './Footer.jsx';

describe('Footer', () => {
  it('shows initial page load', () => {
    render(<Footer />);
    expect(screen.getByRole('heading', { name: 'Footer text' })).toBeInTheDocument();
  });
});
