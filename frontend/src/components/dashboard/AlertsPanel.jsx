import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate, capitalise } from '@/utils/helpers';

export default function AlertsPanel({ alerts = [] }) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        ✅ No alerts at this time.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-lg border-l-4 p-4 bg-white shadow-sm ${
            alert.severity === 'high'   ? 'border-red-500' :
            alert.severity === 'medium' ? 'border-orange-400' :
            'border-blue-400'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {alert.source_name || `Source #${alert.water_source_id}`}
              </p>
              <p className="text-gray-600 text-sm mt-0.5">
                <span className="font-medium">{capitalise(alert.parameter)}</span>
                {' '}= {alert.actual_value}
                <span className="text-gray-400"> (threshold: {alert.threshold_value})</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(alert.triggered_at)}</p>
            </div>
            <StatusBadge value={alert.severity} />
          </div>
        </div>
      ))}
    </div>
  );
}
