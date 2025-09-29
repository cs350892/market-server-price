import React, { createContext, useContext, useState } from 'react';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'MANSAN RAJ TRADERS',
      address: 'Shop No 25 Vishwamber Nath Market, Sector 24',
      city: 'Gurgaon',
      pincode: '122001',
      phone: '+91 9876543210',
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: Date.now().toString(),
    };
    setAddresses(prev => [...prev, newAddress]);
  };

  const removeAddress = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  return (
    <AddressContext.Provider value={{
      addresses,
      addAddress,
      removeAddress,
      selectedAddress,
      setSelectedAddress,
    }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};