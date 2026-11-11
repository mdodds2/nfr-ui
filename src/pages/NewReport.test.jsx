import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import CartContext from '../store/cart-context.jsx';
import NewReport from './NewReport.jsx';

vi.mock('../components/ReportForm.jsx', () => ({
  default: ({ mode }) => <div>ReportForm {mode}</div>,
}));

describe('NewReport', () => {
  it('clears the cart and renders the form in new mode', () => {
    const clearCart = vi.fn();
    render(
      <CartContext.Provider value={{ clearCart }}>
        <NewReport />
      </CartContext.Provider>
    );
    expect(clearCart).toHaveBeenCalledTimes(1);
    expect(screen.getByText('ReportForm new')).toBeInTheDocument();
  });
});
