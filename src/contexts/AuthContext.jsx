
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('financial_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation - in real app, this would be API call
    if (email && password) {
      const userData = {
        id: 1,
        email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=3b82f6&color=fff`
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('financial_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    }
    
    setLoading(false);
    return { success: false, error: 'Email dan password harus diisi' };
  };

  const register = async (name, email, password) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (name && email && password) {
      const userData = {
        id: 1,
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff`
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('financial_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    }
    
    setLoading(false);
    return { success: false, error: 'Semua field harus diisi' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('financial_user');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
