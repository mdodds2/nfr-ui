import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Category from './Category.jsx';

describe('Category', () => {
  it('renders default category view, current, inCart', () => {
    render(<Category title="Test Category" current={true} inCart={true} />);
    const box = screen.getByText(/Test Category/);
    expect(box).toHaveClass('interactive-box', 'current-interactive-box');
    expect(box).toHaveTextContent('✔');
  });

  it('renders default category view. current, not inCart', () => {
    render(<Category title="Test Category" current={true} inCart={false} />);
    const box = screen.getByText(/Test Category/);
    expect(box).toHaveClass('interactive-box', 'current-interactive-box');
    expect(box).not.toHaveTextContent('✔');
  });

  it('renders default category view. not current, inCart', () => {
    render(<Category title="Test Category" current={false} inCart={true} />);
    const box = screen.getByText(/Test Category/);
    expect(box).not.toHaveClass('current-interactive-box');
    expect(box).toHaveTextContent('✔');
  });

  it('renders default category view. not current, not inCart', () => {
    render(<Category title="Test Category" current={false} inCart={false} />);
    const box = screen.getByText(/Test Category/);
    expect(box).not.toHaveClass('current-interactive-box');
    expect(box).not.toHaveTextContent('✔');
  });

  it('calls handleClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Category title="Test Category" handleClick={handleClick} />);
    await userEvent.click(screen.getByText(/Test Category/));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
