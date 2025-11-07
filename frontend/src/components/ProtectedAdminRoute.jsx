import React from 'react';
import { useAdminAuth } from '../contexts/AdminAuth';
import { Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';

const ProtectedAdminRoute = ({ children }) => {
  const { isAdminLoggedIn } = useAdminAuth();

  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  return children;
};

export default ProtectedAdminRoute;