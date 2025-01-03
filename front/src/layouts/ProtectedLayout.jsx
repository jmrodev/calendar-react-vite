import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedLayout = () => {
  const { user, isLoading } = useSelector(state => state.auth);

  if (isLoading) {
    return <div className="page-container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout; 