'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import AlertsPanel from '@/components/dashboard/AlertsPanel';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { alertsAPI } from '@/lib/api';

export default function AlertsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'admin' && user.role !== 'field_officer'))) {
      router.push('/map');
    }
  }, [authLoading, user, router]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const response = await alertsAPI.getAll();
      setAlerts(response.data.alerts || []);
    } catch (err) {
      console.error('Alerts load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'public') {
      loadAlerts();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading alerts…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sensor Alerts</h1>
              <p className="text-sm text-gray-500">Auto-generated alerts from sensors that breached thresholds.</p>
            </div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Alert stream</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <AlertsPanel alerts={alerts} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
