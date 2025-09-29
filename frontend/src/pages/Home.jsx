import React, { useState } from 'react';
import { Search, Car, Tv, Store, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockData';
import Footer from '../components/Footer';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const featuredProducts = mockProducts.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="MSP - Market Server Price" showBackButton={false} />
      
      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Store Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => navigate('/products?type=high-margin')}
            className="bg-white rounded-lg p-6 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <Store size={40} className="text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">High Margin Store</h3>
            <p className="text-sm text-gray-600 mt-1">Products with higher profit margins</p>
          </div>
          
          <div 
            onClick={() => navigate('/products?type=regional-brands')}
            className="bg-white rounded-lg p-6 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <Building2 size={40} className="text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">Regional Brands Store</h3>
            <p className="text-sm text-gray-600 mt-1">Local and regional brand products</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/brands')}
            className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Store size={16} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Brands</span>
          </button>
          
          <button
            onClick={() => navigate('/categories')}
            className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Building2 size={16} className="text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Categories</span>
          </button>
          
          <button
            onClick={() => navigate('/addresses')}
            className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Building2 size={16} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Addresses</span>
          </button>
          
          <button
            onClick={() => navigate('/buy-again')}
            className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
          >
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Search size={16} className="text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Buy Again</span>
          </button>
          
          <button
            onClick={() => navigate('/admin')}
            className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow col-span-2 md:col-span-1"
          >
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Building2 size={16} className="text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Admin Panel</span>
          </button>
        </div>

        {/* Featured Products */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Featured Products</h2>
          <p className="text-sm text-gray-600 mb-4">
            Prices automatically adjust based on quantity: Better prices for higher quantities
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* View All Products Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              View All Products
            </button>
          </div>
        </div>
      </div>\

      <Footer></Footer>

      <BottomNavigation />
    </div>
  );
};

export default Home;