// src/components/auth/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Jika tidak ada token, arahkan ke halaman login
    return <Navigate to="/admin/login" />;
  }

  // Jika ada token, tampilkan konten halaman (misal: dashboard)
  return <Outlet />;
};

export default ProtectedRoute;