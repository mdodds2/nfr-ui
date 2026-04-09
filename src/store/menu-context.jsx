import { useState, useContext, createContext } from 'react';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [parentItem, setParentItem] = useState('');
  const [childItem, setChildItem] = useState('');

  return (
    <MenuContext.Provider value={{ parentItem, setParentItem, childItem, setChildItem }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a CounterProvider');
  }
  return context;
};