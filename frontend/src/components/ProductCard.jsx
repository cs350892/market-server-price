import React, { useState } from 'react';
import { Plus, Minus, Package, Box, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, getCustomerTier, getProductPrice } = useCart();
  
  // State for different purchase modes
  const [consumerQuantity, setConsumerQuantity] = useState(1);
  const [retailerBoxes, setRetailerBoxes] = useState(1);
  
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
  
  // Calculate pricing for different tiers
  const consumerPrice = product.pricingTiers.consumer.price;
  const retailerPrice = product.pricingTiers.retailer.price;
  const wholesalerPrice = product.pricingTiers.wholesaler.price;
  
  const consumerMargin = product.pricingTiers.consumer.margin;
  const retailerMargin = product.pricingTiers.retailer.margin;
  const wholesalerMargin = product.pricingTiers.wholesaler.margin;
  
  // Calculate quantities
  const retailerUnits = retailerBoxes * product.packaging.unitsPerBox;
  const wholesalerUnits = product.packaging.unitsPerBox * product.packaging.boxesPerPack;
  
  const handleConsumerQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(10, consumerQuantity + delta));
    setConsumerQuantity(newQuantity);
  };
  
  const handleRetailerBoxesChange = (delta) => {
    const newBoxes = Math.max(product.packaging.minBoxes, Math.min(product.packaging.maxBoxes, retailerBoxes + delta));
    setRetailerBoxes(newBoxes);
  };
  
  const handleAddToCart = (mode) => {
    switch (mode) {
      case 'units':
        addToCart(product, consumerQuantity, 'units');
        setConsumerQuantity(1);
        break;
      case 'boxes':
        addToCart(product, retailerUnits, 'boxes');
        setRetailerBoxes(1);
        break;
      case 'pack':
        addToCart(product, wholesalerUnits, 'pack');
        break;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="text-sm text-gray-500 mb-4">
          MRP: ₹{product.mrp} • Stock: {product.stock} units
        </div>
        
        {/* Consumer Option (1-10 units) */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor('consumer')}`}>
                Consumer
              </span>
              <span className="text-sm text-gray-600">1-10 units</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                ₹{consumerPrice.toFixed(2)}
              </div>
              <div className="text-xs text-blue-600">
                {consumerMargin.toFixed(1)}% margin
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleConsumerQuantityChange(-1)}
                className="p-1 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors"
                disabled={consumerQuantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="font-semibold w-8 text-center text-sm">{consumerQuantity}</span>
              <button
                onClick={() => handleConsumerQuantityChange(1)}
                className="p-1 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors"
                disabled={consumerQuantity >= 10}
              >
                <Plus size={14} />
              </button>
            </div>
            
            <button
              onClick={() => handleAddToCart('units')}
              className="flex items-center space-x-1 bg-blue-600 text-white py-1 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart size={14} />
              <span>Add</span>
            </button>
          </div>
        </div>
        
        {/* Retailer Option (1-5 boxes) */}
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor('retailer')}`}>
                Retailer
              </span>
              <span className="text-sm text-gray-600">
                {product.packaging.unitsPerBox} units/box
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                ₹{retailerPrice.toFixed(2)}
              </div>
              <div className="text-xs text-green-600">
                {retailerMargin.toFixed(1)}% margin
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleRetailerBoxesChange(-1)}
                className="p-1 rounded-full bg-green-200 hover:bg-green-300 transition-colors"
                disabled={retailerBoxes <= product.packaging.minBoxes}
              >
                <Minus size={14} />
              </button>
              <span className="font-semibold w-8 text-center text-sm">{retailerBoxes}</span>
              <button
                onClick={() => handleRetailerBoxesChange(1)}
                className="p-1 rounded-full bg-green-200 hover:bg-green-300 transition-colors"
                disabled={retailerBoxes >= product.packaging.maxBoxes}
              >
                <Plus size={14} />
              </button>
              <Box size={14} className="text-green-600" />
            </div>
            
            <button
              onClick={() => handleAddToCart('boxes')}
              className="flex items-center space-x-1 bg-green-600 text-white py-1 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <ShoppingCart size={14} />
              <span>Add</span>
            </button>
          </div>
          
          <div className="text-xs text-green-600 mt-1">
            Total: {retailerUnits} units
          </div>
        </div>
        
        {/* Wholesaler Option (Full pack) */}
        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor('wholesaler')}`}>
                Wholesaler
              </span>
              <span className="text-sm text-gray-600">
                Full pack ({wholesalerUnits} units)
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">
                ₹{wholesalerPrice.toFixed(2)}
              </div>
              <div className="text-xs text-purple-600">
                {wholesalerMargin.toFixed(1)}% margin
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package size={16} className="text-purple-600" />
              <span className="text-sm text-purple-700">
                {product.packaging.boxesPerPack} boxes × {product.packaging.unitsPerBox} units
              </span>
            </div>
            
            <button
              onClick={() => handleAddToCart('pack')}
              className="flex items-center space-x-1 bg-purple-600 text-white py-1 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              <ShoppingCart size={14} />
              <span>Add Pack</span>
            </button>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Delivered in {product.deliveryDays}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;