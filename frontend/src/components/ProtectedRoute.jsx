import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getRoleFromToken } from '../utils/auth';

const ProtectedRoute = ({ role, children }) => {
  const token = getToken();
  const userRole = getRoleFromToken();

  console.log('Token:', token); // Log token
  console.log('User Role:', userRole); // Log user role
  console.log('Required Role:', role); // Log required role

  if (!token) {
    console.warn('Access denied: No token found.');
    return <Navigate to="/" />;
  }

  if (role && userRole !== role) {
    console.warn(`Access denied: Role mismatch. Required: ${role}, Found: ${userRole}`);
    return <Navigate to="/" />;
  }

  console.log('Access granted to:', role);
  return children;
};

export default ProtectedRoute;
