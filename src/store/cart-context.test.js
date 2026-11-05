import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContext } from 'react';
import CartContext, { CartContextProvider } from './cart-context.jsx';

const renderCart = () =>
  renderHook(() => useContext(CartContext), { wrapper: CartContextProvider });

describe('CartContextProvider', () => {

  it('starts with an empty cart', () => {
    const { result } = renderCart();
    expect(result.current.items).toEqual([]);
  });

  it('adds an item to the cart', () => {
    const { result } = renderCart();
    const item = { requirement: { id: 100 }, targetValue: '2s' };

    act(() => {
      result.current.addItem(item);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(item);
  });

  it('ignores a duplicate item', () => {
    const { result } = renderCart();
    const item = { requirement: { id: 100 }, targetValue: '2s' };

    act(() => {
      result.current.addItem(item);
      result.current.addItem(item);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(item);
  });

  it('removes an item from the cart', () => {
    const { result } = renderCart();
    const item = { requirement: { id: 100 }, targetValue: '2s' };

    act(() => {
      result.current.addItem(item);
      result.current.removeItem(item.requirement.id);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('removes an item from the cart, leaves others', () => {
    const { result } = renderCart();
    const items = [{ requirement: { id: 201 }, targetValue: '21s' },{ requirement: { id: 202 }, targetValue: '22s' }];

    act(() => {
      result.current.setItems(items);
      result.current.removeItem(201);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].requirement.id).toEqual(202);
  });

  it('removes an item from the cart that does not exist', () => {
    const { result } = renderCart();
    const item = { requirement: { id: 100 }, targetValue: '1s' };

    act(() => {
      result.current.addItem(item);
      result.current.removeItem(99);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(item);
  });


  it('replaces cart contents', () => {
    const { result } = renderCart();
    const item = { requirement: { id: 100 }, targetValue: '1s' };
    const items = [{ requirement: { id: 201 }, targetValue: '21s' },{ requirement: { id: 202 }, targetValue: '22s' }];

    act(() => {
      result.current.addItem(item);
      result.current.setItems(items);
    });

    expect(result.current.items).toEqual(items);
  });

  it('clears the cart', () => {
    const { result } = renderCart();
    const items = [{ requirement: { id: 201 }, targetValue: '21s' },{ requirement: { id: 202 }, targetValue: '22s' }];

    act(() => {
      result.current.setItems(items);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });

});