import React, { createContext, useContext, useReducer } from 'react';
import { CustomerTier } from '../types';

const CartContext = createContext(undefined);

function getCustomerTier(quantity) {
  if (quantity >= 51) return CustomerTier.WHOLESALER;
  if (quantity >= 11) return CustomerTier.RETAILER;
  return CustomerTier.CONSUMER;
}

function getProductPrice(product, quantity) {
  const tier = getCustomerTier(quantity);
  return product.pricingTiers[tier].price;
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.productId === action.product.id);
      const newQuantity = existingItem ? existingItem.quantity + action.quantity : action.quantity;
      const price = getProductPrice(action.product, newQuantity);
      
      const getDisplayQuantity = (qty, mode, product) => {
        switch (mode) {
          case 'units':
            return `${qty} units`;
          case 'boxes':
            const boxes = Math.ceil(qty / product.packaging.unitsPerBox);
            return `${boxes} box${boxes > 1 ? 'es' : ''} (${qty} units)`;
          case 'pack':
            const totalUnits = product.packaging.unitsPerBox * product.packaging.boxesPerPack;
            return `1 pack (${totalUnits} units)`;
          default:
            return `${qty} units`;
        }
      };
      
      const newItems = existingItem
        ? state.items.map(item =>
            item.productId === action.product.id
              ? { 
                  ...item, 
                  quantity: newQuantity, 
                  price, 
                  tier: getCustomerTier(newQuantity),
                  purchaseMode: action.mode,
                  displayQuantity: getDisplayQuantity(newQuantity, action.mode, action.product)
                }
              : item
          )
        : [...state.items, {
            productId: action.product.id,
            name: action.product.name,
            image: action.product.image,
            quantity: action.quantity,
            price,
            tier: getCustomerTier(action.quantity),
            mrp: action.product.mrp,
            purchaseMode: action.mode,
            displayQuantity: getDisplayQuantity(action.quantity, action.mode, action.product)
          }];
      
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        const newItems = state.items.filter(item => item.productId !== action.productId);
        return {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
      }
      
      const newItems = state.items.map(item => {
        if (item.productId === action.productId) {
          const tier = getCustomerTier(action.quantity);
          return { ...item, quantity: action.quantity, tier };
        }
        return item;
      });
      
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.productId !== action.productId);
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  
  const addToCart = (product, quantity, mode = 'units') => {
    dispatch({ type: 'ADD_TO_CART', product, quantity, mode });
  };
  
  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };
  
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCustomerTier,
      getProductPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}