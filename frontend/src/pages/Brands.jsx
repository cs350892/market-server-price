import React from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { mockBrands } from '../data/mockData';

const Brands = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Brands" showBackButton={true} />
      
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockBrands.map(brand => (
            <div
              key={brand.id}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-16 h-16 mx-auto mb-3 object-cover rounded-lg"
              />
              <h3 className="font-semibold text-gray-800 text-sm">{brand.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Brands;