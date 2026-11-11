import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import MainPage from './MainPage.jsx';

vi.mock('../components/ReportBuilder.jsx', () => ({ default: () => <div>ReportBuilder</div> }));

describe('MainPage', () => {
  it('renders main page', () => {
    render(<MainPage />);
    expect(screen.getByText('ReportBuilder')).toBeInTheDocument();
  });
});
