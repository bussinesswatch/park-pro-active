import { useCollection } from '../hooks/useFirestore';
import { ASSET_CATEGORIES, getStatusBadgeClass, formatDate } from '../utils/helpers';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  Zap,
  Wind,
  Droplets,
  Car,
  Ship,
  Snowflake,
  Cog,
  Gauge,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench
} from 'lucide-react';

const iconMap = { Zap, Wind, Droplets, Car, Ship, Snowflake, Cog, Gauge, Package };

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

const Dashboard = () => {
  const { data: assets } = useCollection('assets', { realTime: true });
  const { data: alerts } = useCollection('alerts', { realTime: true, where: { field: 'read', operator: '==', value: false } });
  const { data: maintenanceLogs } = useCollection('maintenance_logs', { realTime: true, orderBy: { field: 'date', direction: 'desc' } });
  const { data: fuelLogs } = useCollection('fuel_logs', { realTime: true });

  const stats = {
    total: assets?.length || 0,
    operational: assets?.filter(a => a.status === 'operational').length || 0,
    nonOperational: assets?.filter(a => a.status === 'non-operational').length || 0,
    underRepair: assets?.filter(a => a.status === 'under-repair').length || 0
  };

  const statusData = [
    { name: 'Operational', value: stats.operational, color: '#10b981' },
    { name: 'Non-Operational', value: stats.nonOperational, color: '#ef4444' },
    { name: 'Under Repair', value: stats.underRepair, color: '#f59e0b' }
  ];

  const categoryData = ASSET_CATEGORIES.map(cat => ({
    name: cat.name,
    count: assets?.filter(a => a.category === cat.id).length || 0
  }));

  const recentMaintenance = maintenanceLogs?.slice(0, 5) || [];

  const totalFuel = fuelLogs?.reduce((sum, log) => sum + (log.quantity || 0), 0) || 0;

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-800">Analytics Overview</h1>
        <div className="flex items-center gap-2 text-sm text-navy-600">
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards - Glassmorphism style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Assets - Glass with pink tint */}
        <div className="bg-gradient-to-br from-rose-500/30 to-orange-500/30 border border-white/50 shadow-xl rounded-3xl p-5" style={{backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-navy-700 text-sm font-medium">Total Assets</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-coral-400 flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-navy-800 mb-1">{stats.total}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-navy-500">All vessels in fleet</span>
          </div>
        </div>

        {/* Operational - Glass with green tint */}
        <div className="bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-white/50 shadow-xl rounded-3xl p-5" style={{backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-navy-700 text-sm font-medium">Operational</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-navy-800 mb-1">{stats.operational}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {stats.total > 0 ? Math.round((stats.operational / stats.total) * 100) : 0}%
            </span>
            <span className="text-navy-500">Active status</span>
          </div>
        </div>

        {/* Non-Operational - Glass with rose tint */}
        <div className="bg-gradient-to-br from-rose-500/30 to-pink-500/30 border border-white/50 shadow-xl rounded-3xl p-5" style={{backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-navy-700 text-sm font-medium">Non-Operational</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
              <XCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-navy-800 mb-1">{stats.nonOperational}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {stats.total > 0 ? Math.round((stats.nonOperational / stats.total) * 100) : 0}%
            </span>
            <span className="text-navy-500">Require attention</span>
          </div>
        </div>

        {/* Under Repair - Glass with amber tint */}
        <div className="bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-white/50 shadow-xl rounded-3xl p-5" style={{backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-navy-700 text-sm font-medium">Under Repair</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Wrench className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-navy-800 mb-1">{stats.underRepair}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {stats.total > 0 ? Math.round((stats.underRepair / stats.total) * 100) : 0}%
            </span>
            <span className="text-navy-500">In maintenance</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Chart - Glass */}
        <div className="border border-white/50 shadow-xl rounded-3xl p-5 lg:col-span-1" style={{backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>
          <h3 className="text-lg font-semibold text-navy-800 mb-4">Asset Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {/* Custom Legend */}
          <div className="flex justify-center gap-4 mt-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-navy-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Chart - Glass */}
        <div className="border border-white/50 shadow-xl rounded-3xl p-5 lg:col-span-2" style={{backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>
          <h3 className="text-lg font-semibold text-navy-800 mb-4">Assets by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.9)', 
                  backdropFilter: 'blur(10px)',
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                }}
              />
              <Bar 
                dataKey="count" 
                fill="url(#colorGradient)" 
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts & Recent Activity - Glass Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Card - Glass */}
        <div className="border border-white/50 shadow-xl rounded-3xl p-5" style={{backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-navy-800">Active Alerts</h3>
            </div>
            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
              {alerts?.length || 0}
            </span>
          </div>
          {alerts?.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-navy-500">No active alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts?.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-navy-800 text-sm">{alert.title}</p>
                    <p className="text-xs text-navy-500 mt-0.5">{alert.message}</p>
                    <p className="text-xs text-navy-400 mt-1">{formatDate(alert.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Card - Glass */}
        <div className="border border-white/50 shadow-xl rounded-3xl p-5" style={{backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-navy-800">Recent Maintenance</h3>
            </div>
          </div>
          {recentMaintenance.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-6 h-6 text-navy-400" />
              </div>
              <p className="text-navy-500">No maintenance records</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMaintenance.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-4 h-4 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-navy-800 text-sm">{log.assetName || 'Asset'}</p>
                    <p className="text-xs text-navy-500 mt-0.5">{log.type}</p>
                    <p className="text-xs text-navy-400 mt-1">{formatDate(log.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
