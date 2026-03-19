'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import UserManagement from '@/components/admin/UserManagement';
import WaterSourceManager from '@/components/admin/WaterSourceManager';
import AlertConfig from '@/components/admin/AlertConfig';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

const TABS = [
  { key: 'users',   label: '👥 Users' },
  { key: 'sources', label: '💧 Water Sources' },
  { key: 'alerts',  label: '🚨 Alerts' },
];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState('users');

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

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage users, water sources, and system alerts.</p>
          </div>

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
            {!TABS.some((t) => t.key === tab) && (
              <p className="text-sm text-gray-500">
                Select an admin section from the sidebar dropdown to view its contents.
              </p>
            )}
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
}
