import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMenuContext } from './useMenuContext.js';
import { MenuProvider } from './menu-context.jsx';

describe('useMenuContext', () => {
  it('throws outside a MenuProvider', () => {
    expect(() => renderHook(() => useMenuContext())).toThrow(
      'useMenuContext must be used within a MenuProvider'
    );
  });

  it('starts empty inside a MenuProvider', () => {
    const { result } = renderHook(() => useMenuContext(), { wrapper: MenuProvider });
    expect(result.current.parentItem).toBe('');
    expect(result.current.childItem).toBe('');
  });

  it('setters update the values', () => {
    const { result } = renderHook(() => useMenuContext(), { wrapper: MenuProvider });
    act(() => {
      result.current.setParentItem('Performance');
      result.current.setChildItem('Time Behaviour');
    });
    expect(result.current.parentItem).toBe('Performance');
    expect(result.current.childItem).toBe('Time Behaviour');
  });
});