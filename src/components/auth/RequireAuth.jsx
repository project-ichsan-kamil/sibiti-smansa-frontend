import React from 'react';
import { Navigate } from 'react-router-dom';

//TODO check expired token
const RequireAuth = ({ children }) => { 
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Jika tidak ada token, redirect ke halaman login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
