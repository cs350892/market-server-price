import React, { createContext, useContext, useReducer } from 'react';
import { calculateItemTotal } from '../utils/pricing';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, packSize, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.productId === product.id && item.packSize.id === packSize.id
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        newItems = [...state.items, { productId: product.id, product, packSize, quantity }];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce(
        (sum, item) => sum + calculateItemTotal(item.product, item.quantity, item.packSize.multiplier), 0
      );

      return { items: newItems, totalItems, totalAmount };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(
        item => !(item.productId === action.payload.productId && item.packSize.id === action.payload.packSizeId)
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce(
        (sum, item) => sum + (item.product.akPrice * item.packSize.multiplier * item.quantity), 0
      );

      return { items: newItems, totalItems, totalAmount };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, packSizeId, quantity } = action.payload;
      if (quantity === 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { productId, packSizeId } });
      }

      const newItems = state.items.map(item =>
        item.productId === productId && item.packSize.id === packSizeId
          ? { ...item, quantity }
          : item
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce(
        (sum, item) => sum + (item.product.akPrice * item.packSize.multiplier * item.quantity), 0
      );

      return { items: newItems, totalItems, totalAmount };
    }

    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalAmount: 0 };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });

  const addToCart = (product, packSize, quantity) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, packSize, quantity } });
  };

  const removeFromCart = (productId, packSizeId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, packSizeId } });
  };

  const updateQuantity = (productId, packSizeId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, packSizeId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};