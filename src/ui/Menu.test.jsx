import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Menu from './Menu.jsx';

describe('Menu', () => {
  it('renders children inside the styled wrapper', () => {
    render(
      <Menu style="side-menu">
        <div>Child</div>
      </Menu>
    );
    const child = screen.getByText('Child');
    expect(child).toBeInTheDocument();
    expect(child.parentElement).toHaveClass('side-menu');
  });
});
