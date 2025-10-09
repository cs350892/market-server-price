import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Track admin vs. user

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin || false);
    }
  }, []);

  const login = (email, password) => {
    // Admin login
    if (email === 'admin@marketserverprice.com' && password === 'admin123') {
      const userData = { email, isAdmin: true };
      setIsAuthenticated(true);
      setUser(userData);
      setIsAdmin(true);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, isAdmin: true };
    }
    // Default user login
    if (email === 'user@marketserverprice.com' && password === 'user123') {
      const userData = { email, isAdmin: false };
      setIsAuthenticated(true);
      setUser(userData);
      setIsAdmin(false);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, isAdmin: false };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};