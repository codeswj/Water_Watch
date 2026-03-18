import { formatDate } from '@/utils/helpers';

const SAFE = { ph: [6.5, 8.5], turbidity: [0, 4], temperature: [0, 30], dissolved_oxygen: [5, 20], conductivity: [0, 2500], contaminant_level: [0, 0.5] };

const isSafe = (param, val) => {
  if (val === null || val === undefined) return true;
  const [min, max] = SAFE[param] || [null, null];
  if (min !== null && val < min) return false;
  if (max !== null && val > max) return false;
  return true;
};

const Cell = ({ param, val }) => {
  const safe = isSafe(param, val);
  return (
    <td className={`px-3 py-2 text-center text-sm font-mono ${val !== null && val !== undefined ? (safe ? 'text-green-700' : 'text-red-600 font-semibold') : 'text-gray-400'}`}>
      {val !== null && val !== undefined ? val : '—'}
    </td>
  );
};

export default function SensorReadingsTable({ readings = [] }) {
  if (readings.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">No sensor readings available.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-3 py-3 text-left">Recorded At</th>
            <th className="px-3 py-3 text-center">pH</th>
            <th className="px-3 py-3 text-center">Turbidity</th>
            <th className="px-3 py-3 text-center">Temp (°C)</th>
            <th className="px-3 py-3 text-center">DO (mg/L)</th>
            <th className="px-3 py-3 text-center">Conductivity</th>
            <th className="px-3 py-3 text-center">Contaminant</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {readings.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{formatDate(r.recorded_at)}</td>
              <Cell param="ph"                val={r.ph} />
              <Cell param="turbidity"         val={r.turbidity} />
              <Cell param="temperature"       val={r.temperature} />
              <Cell param="dissolved_oxygen"  val={r.dissolved_oxygen} />
              <Cell param="conductivity"      val={r.conductivity} />
              <Cell param="contaminant_level" val={r.contaminant_level} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
