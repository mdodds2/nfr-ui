import { createContext, useReducer } from "react";

const CartContext = createContext({
    items: [],
    addItem: () => {},
    removeItem: () => {},
    clearCart: () => {},
});

function cartReducer(state, action) {
    if(action.type === 'ADD_ITEM') {
        const updatedItems = [...state.items];
        updatedItems.push( {
            ...action.item,
        });

        return {...state, items: updatedItems };
    }

    if (action.type === 'SET_ITEMS') {
        return { ...state, items: action.items };
    }

    if(action.type === 'REMOVE_ITEM') {
        return { ...state, items: state.items.filter(item => item.requirement.id !== action.id) };
    }

    if(action.type === 'CLEAR_CART') {
        return { ...state, items: [] };
    }

    return state;
}

export function CartContextProvider({children}) {

    const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

    function addItem(item) {
        dispatchCartAction( {type: 'ADD_ITEM', item} );
    }

    function setItems(items) {
        dispatchCartAction({ type: 'SET_ITEMS', items });
    }

    function removeItem(id) {
        dispatchCartAction( {type: 'REMOVE_ITEM', id });
    }

    function clearCart() {
        dispatchCartAction( {type: 'CLEAR_CART'} );
    }

    const cartContextValue = {
        items: cart.items,
        addItem,
        setItems,
        removeItem,
        clearCart,    
    };

    return <CartContext.Provider value={cartContextValue}>{children}</CartContext.Provider>
}

export default CartContext;
