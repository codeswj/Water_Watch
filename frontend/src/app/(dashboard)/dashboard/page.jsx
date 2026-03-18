'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import StatsCard from '@/components/dashboard/StatsCard';
import AlertsPanel from '@/components/dashboard/AlertsPanel';
import ReportsQueue from '@/components/dashboard/ReportsQueue';
import SensorReadingsTable from '@/components/dashboard/SensorReadingsTable';
import { waterSourcesAPI, sensorReadingsAPI, reportsAPI, alertsAPI, notificationsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats]         = useState({ sources: 0, safe: 0, unsafe: 0, unknown: 0 });
  const [alerts, setAlerts]       = useState([]);
  const [reports, setReports]     = useState([]);
  const [readings, setReadings]   = useState([]);
  const [notices, setNotices]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('alerts');

  useEffect(() => {
    if (!authLoading && (!user || user.role === 'public')) {
      router.push('/map');
    }
  }, [user, authLoading]);

  const load = async () => {
    setLoading(true);
    try {
      const [sourcesRes, alertsRes, reportsRes, readingsRes, noticesRes] = await Promise.all([
        waterSourcesAPI.getAll(),
        alertsAPI.getAll(),
        reportsAPI.getAll({ status: 'pending' }),
        sensorReadingsAPI.getAll({ limit: 20 }),
        notificationsAPI.getUnread(),
      ]);

      const sources = sourcesRes.data.sources || [];
      setStats({
        sources: sources.length,
        safe:    sources.filter((s) => s.status === 'safe').length,
        unsafe:  sources.filter((s) => s.status === 'unsafe').length,
        unknown: sources.filter((s) => s.status === 'unknown').length,
      });
      setAlerts(alertsRes.data.alerts || []);
      setReports(reportsRes.data.reports || []);
      setReadings(readingsRes.data.readings || []);
      setNotices(noticesRes.data.notifications || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'public') load();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading dashboard...
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

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.name}</p>
            </div>
            {notices.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm font-medium">
                🔔 {notices.length} unread notification{notices.length > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Total Sources"  value={stats.sources} icon="💧" color="sky"    />
            <StatsCard title="Safe Sources"   value={stats.safe}    icon="✅" color="green"  />
            <StatsCard title="Unsafe Sources" value={stats.unsafe}  icon="⚠️" color="red"    />
            <StatsCard title="Unknown"        value={stats.unknown} icon="❓" color="yellow" />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
            {[
              { key: 'alerts',   label: `🚨 Alerts (${alerts.length})` },
              { key: 'reports',  label: `📝 Pending Reports (${reports.length})` },
              { key: 'readings', label: '📡 Sensor Readings' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? 'bg-white text-sky-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            {activeTab === 'alerts' && (
              <>
                <h2 className="font-bold text-gray-700 mb-4">Active Alerts</h2>
                <AlertsPanel alerts={alerts} />
              </>
            )}
            {activeTab === 'reports' && (
              <>
                <h2 className="font-bold text-gray-700 mb-4">Pending Community Reports</h2>
                <ReportsQueue reports={reports} onStatusChange={load} />
              </>
            )}
            {activeTab === 'readings' && (
              <>
                <h2 className="font-bold text-gray-700 mb-4">Latest Sensor Readings</h2>
                <p className="text-xs text-gray-400 mb-3">
                  <span className="text-green-600 font-semibold">Green</span> = within safe range &nbsp;|&nbsp;
                  <span className="text-red-600 font-semibold">Red</span> = exceeds threshold
                </p>
                <SensorReadingsTable readings={readings} />
              </>
            )}
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
}
