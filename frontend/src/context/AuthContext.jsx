'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { saveToken, saveUser, removeToken, getToken, getStoredUser } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On mount — restore session from localStorage
  useEffect(() => {
    const token = getToken();
    const stored = getStoredUser();
    if (token && stored) {
      setUser(stored);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { user, token } = res.data;
    saveToken(token);
    saveUser(user);
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { user, token } = res.data;
    saveToken(token);
    saveUser(user);
    setUser(user);
    return user;
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push('/login');
  };

  const isAdmin        = user?.role === 'admin';
  const isFieldOfficer = user?.role === 'field_officer';
  const isPublic       = user?.role === 'public';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isFieldOfficer, isPublic }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
