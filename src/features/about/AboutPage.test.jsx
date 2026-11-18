import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import AboutPage from './AboutPage.jsx';

vi.mock('./About.jsx', () => ({ default: () => <div>About</div> }));

describe('AboutPage', () => {
  it('renders about page', () => {
    render(<AboutPage />);
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});
