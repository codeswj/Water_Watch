'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import ReportsQueue from '@/components/dashboard/ReportsQueue';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { reportsAPI } from '@/lib/api';

const FILTERS = ['all', 'pending', 'verified', 'dismissed'];

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'admin' && user.role !== 'field_officer'))) {
      router.push('/map');
    }
  }, [authLoading, user, router]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await reportsAPI.getAll();
      setReports(response.data.reports || []);
    } catch (err) {
      console.error('Reports load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'public') {
      loadReports();
    }
  }, [user]);

  const filteredReports = useMemo(() => {
    if (filter === 'all') return reports;
    return reports.filter((report) => report.status === filter);
  }, [reports, filter]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading reports…
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
              <h1 className="text-2xl font-bold text-gray-800">Community Reports</h1>
              <p className="text-sm text-gray-500">Validated reports submitted by the public.</p>
            </div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Live ingestion</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex flex-wrap gap-1 mb-4">
              {FILTERS.map((value) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                    filter === value
                      ? 'bg-white text-sky-600 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {value === 'all'
                    ? `All (${reports.length})`
                    : `${value.charAt(0).toUpperCase() + value.slice(1)} (${reports.filter((r) => r.status === value).length})`}
                </button>
              ))}
            </div>

            {filteredReports.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No reports found.</p>
            ) : (
              <ReportsQueue reports={filteredReports} onStatusChange={loadReports} />
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
