import React, { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const loginAdmin = (email, password) => {
    
    if (email === 'admin@company.com' && password === 'admin123') {
      const admin = { email, name: 'Admin User' };
      setAdminData(admin);
      setIsAdminLoggedIn(true);
     
      localStorage.setItem('adminToken', 'fake-jwt-token');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminData(null);
    localStorage.removeItem('adminToken');
  };

  const value = {
    isAdminLoggedIn,
    adminData,
    loginAdmin,
    logoutAdmin
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};