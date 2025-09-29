import React from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { mockCategories } from '../data/mockData';

const Categories = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Categories" showBackButton={true} />
      
      <div className="p-4 space-y-6">
        {mockCategories.map(category => (
          <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center p-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.map((sub, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Categories;