'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { waterSourcesAPI, alertsAPI, reportsAPI } from '@/lib/api';

const MODULES = [
  { href: '/admin/users', title: 'Users', icon: '👥', desc: 'Invite, edit, and remove people with admin privileges.' },
  { href: '/admin/sources', title: 'Water Sources', icon: '💧', desc: 'Manage source metadata, locations, and assigned sensors.' },
  { href: '/admin/alerts', title: 'Alerts', icon: '🚨', desc: 'Adjust alert thresholds and review auto-generated incidents.' },
  { href: '/admin/feedback', title: 'Feedback', icon: '📝', desc: 'Respond to community feedback and flag abuse.' },
];

export default function AdminLandingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    sources: 0,
    activeAlerts: 0,
    pendingReports: 0,
    unknown: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAnalytics();
    }
  }, [user]);

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading admin panel...
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
            <section className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
              <h1 className="text-3xl font-semibold text-gray-800 mb-1">Admin Console</h1>
              <p className="text-sm text-gray-500 mb-3">Central hub for configuration and account management.</p>
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
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Analytics</p>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span role="img" aria-label="analytics">ðŸ“Š</span>
                    Live Insights
                  </h2>
                  <p className="text-sm text-gray-500">See coverage and alert trends before hopping into a module.</p>
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
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Active alerts</p>
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

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Admin modules</p>
                  <h2 className="text-2xl font-bold text-gray-800">Choose a task</h2>
                </div>
                <p className="text-sm text-gray-500">Each card opens a dedicated management page.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {MODULES.map((module) => (
                  <Link
                    key={module.href}
                    href={module.href}
                    className="group block rounded-2xl bg-sky-50/50 border border-sky-100 p-5 shadow-sm hover:border-sky-200 transition"
                  >
                    <div className="text-3xl mb-2">{module.icon}</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{module.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{module.desc}</p>
                    <span className="text-sm font-semibold text-sky-600 group-hover:text-sky-700">
                      Open module →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
