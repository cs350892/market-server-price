import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const OrdersPage = () => {
  const [orders] = useState([
    {
      id: '1',
      userId: '1',
      items: [
        {
          productId: '1',
          name: 'Blue Heaven Kajal',
          image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg',
          quantity: 10,
          price: 22.15,
          tier: 'end-customer',
          mrp: 35
        }
      ],
      total: 221.50,
      address: {
        id: '1',
        name: 'Home',
        addressLine: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 98765 43210',
        isDefault: true
      },
      status: 'delivered',
      createdAt: '2024-01-15T10:30:00Z',
      deliveryDate: '2024-01-17T14:00:00Z'
    },
    {
      id: '2',
      userId: '1',
      items: [
        {
          productId: '2',
          name: 'Cadbury Dairy Milk',
          image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
          quantity: 25,
          price: 28.00,
          tier: 'retailer',
          mrp: 50
        }
      ],
      total: 700.00,
      address: {
        id: '2',
        name: 'Shop',
        addressLine: '456 Business District, Shop No. 12',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        phone: '+91 98765 43211',
        isDefault: false
      },
      status: 'shipped',
      createdAt: '2024-01-18T09:15:00Z'
    }
  ]);
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      case 'confirmed':
        return <CheckCircle className="text-blue-600" size={20} />;
      case 'shipped':
        return <Truck className="text-orange-600" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'cancelled':
        return <AlertCircle className="text-red-600" size={20} />;
      default:
        return <Package className="text-gray-600" size={20} />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">My Orders</h2>
          <span className="text-sm text-gray-600">{orders.length} orders</span>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h3>
            <p className="text-gray-500">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Order #{order.id}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Ordered on {formatDate(order.createdAt)}
                    </span>
                    <span className="font-semibold">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>
                  
                  {order.deliveryDate && (
                    <div className="text-sm text-green-600 mt-1">
                      Delivered on {formatDate(order.deliveryDate)}
                    </div>
                  )}
                </div>
                
                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-gray-600">
                            Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ₹{(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Delivery Address */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-sm mb-1">Delivery Address</h5>
                    <div className="text-sm text-gray-600">
                      <p>{order.address.name}</p>
                      <p>{order.address.addressLine}</p>
                      <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-3 mt-4">
                    <button className="flex-1 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Track Order
                    </button>
                    <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Buy Again
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Buy Again Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Buy Again</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-center py-8">
              <Package size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Items from your recent orders will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;