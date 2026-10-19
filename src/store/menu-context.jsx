import { useState } from 'react';
import { MenuContext } from './menu-context-object';

export const MenuProvider = ({ children }) => {
  const [parentItem, setParentItem] = useState('');
  const [childItem, setChildItem] = useState('');
  return (
    <MenuContext.Provider value={{ parentItem, setParentItem, childItem, setChildItem }}>
      {children}
    </MenuContext.Provider>
  );
};