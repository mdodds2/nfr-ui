import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import LayoutGrid from './LayoutGrid.jsx';

describe('LayoutGrid', () => {
  it('renders LayoutGrid', () => {
    const { container } = render(<LayoutGrid />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
