'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import AlertConfig from '@/components/admin/AlertConfig';
import { useAuth } from '@/context/AuthContext';

export default function AdminAlertsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'admin' && user.role !== 'field_officer'))) {
      router.push('/map');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading alerts...
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Alerts</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              System alerts and sensor incidents raised by automated monitoring.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <AlertConfig />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
