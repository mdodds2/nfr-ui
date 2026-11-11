import { useContext } from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DisplayContextProvider from './display-context.jsx';
import { DisplayContext } from './display-context-object.js';

describe('DisplayContextProvider', () => {
  function renderDisplay() {
    return renderHook(() => useContext(DisplayContext), { wrapper: DisplayContextProvider });
  }

  it('starts with default values', () => {
    const { result } = renderDisplay();
    expect(result.current.categoryId).toBeUndefined();
    expect(result.current.subCategoryId).toBeUndefined();
    expect(result.current.subCategories).toBeUndefined();
    expect(result.current.cartCount).toBe(0);
  });

  it('setters update the values', () => {
    const { result } = renderDisplay();
    act(() => {
      result.current.setCategoryId(1);
      result.current.setSubCategoryId(10);
      result.current.setSubCategories([{ id: 10 }]);
      result.current.setCartCount(3);
    });
    expect(result.current.categoryId).toBe(1);
    expect(result.current.subCategoryId).toBe(10);
    expect(result.current.subCategories).toEqual([{ id: 10 }]);
    expect(result.current.cartCount).toBe(3);
  });
  it('falls back to defaults without a provider', () => {
    const { result } = renderHook(() => useContext(DisplayContext));
    expect(result.current.cartCount).toBe(0);
    expect(result.current.categoryId).toBeNull();
    result.current.setCategoryId(1);
    result.current.setSubCategoryId(1);
    result.current.setSubCategories([]);
    result.current.setCartCount(1);
  });
});
