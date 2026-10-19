import { useContext } from 'react';
import { MenuContext } from './menu-context-object';

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};