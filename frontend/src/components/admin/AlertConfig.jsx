'use client';

import { useState, useEffect } from 'react';
import { alertsAPI } from '@/lib/api';
import { formatDate, capitalise } from '@/utils/helpers';
import StatusBadge from '@/components/shared/StatusBadge';

export default function AlertConfig() {
  const [alerts, setAlerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { severity: filter } : {};
      const res = await alertsAPI.getAll(params);
      setAlerts(res.data.alerts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this alert?')) return;
    try {
      await alertsAPI.delete(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div>
      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'high', 'medium', 'low'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === s ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {capitalise(s)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-6 text-center">Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">No alerts found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Parameter</th>
                <th className="px-4 py-3 text-center">Threshold</th>
                <th className="px-4 py-3 text-center">Actual</th>
                <th className="px-4 py-3 text-left">Severity</th>
                <th className="px-4 py-3 text-left">Triggered</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {alerts.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{a.source_name || `#${a.water_source_id}`}</td>
                  <td className="px-4 py-3 text-gray-600">{capitalise(a.parameter)}</td>
                  <td className="px-4 py-3 text-center font-mono text-gray-500">{a.threshold_value}</td>
                  <td className={`px-4 py-3 text-center font-mono font-semibold ${
                    a.severity === 'high' ? 'text-red-600' : a.severity === 'medium' ? 'text-orange-500' : 'text-blue-500'
                  }`}>{a.actual_value}</td>
                  <td className="px-4 py-3"><StatusBadge value={a.severity} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(a.triggered_at)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(a.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100">
                      Dismiss
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
