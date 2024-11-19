import type React from 'react';

import { jwtDecode } from 'jwt-decode';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { Role, type UserInterface } from '../interfaces/user.interface';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: UserInterface | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ readonly children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const decodeAndSetUser = (token: string) => {
    const decodedToken: { email: string; exp: number; iat: number; role: string; sub: number } = jwtDecode(token);

    const usr: UserInterface = {
      id: decodedToken.sub,
      email: decodedToken.email,
      role: decodedToken.role === 'ADMIN' ? Role.ADMIN : Role.USER,
    };

    setUser(usr);
    setIsAuthenticated(true);
  };

  const login = (token: string) => {
    try {
      // Decode the token and set user
      decodeAndSetUser(token);

      // Store the token in localStorage
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error("Error decoding the token:", error);
      throw new Error("Invalid token format.");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    // Clear the token from localStorage
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, user]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        decodeAndSetUser(storedToken);
      } catch (error) {
        console.error("Invalid token in localStorage:", error);
        logout();
      }
    }
    setIsInitializing(false);
  }, []);

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
