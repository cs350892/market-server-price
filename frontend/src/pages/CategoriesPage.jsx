import React from 'react';
import { Link } from 'react-router-dom';
import { sampleCategories }  from '../data/sampleData';
import { ChevronRight } from 'lucide-react';

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">Product Categories</h2>
        
        <div className="space-y-4">
          {sampleCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Link
                to={`/products?category=${category.name.toLowerCase()}`}
                className="flex items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {category.subcategories.length} subcategories
                  </p>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </Link>
              
              {/* Subcategories */}
              <div className="border-t bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4">
                  {category.subcategories.map((subcategory, index) => (
                    <Link
                      key={index}
                      to={`/products?category=${category.name.toLowerCase()}&subcategory=${subcategory.toLowerCase()}`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline p-2 rounded-lg hover:bg-white transition-colors"
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Access Categories */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/products?filter=high-margin"
              className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-4 text-white text-center hover:from-green-500 hover:to-green-700 transition-colors"
            >
              <div className="text-2xl mb-2">📈</div>
              <span className="text-sm font-medium">High Margin</span>
              <p className="text-xs opacity-80">50%+ margins</p>
            </Link>
            
            <Link
              to="/products?filter=fast-moving"
              className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-4 text-white text-center hover:from-blue-500 hover:to-blue-700 transition-colors"
            >
              <div className="text-2xl mb-2">🔥</div>
              <span className="text-sm font-medium">Fast Moving</span>
              <p className="text-xs opacity-80">Top sellers</p>
            </Link>
            
            <Link
              to="/products?filter=seasonal"
              className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-4 text-white text-center hover:from-orange-500 hover:to-orange-700 transition-colors"
            >
              <div className="text-2xl mb-2">🎃</div>
              <span className="text-sm font-medium">Seasonal</span>
              <p className="text-xs opacity-80">Festival items</p>
            </Link>
            
            <Link
              to="/products?filter=bulk-deals"
              className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 text-white text-center hover:from-purple-500 hover:to-purple-700 transition-colors"
            >
              <div className="text-2xl mb-2">📦</div>
              <span className="text-sm font-medium">Bulk Deals</span>
              <p className="text-xs opacity-80">Wholesale rates</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;