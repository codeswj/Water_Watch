'use client';

import { useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import UserManagement from '@/components/admin/UserManagement';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading users…
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
              <h1 className="text-3xl font-semibold text-gray-800 mb-1">Users</h1>
              <p className="text-sm text-gray-500">Manage who can access the platform.</p>
            </section>
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
              <UserManagement />
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
