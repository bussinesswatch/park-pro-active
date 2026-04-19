import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // After login, create/update user document in Firestore if it doesn't exist
      const userInfo = PRE_CONFIGURED_USERS.find(u => u.email === email);
      if (userInfo) {
        try {
          await setDoc(doc(db, 'users', result.user.uid), {
            email: email,
            name: userInfo.name,
            role: userInfo.role,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (firestoreError) {
          console.warn('Could not create user doc (permissions):', firestoreError);
        }
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = error.message;
      
      // User-friendly error messages
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const isAdmin = () => userRole === 'admin';

  const value = {
    user,
    userRole,
    loading,
    login,
    logout,
    isAdmin,
    preConfiguredUsers: PRE_CONFIGURED_USERS
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
