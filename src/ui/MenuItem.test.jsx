import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Menu from './Menu.jsx';
import MenuItem from './MenuItem.jsx';

describe('MenuItem', () => {
  it('renders the menu item text', () => {
    render(
      <Menu style="side-menu">
        <MenuItem id="home" parent="home" text="Home" />
      </Menu>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('menu item with a very long text parameter', () => {
    render(
      <Menu style="side-menu">
        <MenuItem id="large" parent="large" text="Kq7pXz2LmN9vRt4WcB8yHs3JdF6gQe1UaZ5oVk0Mx" />
      </Menu>
    );
    expect(screen.getByText('Kq7pXz2LmN9vRt4WcB8yHs3JdF6gQe1UaZ5oVk0M...')).toBeInTheDocument();
  });

  it('parent with hidden child', async () => {
    const handleClick = vi.fn();
    render(
      <Menu style="side-menu">
        <MenuItem id="outer" parent="outer" text="Outer Parent" handleClick={handleClick}>
          <MenuItem id="inner" parent="outer" text="Inner Child" handleClick={handleClick} />
        </MenuItem>
      </Menu>
    );
    expect(screen.queryByText('Inner Child')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Outer Parent'));
    expect(screen.getByText('Inner Child')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Outer Parent'));
    expect(screen.queryByText('Inner Child')).not.toBeInTheDocument();
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('home resets the menu', async () => {
    const handleClick = vi.fn();
    render(
      <Menu style="side-menu">
        <MenuItem id="home" parent="home" text="Home" handleClick={handleClick} />
        <MenuItem id="outer" parent="outer" text="Outer Parent" handleClick={handleClick}>
          <MenuItem id="inner" parent="outer" text="Inner Child" handleClick={handleClick} />
        </MenuItem>
      </Menu>
    );
    await userEvent.click(screen.getByText('Outer Parent'));
    expect(screen.getByText('Inner Child')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Home'));
    expect(screen.queryByText('Inner Child')).not.toBeInTheDocument();
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('click on menu item a second time', async () => {
    const handleClick = vi.fn();
    render(
      <Menu style="side-menu">
        <MenuItem id="home" parent="home" text="Home" handleClick={handleClick} />
        <MenuItem id="outer" parent="outer" text="Outer Parent" handleClick={handleClick}>
          <MenuItem id="inner" parent="outer" text="Inner Child" handleClick={handleClick} />
        </MenuItem>
      </Menu>
    );
    await userEvent.click(screen.getByText('Outer Parent'));
    await userEvent.click(screen.getByText('Inner Child'));
    await userEvent.click(screen.getByText('Inner Child'));
    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
