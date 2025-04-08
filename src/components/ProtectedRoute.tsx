
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requiredRole = [] 
}) => {
  const location = useLocation();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role requirement exists and user doesn't have that role
  if (requiredRole.length > 0 && !requiredRole.includes(user.role) && !user.isSuperUser) {
    // Superusers bypass role restrictions
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
