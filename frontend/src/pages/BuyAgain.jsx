import React from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { mockProducts } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/pricing';

const BuyAgain = () => {
  const { addToCart } = useCart();

  const handleQuickAdd = (productId) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      addToCart(product, product.packSizes[0], 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Buy Again" showBackButton={true} />
      
      <div className="p-4">
        <div className="space-y-4">
          {mockProducts.map(product => {
            const endCustomerPrice = product.pricingTiers[0].price;
            const discount = Math.round(((product.mrp - endCustomerPrice) / product.mrp) * 100);
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500 line-through">{formatPrice(product.mrp)}</span>
                      <span className="font-bold text-green-600">{formatPrice(endCustomerPrice)}</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {discount}% OFF
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600">Last ordered: 2 weeks ago</p>
                  </div>
                  
                  <button
                    onClick={() => handleQuickAdd(product.id)}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default BuyAgain;