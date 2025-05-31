import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('User authenticated:', parsedUser);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', credentials);

      const response = await authService.login(credentials);
      console.log('Login response:', response);

      if (response.success) {
        const { user: userData, token } = response;

        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        console.log('Login successful, user:', userData);
        return { success: true, user: userData };
      } else {
        console.error('Login failed:', response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Attempting registration with:', userData);

      const response = await authService.register(userData);
      console.log('Registration response:', response);

      if (response.success) {
        console.log('Registration successful');
        return { success: true, message: 'Registration successful! Please login.' };
      } else {
        console.error('Registration failed:', response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    console.log('User logged out');
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isUser = () => {
    return user && user.role === 'user';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    isAdmin,
    isUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
