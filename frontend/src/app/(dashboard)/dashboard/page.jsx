'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import StatsCard from '@/components/dashboard/StatsCard';
import AlertsPanel from '@/components/dashboard/AlertsPanel';
import ReportsQueue from '@/components/dashboard/ReportsQueue';
import SensorReadingsTable from '@/components/dashboard/SensorReadingsTable';
import { waterSourcesAPI, sensorReadingsAPI, reportsAPI, alertsAPI, notificationsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTab = searchParams.get('tab');

  const [stats, setStats]         = useState({ sources: 0, safe: 0, unsafe: 0, unknown: 0, pendingReports: 0, activeAlerts: 0 });
  const [alerts, setAlerts]       = useState([]);
  const [allReports, setAllReports]       = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [readings, setReadings]   = useState([]);
  const [notices, setNotices]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('alerts');
  const [reportFilter, setReportFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && (!user || user.role === 'public')) {
      router.push('/map');
    }
  }, [user, authLoading]);

  const load = async () => {
    setLoading(true);
    try {
      const [sourcesRes, alertsRes, allReportsRes, readingsRes, noticesRes] = await Promise.all([
        waterSourcesAPI.getAll(),
        alertsAPI.getAll(),
        reportsAPI.getAll(),          // load ALL reports
        sensorReadingsAPI.getAll({ limit: 20 }),
        notificationsAPI.getUnread(),
      ]);

      const sources    = sourcesRes.data.sources   || [];
      const alertsList = alertsRes.data.alerts     || [];
      const reportsList= allReportsRes.data.reports|| [];

      setStats({
        sources:        sources.length,
        safe:           sources.filter((s) => s.status === 'safe').length,
        unsafe:         sources.filter((s) => s.status === 'unsafe').length,
        unknown:        sources.filter((s) => s.status === 'unknown').length,
        pendingReports: reportsList.filter((r) => r.status === 'pending').length,
        activeAlerts:   alertsList.length,
      });

      setAlerts(alertsList);
      setAllReports(reportsList);
      setPendingReports(reportsList.filter((r) => r.status === 'pending'));
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

  // filtered reports based on selected filter tab
  const filteredReports = reportFilter === 'all'
    ? allReports
    : allReports.filter((r) => r.status === reportFilter);

  const isAdmin = user?.role === 'admin';
  const isFieldOfficer = user?.role === 'field_officer';
  const canViewReports = isAdmin || isFieldOfficer;

  const availableTabs = useMemo(() => {
    const base = [
      { key: 'alerts', label: `🚨 Sensor Alerts (${alerts.length})` },
      { key: 'readings', label: '📡 Sensor Readings' },
    ];
    if (canViewReports) {
      base.unshift({ key: 'reports', label: `📝 Community Reports (${allReports.length})` });
    }
    return base;
  }, [alerts.length, allReports.length, canViewReports]);

  useEffect(() => {
    if (!authLoading && user && !searchTab) {
      setActiveTab(canViewReports ? 'reports' : 'alerts');
    }
  }, [authLoading, user, canViewReports, searchTab]);

  useEffect(() => {
    if (searchTab && availableTabs.some((tab) => tab.key === searchTab) && searchTab !== activeTab) {
      setActiveTab(searchTab);
    }
  }, [searchTab, availableTabs, activeTab]);

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    router.replace(`/dashboard?tab=${tabKey}`, { scroll: false });
  };

  useEffect(() => {
    if (availableTabs.length && !availableTabs.some((tab) => tab.key === activeTab)) {
      setActiveTab(availableTabs[0].key);
    }
  }, [availableTabs, activeTab]);

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
              <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.name} — <span className="capitalize">{user?.role?.replace('_', ' ')}</span></p>
            </div>
            {notices.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm font-medium">
                🔔 {notices.length} unread notification{notices.length > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <StatsCard title="Total Sources"    value={stats.sources}        icon="💧" color="sky"    />
            <StatsCard title="Safe"             value={stats.safe}           icon="✅" color="green"  />
            <StatsCard title="Unsafe"           value={stats.unsafe}         icon="⚠️" color="red"    />
            <StatsCard title="Unknown"          value={stats.unknown}        icon="❓" color="yellow" />
            <StatsCard title="Pending Reports"  value={stats.pendingReports} icon="📝" color="yellow" />
            <StatsCard title="Active Alerts"    value={stats.activeAlerts}   icon="🚨" color="red"    />
          </div>

          {/* Main Tabs */}
          <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
            {availableTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabSelect(tab.key)}
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

            {/* ── Community Reports Tab ── */}
            {activeTab === 'reports' && (
              <>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h2 className="font-bold text-gray-700">Community Reports from Public Users</h2>
                  {/* Report status filter */}
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    {['all', 'pending', 'verified', 'dismissed'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setReportFilter(f)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition capitalize ${
                          reportFilter === f
                            ? 'bg-white text-sky-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {f === 'all' ? `All (${allReports.length})` :
                         f === 'pending'   ? `Pending (${allReports.filter(r=>r.status==='pending').length})` :
                         f === 'verified'  ? `Verified (${allReports.filter(r=>r.status==='verified').length})` :
                         `Dismissed (${allReports.filter(r=>r.status==='dismissed').length})`}
                      </button>
                    ))}
                  </div>
                </div>
                {filteredReports.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No reports found.</p>
                ) : (
                  <ReportsQueue reports={filteredReports} onStatusChange={load} />
                )}
              </>
            )}

            {/* ── Sensor Alerts Tab ── */}
            {activeTab === 'alerts' && (
              <>
                <h2 className="font-bold text-gray-700 mb-1">Sensor-Triggered Alerts</h2>
                <p className="text-xs text-gray-400 mb-4">These are auto-generated when IoT sensor readings exceed WHO safety thresholds.</p>
                <AlertsPanel alerts={alerts} />
              </>
            )}

            {/* ── Sensor Readings Tab ── */}
            {activeTab === 'readings' && (
              <>
                <h2 className="font-bold text-gray-700 mb-1">Latest Sensor Readings</h2>
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
