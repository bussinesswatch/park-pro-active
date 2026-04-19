import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const preConfiguredUsers = useMemo(
    () => [
      { name: 'Admin 1', email: 'admin1@parkpro.com', password: 'ParkPro2024!', role: 'admin' },
      { name: 'User 1', email: 'user1@parkpro.com', password: 'ParkPro2024!', role: 'user' }
    ],
    []
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      return { success: false, error: e?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = () => {
    const email = user?.email || '';
    return email.toLowerCase().startsWith('admin');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    preConfiguredUsers
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
