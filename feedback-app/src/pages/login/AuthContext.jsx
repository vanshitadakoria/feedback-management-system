import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { getCurrentUser, setToken, clearToken } from '../../services/authentication';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getCurrentUser();
    if (token) {
      const decodedToken = jwtDecode(token);
      setAuthState({
        isAuthenticated: true,
        role: decodedToken.role,
      });
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    setToken(token);
    const decodedToken = jwtDecode(token);
    setAuthState({
      isAuthenticated: true,
      role: decodedToken.role,
    });
  };

  const logout = () => {
    clearToken();
    setAuthState({
      isAuthenticated: false,
      role: null,
    });
    sessionStorage.clear();
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ authState, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
