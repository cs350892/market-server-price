import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartPage = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  
  const getTierLabel = (tier) => {
    switch (tier) {
      case 'consumer': return 'Consumer';
      case 'retailer': return 'Retailer';
      case 'wholesaler': return 'Wholesaler';
      default: return tier;
    }
  };
  
  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case 'consumer': return 'bg-blue-100 text-blue-800';
      case 'retailer': return 'bg-green-100 text-green-800';
      case 'wholesaler': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor(item.tier)}`}>
                      {getTierLabel(item.tier)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {item.displayQuantity}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</div>
                      <div className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Clear Cart Button */}
        <button
          onClick={clearCart}
          className="w-full mb-6 py-2 px-4 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear Cart
        </button>
        
        {/* Cart Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600">FREE</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          
          <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Proceed to Checkout
          </button>
        </div>
        
        {/* Savings Info */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">💰 You're Saving!</h4>
          <p className="text-green-700 text-sm">
            Based on your quantities, you're getting wholesale prices with great margins for resale.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;