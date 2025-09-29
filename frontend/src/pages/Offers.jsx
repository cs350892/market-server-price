import React from 'react';
import { Gift } from 'lucide-react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const Offers = () => {
  const offers = [
    {
      id: '1',
      title: 'Diwali Special Offer',
      description: 'Get 20% off on orders above ₹500',
      code: 'DIWALI20',
      validTill: '31st Oct, 2024',
      color: 'from-orange-400 to-red-500',
    },
    {
      id: '2',
      title: 'First Order Discount',
      description: 'Get ₹100 off on your first order',
      code: 'FIRST100',
      validTill: '31st Dec, 2024',
      color: 'from-blue-400 to-purple-500',
    },
    {
      id: '3',
      title: 'Buy 2 Get 1 Free',
      description: 'On selected beauty products',
      code: 'BEAUTY3',
      validTill: '15th Nov, 2024',
      color: 'from-pink-400 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Offers" showBackButton={true} />
      
      <div className="p-4 space-y-4">
        {offers.map(offer => (
          <div key={offer.id} className={`bg-gradient-to-r ${offer.color} rounded-lg p-6 text-white shadow-lg`}>
            <div className="flex items-start justify-between mb-4">
              <Gift size={24} />
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                Valid till {offer.validTill}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
            <p className="text-sm opacity-90 mb-4">{offer.description}</p>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs opacity-80">Use code:</span>
                <p className="font-bold text-lg">{offer.code}</p>
              </div>
              <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-30 transition-colors">
                Copy Code
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Offers;