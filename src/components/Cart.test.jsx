import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Cart from './Cart.jsx';
import CartContext from '../store/cart-context.jsx';

const mockItems = [
  { requirement: { id: 1, identifier: 'TST-TST-01', title: 'Response time' }, category: { name: 'Category 1' }, subCategory: { name: 'SubCategory 11' } },
  { requirement: { id: 2, identifier: 'TST-TST-02', title: 'Capacity' }, category: { name: 'Category 2' }, subCategory: { name: 'SubCategory 22' } },
];

function renderCart({ items = [], removeItem = vi.fn(), handleShowCart = vi.fn() } = {}) {
  render(
    <CartContext.Provider value={{ items, removeItem }}>
      <Cart handleShowCart={handleShowCart} />
    </CartContext.Provider>
  );
  return { removeItem, handleShowCart };
}

describe('Cart', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  it('renders default page', () => {
    renderCart();
    expect(screen.getByRole('heading', { name: 'Cart Items (0)' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Quality Attribute' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Identifier' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Characteristic' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Sub-Characteristic' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Action' })).toBeInTheDocument();
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(1); // just headings
  });

  it('renders items, check for contents', () => {
    renderCart({ items: mockItems });
    expect(screen.getByRole('heading', { name: 'Cart Items (2)' })).toBeInTheDocument();

    const rows = screen.getAllByRole('row'); // rows[0] is the header
    const cells = within(rows[1]).getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Response time');
    expect(cells[1]).toHaveTextContent('TST-TST-01');
    expect(cells[2]).toHaveTextContent('Category 1');
    expect(cells[3]).toHaveTextContent('SubCategory 11');
    expect(cells[4]).toHaveTextContent('Remove');
  });

  it('remove an item', async () => {
    const result = renderCart({ items: mockItems });
    const rows = screen.getAllByRole('row'); // rows[0] is the header
    const user = userEvent.setup();
    await user.click(within(rows[1]).getByText('Remove'));
    expect(result.removeItem).toHaveBeenCalledWith(1);
  });

  it('closes the cart', async () => {
    const result = renderCart({ items: mockItems });
    const user = userEvent.setup();
    await user.click(screen.getByText('Close'));
    expect(result.handleShowCart).toHaveBeenCalledWith(false);
  });


});