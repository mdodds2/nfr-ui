import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import DeleteReport from './DeleteReport.jsx';

vi.mock('react-router-dom', () => ({ Link: ({ children, to }) => <a href={to}>{children}</a> }));

describe('DeleteReport', () => {
  it('renders delete report page', () => {
    render(<DeleteReport />);
    expect(screen.getByRole('heading', { name: 'Report Deleted' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Reports' })).toHaveAttribute(
      'href',
      '/reports'
    );
  });
});
