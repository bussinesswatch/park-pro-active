import { useMemo, useState } from 'react';
import { Search, Wrench, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import maintenanceQueueData from '../data/maintenance_queue.json';
import maintenanceHistoryData from '../data/maintenance_history.json';

const statusToBadge = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('completed')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (s.includes('progress')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (s.includes('pending')) return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const priorityBadge = (p) => {
  const val = (p || '').toLowerCase();
  if (val === 'high') return 'bg-red-100 text-red-700 border-red-200';
  if (val === 'medium') return 'bg-amber-100 text-amber-800 border-amber-200';
  if (val === 'low') return 'bg-slate-100 text-slate-700 border-slate-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const MaintenanceTracker = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const queue = useMemo(() => {
    return Array.isArray(maintenanceQueueData?.maintenance_queue) ? maintenanceQueueData.maintenance_queue : [];
  }, []);

  const history = useMemo(() => {
    return Array.isArray(maintenanceHistoryData?.maintenance_logs) ? maintenanceHistoryData.maintenance_logs : [];
  }, []);

  const data = activeTab === 'queue' ? queue : history;

  const uniqueStatuses = useMemo(() => {
    const set = new Set(data.map((r) => r.status).filter(Boolean));
    return Array.from(set);
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((r) => {
      const matchesSearch =
        !q ||
        String(r.assetId || '').toLowerCase().includes(q) ||
        String(r.assetName || '').toLowerCase().includes(q) ||
        String(r.type || '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || String(r.status || '') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const summary = useMemo(() => {
    const total = queue.length + history.length;
    const pending = queue.filter((r) => String(r.status || '').toLowerCase().includes('pending')).length;
    const inProgress = queue.filter((r) => String(r.status || '').toLowerCase().includes('progress')).length;
    const completed = history.filter((r) => String(r.status || '').toLowerCase().includes('completed')).length;
    return { total, pending, inProgress, completed };
  }, [queue, history]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Tracker</h1>
          <p className="text-gray-500 mt-1">Queue and history from local JSON files</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-slate-500" />
            <p className="text-sm text-gray-500">Total</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-1">{summary.pending}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-500">In Progress</p>
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">{summary.inProgress}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{summary.completed}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/30">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'queue'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Maintenance Queue ({queue.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Maintenance History ({history.length})
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Asset ID, Name, or Type..."
              className="input-field pl-10"
            />
          </div>

          <select
            className="input-field md:w-56"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No {activeTab} records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/30">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Asset ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Asset Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  {activeTab === 'queue' && (
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Priority</th>
                  )}
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Technician</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Downtime (days)</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filtered.map((r, idx) => (
                  <tr key={`${r.assetId}-${idx}`} className="hover:bg-white/20">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.assetId}</td>
                    <td className="px-4 py-3 text-gray-800">{r.assetName}</td>
                    <td className="px-4 py-3 text-gray-700">{r.type}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusToBadge(r.status)}`}>
                        {r.status || 'Unknown'}
                      </span>
                    </td>
                    {activeTab === 'queue' && (
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityBadge(r.priority)}`}>
                          {r.priority || '-'}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3 text-gray-700">{r.technician || '-'}</td>
                    <td className="px-4 py-3 text-right text-gray-800">{r.downtimeDays ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{r.date || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={r.remarks}>
                      {r.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceTracker;
