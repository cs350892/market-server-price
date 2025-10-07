import React, { useState } from 'react';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Home',
      addressLine: '123 Main Street, Apartment 4B',
      city: 'Kanpur',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91 98765 43210',
      isDefault: true
    },
    {
      id: '2',
      name: 'Shop',
      addressLine: '456 Business District, Shop No. 12',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      phone: '+91 98765 43211',
      isDefault: false
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...editingAddress, ...formData }
          : formData.isDefault ? { ...addr, isDefault: false } : addr
      ));
      setEditingAddress(null);
    } else {
      // Add new address
      const newAddress = {
        id: Date.now().toString(),
        ...formData
      };
      
      setAddresses([
        ...addresses.map(addr => formData.isDefault ? { ...addr, isDefault: false } : addr),
        newAddress
      ]);
    }
    
    setFormData({
      name: '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      isDefault: false
    });
    setShowAddForm(false);
  };
  
  const handleEdit = (address) => {
    setFormData({
      name: address.name,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };
  
  const handleDelete = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
  };
  
  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        {/* Add Address Button */}
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingAddress(null);
            setFormData({
              name: '',
              addressLine: '',
              city: '',
              state: '',
              pincode: '',
              phone: '',
              isDefault: false
            });
          }}
          className="w-full mb-6 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Address</span>
        </button>
        
        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin size={20} className="text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">{address.name}</h3>
                    {address.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="text-gray-600 mb-2">
                <p>{address.addressLine}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <p>Phone: {address.phone}</p>
              </div>
              
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Add/Edit Address Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Home, Office"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Full Address</label>
                  <textarea
                    value={formData.addressLine}
                    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                    placeholder="House/Flat no., Building, Area, Street"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isDefault" className="text-sm">Set as default address</label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {editingAddress ? 'Update' : 'Add'} Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesPage;