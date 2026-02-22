import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Authentication Context
 * Manages user authentication state across the app
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults - use relative URLs for unified deployment
  // In production, frontend and backend are served from the same domain
  const API_URL = process.env.NODE_ENV === 'production' ? '' : (process.env.REACT_APP_API_URL || 'http://localhost:3001');

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          const response = await axios.get(`${API_URL}/api/profile`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          setUser(response.data.data.user);
          setToken(storedToken);
        } catch (err) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Register new user
   */
  const register = async (name, email, password) => {
    try {
      setError(null);
      
      const response = await axios.post(`${API_URL}/api/register`, {
        name,
        email,
        password
      });

      const { user: newUser, token: newToken } = response.data.data;
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      
      // Update state
      setUser(newUser);
      setToken(newToken);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      setError(null);
      
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password
      });

      const { user: loggedInUser, token: newToken } = response.data.data;
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      
      // Update state
      setUser(loggedInUser);
      setToken(newToken);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setError(null);
  };

  /**
   * Get auth header for API requests
   */
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  // Context value
  const contextValue = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    getAuthHeader,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;