import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import EditReport from './EditReport.jsx';

vi.mock('../components/ReportForm.jsx', () => ({
  default: ({ mode }) => <div>ReportForm {mode}</div>,
}));

describe('EditReport', () => {
  it('renders the form in edit mode', () => {
    render(<EditReport />);
    expect(screen.getByText('ReportForm edit')).toBeInTheDocument();
  });
});
