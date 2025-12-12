import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Minimal backend-integrated AuthProvider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load saved auth info from localStorage (if present)
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'admin' || parsedUser.isAdmin);
        setToken(storedToken);
      } catch (e) {
        // ignore parse errors
        // console.error('Error parsing stored user data:', e);
      }
    }
  }, []);

  // Get API base URL from environment
  const API_BASE_URL = import.meta.env.VITE_URL_API || 'http://localhost:5000/api';
  const login = async (email, password) => {
    try {
      const loginUrl = `${API_BASE_URL}/auth/login`;
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      
      if (!res.ok) return { success: false, message: data.message || 'Login failed' };

      const { token: receivedToken, user: receivedUser } = data;
      
      if (!receivedToken || !receivedUser) {
        console.error('Missing token or user in response:', data);
        return { success: false, message: 'Invalid response from server' };
      }
      
      setIsAuthenticated(true);
      setUser(receivedUser);
      setIsAdmin(receivedUser.role === 'admin');
      setToken(receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      localStorage.setItem('authToken', receivedToken);
      
      console.log('Login successful, token saved:', receivedToken.substring(0, 20) + '...');
      return { success: true, user: receivedUser };
    } catch (err) {
      console.error('Login network error:', err);
      return { success: false, message: 'Network error: ' + err.message };
    }
  };

  // Call backend /auth/signup to create new user account
  const signup = async (name, email, password) => {
    try {
      const signupUrl = `${API_BASE_URL}/auth/signup`;
      const res = await fetch(signupUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      
      if (!res.ok) return { success: false, message: data.message || 'Signup failed' };

      // Auto-login after successful signup
      const loginResult = await login(email, password);
      if (loginResult.success) {
        return { success: true, message: 'Account created and logged in successfully', user: loginResult.user };
      } else {
        return { success: true, message: 'Account created successfully. Please login.', user: data.user };
      }
    } catch (err) {
      console.error('Signup network error:', err);
      return { success: false, message: 'Network error: ' + err.message };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  // Helper for API calls that need Authorization header
  const apiFetch = async (path, options = {}) => {
    try {
      const headers = options.headers || {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      // Use API_BASE_URL for relative paths
      const fullUrl = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
      const res = await fetch(fullUrl, { ...options, headers });
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response. Is the backend running on port 5000?');
      }
      
      const json = await res.json();
      if (!res.ok) {
        // If token is invalid (401), logout user automatically
        if (res.status === 401 && json.message && json.message.includes('Token')) {
          console.warn('Invalid token detected, logging out...');
          logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(json.message || `Request failed: ${res.status}`);
      }
      return json;
    } catch (err) {
      console.error('apiFetch error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, token, login, signup, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};