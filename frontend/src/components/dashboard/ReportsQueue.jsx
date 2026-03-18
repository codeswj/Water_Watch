'use client';

import { useState } from 'react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate, truncate } from '@/utils/helpers';
import { reportsAPI } from '@/lib/api';

export default function ReportsQueue({ reports = [], onStatusChange }) {
  const [updating, setUpdating] = useState(null);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await reportsAPI.updateStatus(id, status);
      onStatusChange && onStatusChange();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  if (reports.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">No reports found.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reports.map((report) => (
        <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge value={report.status} />
                {report.source_name && (
                  <span className="text-xs text-gray-500 font-medium">📍 {report.source_name}</span>
                )}
              </div>
              <p className="text-sm text-gray-700">{truncate(report.description, 120)}</p>
              <p className="text-xs text-gray-400 mt-1">
                By <span className="font-medium">{report.submitted_by_name || 'Unknown'}</span>
                {' · '}{formatDate(report.created_at)}
              </p>
            </div>
          </div>

          {report.status === 'pending' && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleStatus(report.id, 'verified')}
                disabled={updating === report.id}
                className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 transition"
              >
                ✓ Verify
              </button>
              <button
                onClick={() => handleStatus(report.id, 'dismissed')}
                disabled={updating === report.id}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 transition"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
