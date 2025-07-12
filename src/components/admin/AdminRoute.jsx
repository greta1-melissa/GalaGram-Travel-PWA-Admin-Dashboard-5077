import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';

const AdminRoute = ({ children }) => {
  const { adminUser, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return adminUser ? children : <Navigate to="/admin/login" />;
};

export default AdminRoute;