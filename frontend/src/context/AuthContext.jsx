import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('authUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for global 401 events to clear auth state
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    
    // Check if current token is still valid on initial load
    const verifySession = async () => {
      if (token) {
        try {
          const profile = await apiFetch('/auth/me');
          setUser(profile);
          localStorage.setItem('authUser', JSON.stringify(profile));
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();

    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, [token]);

  const login = async (email, password) => {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('authUser', JSON.stringify(response.user));
    return response.user;
  };

  const register = async (userData) => {
    return await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isSeller: user?.role === 'SELLER',
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
