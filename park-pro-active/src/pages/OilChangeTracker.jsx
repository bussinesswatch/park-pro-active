import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import oilChangeData from '../../../public/oil_change_tracker.json';

const statusToBadge = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('due')) return 'bg-red-100 text-red-700 border-red-200';
  if (s.includes('need')) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (s.includes('ok')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const numOrDash = (v) => (v === null || v === undefined || Number.isNaN(v) ? '-' : v);

const OilChangeTracker = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const records = useMemo(() => {
    return Array.isArray(oilChangeData?.oil_change_records) ? oilChangeData.oil_change_records : [];
  }, []);

  const uniqueStatuses = useMemo(() => {
    const set = new Set(records.map((r) => r.status).filter(Boolean));
    return Array.from(set);
  }, [records]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return records.filter((r) => {
      const matchesSearch =
        !q ||
        String(r.vesselId || '').toLowerCase().includes(q) ||
        String(r.vesselName || '').toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || String(r.status || '') === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const summary = useMemo(() => {
    const total = records.length;
    const due = records.filter((r) => String(r.status || '').toLowerCase().includes('due')).length;
    const need = records.filter((r) => String(r.status || '').toLowerCase().includes('need')).length;
    const ok = records.filter((r) => String(r.status || '').toLowerCase().includes('ok')).length;
    return { total, due, need, ok };
  }, [records]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Oil Change Tracker</h1>
          <p className="text-gray-500 mt-1">Imported from local file: public/oil_change_tracker.json</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Oil Change Due</p>
          <p className="text-2xl font-bold text-red-600">{summary.due}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Need Hours</p>
          <p className="text-2xl font-bold text-amber-700">{summary.need}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">OK</p>
          <p className="text-2xl font-bold text-emerald-600">{summary.ok}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Vessel ID or Name..."
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

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/30">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Vessel ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Vessel</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Current Hours</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Next Due</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Hours To Check</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Extra Hours</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Last Change Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filtered.map((r) => (
                  <tr key={`${r.vesselId}-${r.vesselName}`} className="hover:bg-white/20">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.vesselId}</td>
                    <td className="px-4 py-3 text-gray-800">{r.vesselName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusToBadge(r.status)}`}>
                        {r.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-800">{numOrDash(r.currentHours)}</td>
                    <td className="px-4 py-3 text-right text-gray-800">{numOrDash(r.nextDueHours)}</td>
                    <td className="px-4 py-3 text-right text-gray-800">{numOrDash(r.hoursToCheck)}</td>
                    <td className="px-4 py-3 text-right text-gray-800">{numOrDash(r.extraHoursRun)}</td>
                    <td className="px-4 py-3 text-gray-700">{r.lastOilChangeDate || '-'}</td>
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

export default OilChangeTracker;
