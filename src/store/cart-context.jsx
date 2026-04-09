import { createContext, useReducer } from "react";

const CartContext = createContext({
    items: [],
    addItem: (item) => {},
    removeItem: (id) => {},
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

    if(action.type === 'REMOVE_ITEM') {
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.requirementId === action.id
        );
        const updatedItems = [...state.items];
        updatedItems.splice(existingCartItemIndex, 1);
        return {...state, items: updatedItems };
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

    function removeItem(id) {
        dispatchCartAction( {type: 'REMOVE_ITEM', id });
    }

    function clearCart() {
        dispatchCartAction( {type: 'CLEAR_CART'} );
    }

    const cartContextValue = {
        items: cart.items,
        addItem,
        removeItem,
        clearCart,    
    };

    return <CartContext.Provider value={cartContextValue}>{children}</CartContext.Provider>
}

export default CartContext;
