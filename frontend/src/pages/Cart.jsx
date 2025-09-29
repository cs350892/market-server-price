import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useCart } from '../context/CartContext';
import { getPricingTier, calculateItemTotal, formatPrice, formatMargin } from '../utils/pricing';

const Cart = () => {
  const { items, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Cart" showBackButton={true} showCartIcon={false} />
        
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-center">Add some products to get started</p>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header title="Cart" showBackButton={true} showCartIcon={false} />
      
      <div className="p-4 space-y-4">
        {items.map(item => {
          const totalQuantity = item.quantity * item.packSize.multiplier;
          const currentTier = getPricingTier(item.product, totalQuantity);
          const itemTotal = calculateItemTotal(item.product, item.quantity, item.packSize.multiplier);
          
          return (
            <div key={`${item.productId}-${item.packSize.id}`} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-start gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.packSize.name}</p>
                  
                  {/* Pricing Info */}
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {currentTier.range} units
                    </span>
                    <span className="ml-2 text-xs text-gray-600">
                      {formatPrice(currentTier.price)}/unit • {formatMargin(currentTier.margin)} margin
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.productId, item.packSize.id, item.quantity - 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-3 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.packSize.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatPrice(itemTotal)}</p>
                      <p className="text-xs text-gray-500">{totalQuantity} total units</p>
                      <button
                        onClick={() => removeFromCart(item.productId, item.packSize.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Clear Cart Button */}
        <button
          onClick={clearCart}
          className="w-full py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Checkout Section */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total: {formatPrice(totalAmount)}</span>
          <span className="text-sm text-gray-600">{items.length} items</span>
        </div>
        
        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
          Proceed to Checkout
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Cart;