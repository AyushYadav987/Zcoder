import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true 
});

api.auth = {
  register: (data) => api.post('/users/signup', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  verify: () => api.get('/users/verify')
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return handleLogout();
    }

    try {
      // Set token in headers for verification request
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.auth.verify();
      
      if (response.data && response.data.status === 'success') {
        setIsAuthenticated(true);
        setUser(response.data.data.user);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Auth check failed:', error?.response?.data || error.message);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (token, userData) => {
    try {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      handleLogout();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout failed:', error?.response?.data || error.message);
    } finally {
      handleLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      logout,
      api
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 