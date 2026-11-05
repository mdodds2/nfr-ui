import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loader } from './EditReport-loader';
import { getReport, getCategories } from '../util/http.js';
import { buildCartItems } from '../util/report-cart.js';

vi.mock('../util/http.js', () => ({ getReport: vi.fn(), getCategories: vi.fn() }));
vi.mock('../util/report-cart.js', () => ({ buildCartItems: vi.fn() }));

const report = { id: 1, name: 'Report' };
const categories = [{ id: 2, name: 'Performance' }];
const cartItems = [{ id: 55 }];

describe('Edit Report loader', () => {
  let cartRef;

  beforeEach(() => {
    vi.resetAllMocks();
    cartRef = { current: { setItems: vi.fn() } };
  });

  it('loads the report and categories and fills the cart', async () => {
    getReport.mockResolvedValueOnce(report);
    getCategories.mockResolvedValueOnce(categories);
    buildCartItems.mockReturnValueOnce(cartItems);

    const result = await loader(cartRef)({ params: { id: '1' } });

    expect(getReport).toHaveBeenCalledWith('1');
    expect(buildCartItems).toHaveBeenCalledWith(report, categories);
    expect(cartRef.current.setItems).toHaveBeenCalledWith(cartItems);
    expect(result).toEqual({ report, categories });
  });

  it('does not touch the cart when a fetch fails', async () => {
    getReport.mockRejectedValueOnce(new Error('boom'));
    getCategories.mockResolvedValueOnce(categories);

    await expect(loader(cartRef)({ params: { id: '1' } })).rejects.toThrow('boom');
    expect(cartRef.current.setItems).not.toHaveBeenCalled();
  });
});