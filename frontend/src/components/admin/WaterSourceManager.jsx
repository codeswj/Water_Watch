'use client';

import { useState, useEffect } from 'react';
import { waterSourcesAPI } from '@/lib/api';
import { formatDate, capitalise } from '@/utils/helpers';
import StatusBadge from '@/components/shared/StatusBadge';
import { WATER_SOURCE_TYPES, SOURCE_STATUSES } from '@/utils/constants';

const emptyForm = { name: '', type: 'borehole', latitude: '', longitude: '', status: 'unknown' };

export default function WaterSourceManager() {
  const [sources, setSources]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await waterSourcesAPI.getAll();
      setSources(res.data.sources);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit   = (s)  => { setEditing(s.id); setForm({ name: s.name, type: s.type, latitude: s.latitude, longitude: s.longitude, status: s.status }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      editing
        ? await waterSourcesAPI.update(editing, form)
        : await waterSourcesAPI.create(form);
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this water source? This also deletes all sensor readings and alerts for it.')) return;
    try {
      await waterSourcesAPI.delete(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  if (loading) return <p className="text-sm text-gray-400 py-6 text-center">Loading water sources...</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-600 transition">
          + Add Water Source
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Water Source' : 'Add Water Source'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required className="w-full border rounded-lg px-3 py-2 text-sm" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {WATER_SOURCE_TYPES.map((t) => <option key={t} value={t}>{capitalise(t)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {SOURCE_STATUSES.map((s) => <option key={s} value={s}>{capitalise(s)}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input required type="number" step="any" className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input required type="number" step="any" className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Coordinates</th>
              <th className="px-4 py-3 text-left">Added</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sources.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                <td className="px-4 py-3 text-gray-500">{capitalise(s.type)}</td>
                <td className="px-4 py-3"><StatusBadge value={s.status} /></td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.latitude}, {s.longitude}</td>
                <td className="px-4 py-3 text-gray-400">{formatDate(s.created_at)}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(s)} className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
