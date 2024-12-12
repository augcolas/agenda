// ProtectedRoute.tsx
import type React from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
  readonly reverse?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  reverse = false,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated && !reverse) {
    return <Navigate to="/login" replace />;
  } else if (isAuthenticated && reverse) {
    return <Navigate to="/" replace />;
  }

  return children as React.ReactElement;
};

export default ProtectedRoute;
