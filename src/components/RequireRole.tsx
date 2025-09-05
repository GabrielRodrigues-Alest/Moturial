import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireRoleProps {
  role?: string;
  children: React.ReactNode;
}

const RequireRole: React.FC<RequireRoleProps> = ({ role = 'admin', children }) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;
  if (role && !hasRole(role)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default RequireRole;


