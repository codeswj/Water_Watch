'use client';

import { useState, useEffect } from 'react';
import { reportsAPI, waterSourcesAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { WATER_SOURCE_TYPES } from '@/utils/constants';

export default function ReportForm() {
  const { user }  = useAuth();
  const router    = useRouter();

  const [sources, setSources]   = useState([]);
  const [form, setForm]         = useState({ water_source_id: '', description: '', latitude: '', longitude: '' });
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    waterSourcesAPI.getAll()
      .then((res) => setSources(res.data.sources || []))
      .catch(console.error);
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported.');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) }));
        setLocating(false);
      },
      () => { alert('Could not get location.'); setLocating(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!user) return router.push('/login');
    setLoading(true);
    try {
      await reportsAPI.create({
        water_source_id: form.water_source_id || null,
        description:     form.description,
        latitude:        form.latitude || null,
        longitude:       form.longitude || null,
      });
      setSuccess('✅ Report submitted successfully! Thank you for helping keep water sources safe.');
      setForm({ water_source_id: '', description: '', latitude: '', longitude: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Report a Water Issue</h2>
        <p className="text-gray-500 text-sm mb-6">Help your community by reporting water quality problems.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Water Source (optional)</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={form.water_source_id}
              onChange={(e) => setForm({ ...form, water_source_id: e.target.value })}
            >
              <option value="">— Select a water source —</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              required rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
              placeholder="Describe the issue — unusual colour, smell, taste, oil film, reduced flow, etc."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Location (GPS)</label>
              <button
                type="button" onClick={getLocation} disabled={locating}
                className="text-xs text-sky-600 hover:underline disabled:opacity-50"
              >
                {locating ? 'Getting location...' : '📍 Use my location'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number" step="any" placeholder="Latitude"
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              />
              <input
                type="number" step="any" placeholder="Longitude"
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-sky-500 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-600 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
