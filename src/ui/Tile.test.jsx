import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Tile from './Tile.jsx';

vi.mock('react-router-dom', () => ({ Link: ({ children, to }) => <a href={to}>{children}</a> }));

describe('Tile', () => {
  it('renders test tile', () => {
    render(
      <Tile
        id="abc123"
        title="Test Tile"
        image="test.jpg"
        alt="AlternateText"
        caption="test caption"
      />
    );
    expect(screen.getByText('Test Tile')).toBeInTheDocument();
    expect(screen.getByText('test caption')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View' })).toHaveAttribute(
      'href',
      '/reports/display/abc123'
    );
    expect(screen.getByRole('link', { name: 'Update' })).toHaveAttribute(
      'href',
      '/reports/edit/abc123'
    );
    expect(screen.getByRole('img', { name: 'AlternateText' })).toHaveAttribute('src', 'test.jpg');
  });

  it('calls handleClick when the tile is clicked', async () => {
    const handleClick = vi.fn();
    render(<Tile id="abc123" title="Test Tile" handleClick={handleClick} />);
    await userEvent.click(screen.getByText('Test Tile'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
