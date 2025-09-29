import React from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const Orders = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="My Orders" showBackButton={true} />
      
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h2>
        <p className="text-gray-500 text-center">Your order history will appear here</p>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Orders;