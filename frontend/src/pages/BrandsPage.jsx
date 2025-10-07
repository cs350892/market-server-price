import React from 'react';
import { Link } from 'react-router-dom';
import { sampleBrands } from '../data/sampleData';

const BrandsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">Popular Brands</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sampleBrands.map((brand) => (
            <Link
              key={brand.id}
              to={`/products?brand=${brand.name.toLowerCase()}`}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-4xl mb-3">{brand.logo}</div>
              <h3 className="font-semibold mb-1">{brand.name}</h3>
              <p className="text-sm text-gray-600">{brand.description}</p>
            </Link>
          ))}
        </div>
        
        {/* Featured Brands Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Featured Brands</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {sampleBrands.slice(0, 6).map((brand) => (
                <Link
                  key={brand.id}
                  to={`/products?brand=${brand.name.toLowerCase()}`}
                  className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-1">{brand.logo}</div>
                  <span className="text-xs font-medium">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Brand Categories */}
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cosmetics Brands</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">💄</div>
                <span className="text-sm font-medium">Blue Heaven</span>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">💋</div>
                <span className="text-sm font-medium">Lakme</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Food Brands</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">🍫</div>
                <span className="text-sm font-medium">Cadbury</span>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">🍪</div>
                <span className="text-sm font-medium">Parle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;