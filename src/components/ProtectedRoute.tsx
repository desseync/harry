import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/member'
}) => {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Authentication error:', error);
  }

  if (!user) {
    // Save the attempted URL for redirecting after login
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', location.pathname + location.search);
    
    return <Navigate 
      to={`${redirectTo}?${searchParams.toString()}`}
      replace 
      state={{ from: location }}
    />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;