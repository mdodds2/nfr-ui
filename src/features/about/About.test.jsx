import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

import About from './About.jsx';

vi.mock('react-router-dom', () => ({ Link: ({ children, to }) => <a href={to}>{children}</a> }));

describe('About', () => {
  it('shows initial page load', () => {
    vi.stubEnv('VITE_SWAGGER_URL', 'http://swagger.test');
    render(<About />);
    expect(
      screen.getByRole('heading', { name: 'About Quality Attribute Report Builder' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Backend Swagger Docs' })).toHaveAttribute(
      'href',
      'http://swagger.test'
    );
  });
});
