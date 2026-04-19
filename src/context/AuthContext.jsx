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

  // Admin user configuration
  const adminUser = useMemo(
    () => ({ name: 'Admin', email: 'absy@parkpro.com', role: 'admin' }),
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
    return user?.email?.toLowerCase() === 'absy@parkpro.com';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    adminUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
