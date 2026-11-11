import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import ShowRequirements from './ShowRequirements.jsx';

vi.mock('../components/Requirements.jsx', () => ({
  default: () => <div>Requirements component</div>,
}));

describe('ShowRequirements', () => {
  it('shows all requirements', () => {
    render(<ShowRequirements />);
    expect(screen.getByText('Requirements component')).toBeInTheDocument();
  });
});
