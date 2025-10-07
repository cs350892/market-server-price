import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { sampleProducts } from '../data/sampleData';
import { Gift, Store, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search logic
  };
  
  const featuredProducts = sampleProducts.slice(0, 4);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="bg-white p-4 shadow-sm">
        <SearchBar placeholder="Search Choco" onSearch={handleSearch} />
      </div>
      
      {/* Store Categories */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Shop by Store</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/products?filter=high-margin" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <h4 className="font-semibold">High Margin Store</h4>
                <p className="text-sm text-gray-600">Up to 55% margins</p>
              </div>
            </div>
          </Link>
          
          <Link to="/products?filter=regional" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Store className="text-blue-600" size={24} />
              </div>
              <div>
                <h4 className="font-semibold">Regional Brands</h4>
                <p className="text-sm text-gray-600">Local favorites</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <Link to="/categories" className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-2">
              <Gift className="text-purple-600" size={20} />
            </div>
            <span className="text-sm font-medium">Categories</span>
          </Link>
          
          <Link to="/brands" className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-2">
              <Store className="text-orange-600" size={20} />
            </div>
            <span className="text-sm font-medium">Brands</span>
          </Link>
          
          <Link to="/orders" className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-2">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <span className="text-sm font-medium">Buy Again</span>
          </Link>
        </div>
      </div>
      
      {/* Featured Products */}
      <div className="px-4">
        <h3 className="text-lg font-semibold mb-4">Featured Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {/* View All Products Link */}
      <div className="px-4 py-6">
        <Link
          to="/products"
          className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default HomePage;