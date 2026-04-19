import { useState, useEffect, useCallback } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { auth, db } from '../config/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export const useNotifications = () => {
  const [permission, setPermission] = useState('default');
  const [fcmToken, setFcmToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('[Notifications] This browser does not support notifications');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  // Initialize FCM
  useEffect(() => {
    if (!('Notification' in window)) return;
    
    const initFCM = async () => {
      try {
        const messaging = getMessaging();
        
        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
        });
        
        if (token) {
          console.log('[Notifications] FCM Token:', token);
          setFcmToken(token);
          
          // Save token to user profile
          if (auth.currentUser) {
            await setDoc(
              doc(db, 'users', auth.currentUser.uid, 'tokens', 'fcm'),
              {
                token,
                updatedAt: new Date().toISOString(),
                platform: 'web'
              },
              { merge: true }
            );
          }
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log('[Notifications] Message received:', payload);
          
          const notification = {
            id: Date.now().toString(),
            title: payload.notification?.title || 'Park Pro-Active',
            body: payload.notification?.body || '',
            data: payload.data || {},
            timestamp: new Date(),
            read: false
          };
          
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((count) => count + 1);

          // Show browser notification if app is in foreground
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.body,
              icon: '/logo-192.png',
              badge: '/logo-72.png',
              tag: notification.id
            });
          }
        });
      } catch (error) {
        console.error('[Notifications] FCM initialization error:', error);
      }
    };

    if (permission === 'granted') {
      initFCM();
    }
  }, [permission]);

  // Check initial permission
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotification = useCallback((notificationId) => {
    setNotifications((prev) => {
      const removed = prev.find((n) => n.id === notificationId);
      if (removed && !removed.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return prev.filter((n) => n.id !== notificationId);
    });
  }, []);

  return {
    permission,
    requestPermission,
    fcmToken,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    isSupported: 'Notification' in window
  };
};

// Send local notification (for in-app alerts)
export const sendLocalNotification = (title, options = {}) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  const notification = new Notification(title, {
    icon: '/logo-192.png',
    badge: '/logo-72.png',
    ...options
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
    if (options.onClick) {
      options.onClick();
    }
  };

  return notification;
};

// Schedule notification
export const scheduleNotification = (title, options = {}, delayMs = 0) => {
  setTimeout(() => {
    sendLocalNotification(title, options);
  }, delayMs);
};

export default useNotifications;
