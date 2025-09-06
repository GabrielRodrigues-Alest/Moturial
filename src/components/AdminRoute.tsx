import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'STAFF';
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, requiredRole = 'STAFF' }) => {
  const { user, isAuthenticated } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const hasRequiredRole = () => {
    if (!user.role) return false;
    
    switch (requiredRole) {
      case 'ADMIN':
        return user.role === 'ADMIN';
      case 'STAFF':
        return user.role === 'ADMIN' || user.role === 'STAFF';
      default:
        return false;
    }
  };

  if (!hasRequiredRole()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
