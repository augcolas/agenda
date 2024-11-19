// ProtectedRoute.tsx
import type React from 'react';

import { Navigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  console.log(isAuthenticated);

  // Si l'utilisateur n'est pas authentifié, on redirige vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, on rend le composant enfant (la route protégée)
  return children as React.ReactElement;
};

export default ProtectedRoute;
