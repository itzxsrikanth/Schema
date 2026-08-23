import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kisan_user');
    return saved ? JSON.parse(saved) : {
      farmerId: 'farmer_demo_123',
      name: 'Ramesh Patel',
      email: 'ramesh.patel@agrimail.in',
      phone: '+91 9876543210',
      location: 'Nashik, Maharashtra',
      state: 'Maharashtra',
      district: 'Nashik',
      soilType: 'black',
      farmSize: 4.5,
      income: 220000,
      ownershipType: 'Owner Cultivator',
      farmerCategory: 'Small Farmer (2.5 - 5.0 Acres)',
      aadhaarLinked: true,
      kccHolder: true,
      irrigationSource: 'Drip / Borewell',
      crops: ['Wheat', 'Sugarcane', 'Tomato']
    };
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        const farmerData = {
          ...res.data.data.farmer,
          income: res.data.data.farmer.income || 220000,
          state: res.data.data.farmer.state || res.data.data.farmer.location?.split(',')[1]?.trim() || 'Maharashtra',
          aadhaarLinked: res.data.data.farmer.aadhaarLinked ?? true,
          kccHolder: res.data.data.farmer.kccHolder ?? true,
          ownershipType: res.data.data.farmer.ownershipType || 'Owner Cultivator'
        };
        setUser(farmerData);
        localStorage.setItem('kisan_user', JSON.stringify(farmerData));
        localStorage.setItem('kisan_token', res.data.data.token);
      }
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const res = await authAPI.signup(userData);
      if (res.data.success) {
        const farmerData = {
          ...res.data.data.farmer,
          income: res.data.data.farmer.income || 220000,
          state: res.data.data.farmer.state || res.data.data.farmer.location?.split(',')[1]?.trim() || 'Maharashtra',
          aadhaarLinked: true,
          kccHolder: true,
          ownershipType: 'Owner Cultivator'
        };
        setUser(farmerData);
        localStorage.setItem('kisan_user', JSON.stringify(farmerData));
        localStorage.setItem('kisan_token', res.data.data.token);
      }
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const updateUserProfile = async (updatedData) => {
    setLoading(true);
    try {
      const merged = { ...user, ...updatedData };
      setUser(merged);
      localStorage.setItem('kisan_user', JSON.stringify(merged));
      try {
        await authAPI.updateProfile(updatedData);
      } catch (err) {
        console.warn('Backend profile sync note:', err.message);
      }
      setLoading(false);
      return merged;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kisan_user');
    localStorage.removeItem('kisan_token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUserProfile, isAuthenticated: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
