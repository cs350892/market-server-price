import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+91 98765 43210',
    role: 'customer'
  });
  
  const login = async (email, password) => {
    // Mock authentication
    if (email === 'admin@example.com') {
      setUser({
        id: '2',
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+91 98765 43211',
        role: 'admin'
      });
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const isAdmin = () => {
    return user?.role === 'admin';
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}