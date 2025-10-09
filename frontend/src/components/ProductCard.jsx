import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getPricingTier, calculateItemTotal, formatPrice, formatMargin } from '../utils/pricing';

const ProductCard = ({ product }) => {
  const [selectedPackSize, setSelectedPackSize] = useState(product.packSizes[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const totalQuantity = quantity * selectedPackSize.multiplier;
  const currentTier = getPricingTier(product, totalQuantity);
  const itemTotal = calculateItemTotal(product, quantity, selectedPackSize.multiplier);

  const handleAddToCart = () => {
    addToCart(product, selectedPackSize, quantity);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-sm text-gray-500 line-through">{formatPrice(product.mrp)}</span>
            <span className="text-lg font-bold text-green-600 ml-2">{formatPrice(currentTier.price)}</span>
          </div>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {formatMargin(currentTier.margin)} margin
          </span>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pack Size</label>
          <select
            value={selectedPackSize.id}
            onChange={(e) => {
              const packSize = product.packSizes.find(p => p.id === e.target.value);
              if (packSize) setSelectedPackSize(packSize);
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {product.packSizes.map(pack => (
              <option key={pack.id} value={pack.id}>
                {pack.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Selector with Real-time Updates */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <Minus size={16} />
            </button>
            <div className="mx-4 text-center">
              <div className="font-semibold text-lg">{quantity}</div>
              <div className="text-xs text-gray-500">
                Total: {totalQuantity} units
              </div>
            </div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="text-right">
            <div className="font-bold text-lg">{formatPrice(itemTotal)}</div>
            <div className="text-xs text-gray-500">
              {formatPrice(currentTier.price)}/unit
            </div>
          </div>
        </div>

        {/* Pricing Tiers Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Quantity Based Pricing:</h4>
          <div className="space-y-1">
            {product.pricingTiers.map((tier, index) => (
              <div key={index} className={`text-xs flex justify-between ${
                tier.range === currentTier.range ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}>
                <span>{tier.range} units</span>
                <span>{formatPrice(tier.price)} ({formatMargin(tier.margin)})</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${
            product.stock > 0 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>

      </div>
    </div>
  );
};

export default ProductCard;