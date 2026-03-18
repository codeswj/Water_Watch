'use client';

import { useState, useEffect } from 'react';
import { usersAPI } from '@/lib/api';
import { formatDate, capitalise } from '@/utils/helpers';
import StatusBadge from '@/components/shared/StatusBadge';

export default function UserManagement() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState({ name: '', email: '', role: 'public' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await usersAPI.getAll();
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (user) => {
    setEditing(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const saveEdit = async () => {
    try {
      await usersAPI.update(editing, form);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed.');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await usersAPI.delete(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  if (loading) return <p className="text-sm text-gray-400 py-6 text-center">Loading users...</p>;

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {editing === user.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input className="border rounded px-2 py-1 text-sm w-full" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </td>
                    <td className="px-4 py-2">
                      <input className="border rounded px-2 py-1 text-sm w-full" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </td>
                    <td className="px-4 py-2">
                      <select className="border rounded px-2 py-1 text-sm" value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}>
                        <option value="public">Public</option>
                        <option value="field_officer">Field Officer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-gray-400">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={saveEdit} className="text-xs bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600">Save</button>
                      <button onClick={() => setEditing(null)} className="text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3"><span className="badge bg-sky-50 text-sky-700">{capitalise(user.role)}</span></td>
                    <td className="px-4 py-3 text-gray-400">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => startEdit(user)} className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Edit</button>
                      <button onClick={() => deleteUser(user.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
