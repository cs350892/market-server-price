import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import PaymentsReports from '../components/PaymentsReports';
import OffersCoupons from '../components/OffersCoupons';
import MessagesSupport from '../components/MessagesSupport'

const Admin = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'payments':
        return <PaymentsReports />;
      case 'offers':
        return <OffersCoupons />;
      case 'messages':
        return <MessagesSupport />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Admin Panel" showBackButton={true} />
      <div className="container mx-auto p-4 flex-grow">
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 ${activeTab === 'products' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 ${activeTab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 ${activeTab === 'payments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Payments & Reports
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 ${activeTab === 'offers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Offers & Coupons
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 ${activeTab === 'messages' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Messages
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;