import { useCollection } from '../hooks/useFirestore';
import { formatDate } from '../utils/helpers';
import { AlertTriangle, CheckCircle, Bell, X, AlertCircle, Wrench, Fuel, Box } from 'lucide-react';
import toast from 'react-hot-toast';

const Alerts = () => {
  const { data: alerts, loading, updateItem } = useCollection('alerts', {
    realTime: true,
    orderBy: { field: 'createdAt', direction: 'desc' }
  });

  const handleMarkRead = async (id) => {
    const result = await updateItem(id, { read: true });
    if (result.success) {
      toast.success('Alert marked as read');
    }
  };

  const handleMarkAllRead = async () => {
    const unreadAlerts = alerts?.filter(a => !a.read) || [];
    for (const alert of unreadAlerts) {
      await updateItem(alert.id, { read: true });
    }
    toast.success('All alerts marked as read');
  };

  const unreadCount = alerts?.filter(a => !a.read).length || 0;
  const readAlerts = alerts?.filter(a => a.read) || [];
  const unreadAlerts = alerts?.filter(a => !a.read) || [];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'maintenance': return <Wrench className="w-5 h-5 text-blue-500" />;
      case 'fuel': return <Fuel className="w-5 h-5 text-red-500" />;
      case 'inventory': return <Box className="w-5 h-5 text-orange-500" />;
      default: return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'maintenance': return 'bg-blue-50 border-blue-200';
      case 'fuel': return 'bg-red-50 border-red-200';
      case 'inventory': return 'bg-orange-50 border-orange-200';
      default: return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-500 mt-1">System notifications and warnings</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn-secondary">
            Mark All Read
          </button>
        )}
      </div>

      {/* Unread Alerts */}
      <div className="space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Unread Alerts ({unreadCount})
        </h2>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : unreadAlerts.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p>No unread alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unreadAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`card border-l-4 ${getAlertColor(alert.type)} flex items-start gap-4`}
              >
                <div className="p-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/40">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                  <p className="text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(alert.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleMarkRead(alert.id)}
                  className="p-2 hover:bg-white/40 rounded-lg text-gray-400 hover:text-gray-600"
                  title="Mark as read"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert History */}
      <div className="space-y-4">
        <h2 className="font-semibold text-gray-900">Alert History</h2>

        {readAlerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No alert history</p>
        ) : (
          <div className="card divide-y">
            {readAlerts.map((alert) => (
              <div key={alert.id} className="py-3 flex items-start gap-3 opacity-60">
                <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <p className="text-xs text-gray-500">{formatDate(alert.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
