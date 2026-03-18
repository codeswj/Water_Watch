'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import StatusBadge from '@/components/shared/StatusBadge';
import { waterSourcesAPI } from '@/lib/api';
import { capitalise, formatDate } from '@/utils/helpers';
import { SOURCE_STATUSES } from '@/utils/constants';

// Leaflet must be loaded client-side only
const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

export default function MapPage() {
  const [sources, setSources]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [selected, setSelected]       = useState(null);

  useEffect(() => {
    const params = filter !== 'all' ? { status: filter } : {};
    setLoading(true);
    waterSourcesAPI.getAll(params)
      .then((res) => setSources(res.data.sources || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 mb-3">Water Sources</h2>
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {['all', ...SOURCE_STATUSES].map((s) => (
                <button key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    filter === s ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {capitalise(s)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
            ) : sources.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No sources found.</p>
            ) : sources.map((s) => (
              <button key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left px-4 py-3 hover:bg-sky-50 transition ${selected?.id === s.id ? 'bg-sky-50' : ''}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm text-gray-800 truncate">{s.name}</span>
                  <StatusBadge value={s.status} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{capitalise(s.type)}</p>
              </button>
            ))}
          </div>

          {/* Source detail panel */}
          {selected && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800 text-sm">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Type: <span className="text-gray-700 font-medium">{capitalise(selected.type)}</span></p>
                <p>Status: <StatusBadge value={selected.status} /></p>
                <p>Lat: <span className="font-mono">{selected.latitude}</span></p>
                <p>Lng: <span className="font-mono">{selected.longitude}</span></p>
                <p>Added: {formatDate(selected.created_at)}</p>
              </div>
            </div>
          )}
        </aside>

        {/* Map */}
        <div className="flex-1 h-[60vh] lg:h-auto">
          {!loading && (
            <MapView sources={sources} onSourceClick={setSelected} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
