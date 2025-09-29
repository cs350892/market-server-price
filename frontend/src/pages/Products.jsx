import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockData';

const Products = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const getTitle = () => {
    switch (type) {
      case 'high-margin':
        return 'High Margin Products';
      case 'regional-brands':
        return 'Regional Brands';
      default:
        return 'All Products';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={getTitle()} showBackButton={true} />
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Products;