import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Plus, Minus, Truck } from 'lucide-react';
import { sampleProducts } from '../data/sampleData';
import { useCart } from '../contexts/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = sampleProducts.find(p => p.id === id);
  const { addToCart, getCustomerTier, getProductPrice } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Product not found</h2>
          <Link to="/products" className="text-blue-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }
  
  const currentTier = getCustomerTier(quantity);
  const currentPrice = getProductPrice(product, quantity);
  const currentMargin = product.pricingTiers[currentTier].margin;
  
  const getTierLabel = (tier) => {
    switch (tier) {
      case 'consumer': return 'Consumer';
      case 'retailer': return 'Retailer';
      case 'wholesaler': return 'Wholesaler';
      default: return tier;
    }
  };
  
  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity, 'units');
    // Optional: Show success message or redirect
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Image */}
      <div className="bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 md:h-96 object-cover"
        />
      </div>
      
      <div className="p-4">
        {/* Product Info */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <h1 className="text-xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-blue-600 font-medium">{product.brand}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{product.category}</span>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.5) • 124 reviews</span>
          </div>
          
          <p className="text-gray-700 mb-4">{product.description}</p>
          
          {/* Features */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Pricing Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-500">
              MRP: <span className="line-through">₹{product.mrp}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ₹{currentPrice.toFixed(2)}
              </div>
              <div className="text-sm text-green-600">
                {currentMargin.toFixed(1)}% margin
              </div>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-1">
              Current Category: {getTierLabel(currentTier)}
            </div>
            <div className="text-xs text-blue-600">
              {currentTier === 'consumer' && 'Qty: 1-10 units (Consumer pricing)'}
              {currentTier === 'retailer' && 'Qty: 11-50 units (Mid-tier wholesale)'}
              {currentTier === 'wholesaler' && 'Qty: 51+ units (Bulk wholesale)'}
            </div>
          </div>
          
          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="font-semibold w-12 text-center text-lg">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Stock Info */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">In Stock:</span>
            <span className={`text-sm font-medium ${
              product.stock < 20 ? 'text-red-600' : 'text-green-600'
            }`}>
              {product.stock} units available
            </span>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3"
          >
            Add {quantity} {quantity === 1 ? 'unit' : 'units'} to Cart
          </button>
          
          {/* Delivery Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Truck size={16} />
            <span>Delivered in {product.deliveryDays}</span>
          </div>
        </div>
        
        {/* Pricing Tiers */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <h3 className="font-semibold mb-3">Pricing Tiers</h3>
          <div className="space-y-3">
            <div className={`p-3 rounded-lg border-2 ${
              currentTier === 'consumer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Consumer (1-10 units)</div>
                  <div className="text-sm text-gray-600">Consumer pricing</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{product.pricingTiers['consumer'].price.toFixed(2)}</div>
                  <div className="text-sm text-green-600">
                    {product.pricingTiers['consumer'].margin}% margin
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg border-2 ${
              currentTier === 'retailer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Retailer (11-50 units)</div>
                  <div className="text-sm text-gray-600">Mid-tier wholesale</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{product.pricingTiers['retailer'].price.toFixed(2)}</div>
                  <div className="text-sm text-green-600">
                    {product.pricingTiers['retailer'].margin}% margin
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg border-2 ${
              currentTier === 'wholesaler' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Wholesaler (51+ units)</div>
                  <div className="text-sm text-gray-600">Bulk wholesale</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{product.pricingTiers['wholesaler'].price.toFixed(2)}</div>
                  <div className="text-sm text-green-600">
                    {product.pricingTiers['wholesaler'].margin}% margin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-3">People also bought</h3>
          <div className="grid grid-cols-2 gap-3">
            {sampleProducts.slice(1, 5).filter(p => p.id !== product.id).slice(0, 4).map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                className="block border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
                <div className="text-sm font-medium line-clamp-2">{relatedProduct.name}</div>
                <div className="text-xs text-gray-600 mt-1">₹{relatedProduct.pricingTiers['consumer'].price.toFixed(2)}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;