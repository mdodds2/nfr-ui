import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import LayoutList from './LayoutList.jsx';

describe('LayoutList', () => {
  it('renders LayoutList', () => {
    const { container } = render(<LayoutList />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
