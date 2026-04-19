import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, X, Check, Trash2, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  
  const {
    permission,
    requestPermission,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    isSupported
  } = useNotifications();

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      console.log('[Notifications] Permission granted');
    }
  };

  if (!isSupported) return null;

  return (
    <div className="relative z-[100]" ref={panelRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/40 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 z-[100]" style={{ isolation: 'isolate' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/30">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 hover:bg-white/40 rounded text-gray-500"
                  title="Mark all as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/40 rounded text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Permission Banner */}
          {permission === 'default' && (
            <div className="p-3 bg-blue-50 border-b border-blue-100">
              <p className="text-sm text-blue-800 mb-2">
                Enable notifications to receive real-time alerts
              </p>
              <button
                onClick={handleEnableNotifications}
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
              >
                Enable Notifications
              </button>
            </div>
          )}

          {permission === 'denied' && (
            <div className="p-3 bg-yellow-50 border-b border-yellow-100">
              <p className="text-sm text-yellow-800">
                Notification permission denied. Please enable in browser settings.
              </p>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-white/30 hover:bg-white/20 transition-colors ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {notification.title}
                      </p>
                      <p className="text-gray-600 text-sm mt-0.5">
                        {notification.body}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 hover:bg-white/40 rounded text-gray-400"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => clearNotification(notification.id)}
                        className="p-1 hover:bg-red-500/15 rounded text-gray-400 hover:text-red-500"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => console.log('View all notifications')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
