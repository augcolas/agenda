import type React from 'react';

import { jwtDecode } from 'jwt-decode';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { Role, type UserInterface } from '../interfaces/user.interface';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string;
  user: UserInterface | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ readonly children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [token, setToken] = useState<string>('');

  const decodeAndSetUser = (storedToken: string) => {
    const decodedToken: { email: string; exp: number; iat: number; role: string; sub: number } = jwtDecode(storedToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      logout();
      throw new Error("Token expired.");
    }

    const usr: UserInterface = {
      id: decodedToken.sub,
      email: decodedToken.email,
      role: decodedToken.role === 'ADMIN' ? Role.ADMIN : Role.USER,
    };

    setUser(usr);
    setIsAuthenticated(true);
  };

  const login = (storedToken: string) => {
    try {
      // Decode the token and set user
      decodeAndSetUser(storedToken);

      // Store the token in localStorage
      localStorage.setItem('authToken', storedToken);
      setToken(storedToken);
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
      token,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, user]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        decodeAndSetUser(storedToken);
        setToken(storedToken);
      } catch (error) {
        console.error("Invalid token in localStorage:", error);
        logout();
      }
    }
    setIsInitializing(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
