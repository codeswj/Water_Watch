'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import StatsCard from '@/components/dashboard/StatsCard';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { waterSourcesAPI, alertsAPI, reportsAPI } from '@/lib/api';

const MODULE_CARDS = [
  {
    href: '/dashboard/reports',
    icon: '📝',
    title: 'Community Reports',
    description: 'Review pending reports from the public and verify sightings.',
  },
  {
    href: '/dashboard/alerts',
    icon: '🚨',
    title: 'Sensor Alerts',
    description: 'See the latest alerts triggered by IoT readings that need action.',
  },
  {
    href: '/dashboard/readings',
    icon: '📡',
    title: 'Sensor Readings',
    description: 'Drill into the most recent pH, turbidity, and conductivity samples.',
  },
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    sources: 0,
    safe: 0,
    unsafe: 0,
    unknown: 0,
    pendingReports: 0,
    activeAlerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role === 'public')) {
      router.push('/map');
    }
  }, [authLoading, user, router]);

  const loadStats = async () => {
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
        safe: sources.filter((s) => s.status === 'safe').length,
        unsafe: sources.filter((s) => s.status === 'unsafe').length,
        unknown: sources.filter((s) => s.status === 'unknown').length,
        pendingReports: reportsList.filter((r) => r.status === 'pending').length,
        activeAlerts: alertsList.length,
      });
    } catch (err) {
      console.error('Dashboard stats load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'public') {
      loadStats();
    }
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Welcome back, {user?.name} — <span className="capitalize">{user?.role?.replace('_', ' ')}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <StatsCard title="Total Sources" value={stats.sources} icon="💧" color="sky" />
            <StatsCard title="Safe" value={stats.safe} icon="✅" color="green" />
            <StatsCard title="Unsafe" value={stats.unsafe} icon="⚠️" color="red" />
            <StatsCard title="Unknown" value={stats.unknown} icon="❓" color="yellow" />
            <StatsCard title="Pending Reports" value={stats.pendingReports} icon="📝" color="yellow" />
            <StatsCard title="Active Alerts" value={stats.activeAlerts} icon="🚨" color="red" />
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Monitoring modules</p>
                <h2 className="text-xl font-semibold text-gray-800">Jump into every workflow</h2>
              </div>
              <p className="text-sm text-gray-500">
                Tap a module to manage reports, alerts, or live readings on its dedicated page.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {MODULE_CARDS.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group block rounded-2xl bg-white border border-gray-200 p-5 shadow-sm hover:border-sky-200 transition"
                >
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{card.description}</p>
                  <span className="text-sm font-semibold text-sky-600 group-hover:text-sky-700">
                    Open module →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
