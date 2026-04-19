import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBWbDpeguiaEyPSD8QvGWhzgwYFvBlt0uc",
  authDomain: "park-pro-active.firebaseapp.com",
  projectId: "park-pro-active",
  storageBucket: "park-pro-active.firebasestorage.app",
  messagingSenderId: "675759820649",
  appId: "1:675759820649:web:e9ce73aeceb46c095ff7f8",
  measurementId: "G-WZYD4VEXB9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);

export default app;
