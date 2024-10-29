// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Si l'utilisateur n'est pas authentifié, on redirige vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, on rend le composant enfant (la route protégée)
  return <>{children}</>;
};

export default ProtectedRoute;
