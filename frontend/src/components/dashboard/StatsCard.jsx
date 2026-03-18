export default function StatsCard({ title, value, icon, color = 'sky' }) {
  const colorMap = {
    sky:    'bg-sky-50 text-sky-600 border-sky-100',
    green:  'bg-green-50 text-green-600 border-green-100',
    red:    'bg-red-50 text-red-600 border-red-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    gray:   'bg-gray-50 text-gray-600 border-gray-100',
  };

  return (
    <div className={`rounded-xl border p-5 flex items-center gap-4 ${colorMap[color] || colorMap.sky}`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm font-medium opacity-70">{title}</p>
        <p className="text-2xl font-bold mt-0.5">{value ?? '—'}</p>
      </div>
    </div>
  );
}
