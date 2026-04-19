import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const PRE_CONFIGURED_USERS = [
  { email: 'admin1@parkpro.com', password: 'ParkPro2024!', name: 'Admin One', role: 'admin' },
  { email: 'admin2@parkpro.com', password: 'ParkPro2024!', name: 'Admin Two', role: 'admin' },
  { email: 'user1@parkpro.com', password: 'ParkPro2024!', name: 'User One', role: 'user' },
  { email: 'user2@parkpro.com', password: 'ParkPro2024!', name: 'User Two', role: 'user' },
  { email: 'manager1@parkpro.com', password: 'ParkPro2024!', name: 'Manager One', role: 'admin' },
  { email: 'manager2@parkpro.com', password: 'ParkPro2024!', name: 'Manager Two', role: 'admin' },
  { email: 'tech1@parkpro.com', password: 'ParkPro2024!', name: 'Technician One', role: 'user' },
  { email: 'tech2@parkpro.com', password: 'ParkPro2024!', name: 'Technician Two', role: 'user' },
  { email: 'ops1@parkpro.com', password: 'ParkPro2024!', name: 'Operations One', role: 'user' },
  { email: 'ops2@parkpro.com', password: 'ParkPro2024!', name: 'Operations Two', role: 'user' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStoredUser();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await AsyncStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking stored user:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    preConfiguredUsers: PRE_CONFIGURED_USERS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
