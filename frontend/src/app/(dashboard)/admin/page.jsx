'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import UserManagement from '@/components/admin/UserManagement';
import WaterSourceManager from '@/components/admin/WaterSourceManager';
import AlertConfig from '@/components/admin/AlertConfig';
import FeedbackManager from '@/components/admin/FeedbackManager';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { waterSourcesAPI, alertsAPI, reportsAPI } from '@/lib/api';

const TABS = [
  { key: 'users',    label: '👥 Users' },
  { key: 'sources',  label: '💧 Water Sources' },
  { key: 'alerts',   label: '🚨 Alerts' },
  { key: 'feedback', label: '📝 Feedback' },
];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState({
    sources: 0,
    activeAlerts: 0,
    pendingReports: 0,
    unknown: 0,
  });

  const loadAnalytics = async () => {
    try {
      const [sourcesRes, alertsRes, reportsRes] = await Promise.all([
        waterSourcesAPI.getAll(),
        alertsAPI.getAll(),
        reportsAPI.getAll(),
      ]);

      const sources = sourcesRes.data.sources || [];
      const alertsList = alertsRes.data.alerts || [];
      const reportsList = reportsRes.data.reports || [];

      setStats({
        sources: sources.length,
        activeAlerts: alertsList.length,
        pendingReports: reportsList.filter((r) => r.status === 'pending').length,
        unknown: sources.filter((s) => s.status === 'unknown').length,
      });
    } catch (err) {
      console.error('Analytics load error:', err);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TABS.some((t) => t.key === tabParam)) {
      setTab(tabParam);
    }
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 px-6 py-8 bg-[#f5f8fb]">
          <div className="mx-auto w-full max-w-6xl space-y-6">

          {/* Header */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-800 mb-1">Dashboard</h1>
            <p className="text-sm text-gray-500 mb-3">Welcome back, {user?.name} — Admin</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100">
                <span className="h-1 w-1 rounded-full bg-sky-500 inline-block" />
                Live monitoring
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100">
                <span className="h-1 w-1 rounded-full bg-emerald-500 inline-block" />
                Trends updated hourly
              </span>
            </div>
          </div>

          {/* Analytics hero */}
          <section className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Analytics</p>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span role="img" aria-label="analytics">📊</span>
                  Analytics Dashboard
                </h2>
                <p className="text-sm text-gray-500">Trend charts and contamination heatmaps support evidence-based decisions.</p>
              </div>
              <div className="text-xs text-gray-500 border border-gray-200 rounded-full px-4 py-1 bg-white shadow-sm">
                Updated just now
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total sources</p>
                <p className="text-2xl font-semibold text-sky-600">{stats.sources}</p>
                <p className="text-xs text-gray-400">vs 14,653 last period</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Active Alerts</p>
                <p className="text-2xl font-semibold text-red-600">{stats.activeAlerts}</p>
                <p className="text-xs text-gray-400">vs 7.9 average</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Pending reports</p>
                <p className="text-2xl font-semibold text-amber-500">{stats.pendingReports}</p>
                <p className="text-xs text-gray-400">vs 32 last week</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Sensor coverage</p>
                <p className="text-2xl font-semibold text-green-600">{Math.max(0, stats.sources - stats.unknown)}</p>
                <p className="text-xs text-gray-400">Sources reporting</p>
              </div>
            </div>

          </section>

          {/* Tab content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            {tab === 'users' && (
              <>
                <h2 className="font-bold text-gray-700 mb-4">User Management</h2>
                <UserManagement />
              </>
            )}
            {tab === 'sources' && (
              <>
                <h2 className="font-bold text-gray-700 mb-4">Water Source Management</h2>
                <WaterSourceManager />
              </>
            )}
            {tab === 'alerts' && (
              <>
                <h2 className="font-bold text-gray-700 mb-4">Alerts Overview</h2>
                <AlertConfig />
              </>
            )}
            {tab === 'feedback' && (
              <>
                <h2 className="font-bold text-gray-700 mb-4">Community Feedback</h2>
                <FeedbackManager />
              </>
            )}
            {!TABS.some((t) => t.key === tab) && (
              <p className="text-sm text-gray-500">
                Select an admin section from the sidebar dropdown to view its contents.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
    <Footer />
  </div>
);
}
