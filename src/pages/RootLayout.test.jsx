import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import RootLayout from './RootLayout.jsx';

vi.mock('react-router-dom', () => ({ Outlet: () => <div>Outlet</div> }));

vi.mock('../ui/NavBar.jsx', () => ({
  default: () => <div>NavBar ui component</div>,
}));
vi.mock('../components/Footer.jsx', () => ({
  default: () => <div>Footer component</div>,
}));

describe('RootLayout', () => {
  it('show default page', () => {
    render(<RootLayout />);
    expect(screen.getByText('NavBar ui component')).toBeInTheDocument();
    expect(screen.getByText('Outlet')).toBeInTheDocument();
    expect(screen.queryByText('Footer component')).not.toBeInTheDocument();
  });

  it('show footer', () => {
    render(<RootLayout showFooter={true} />);
    expect(screen.getByText('Footer component')).toBeInTheDocument();
  });
});
