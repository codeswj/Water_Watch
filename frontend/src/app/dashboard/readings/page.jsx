'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import Footer from '@/components/shared/Footer';
import SensorReadingsTable from '@/components/dashboard/SensorReadingsTable';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { sensorReadingsAPI } from '@/lib/api';

export default function ReadingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'admin' && user.role !== 'field_officer'))) {
      router.push('/map');
    }
  }, [authLoading, user, router]);

  const loadReadings = async () => {
    setLoading(true);
    try {
      const response = await sensorReadingsAPI.getAll({ limit: 25 });
      setReadings(response.data.readings || []);
    } catch (err) {
      console.error('Readings load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'public') {
      loadReadings();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading sensor readings…
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
              <h1 className="text-2xl font-bold text-gray-800">Sensor Readings</h1>
              <p className="text-sm text-gray-500">Latest pH, turbidity, conductivity, and dissolved oxygen metrics.</p>
            </div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Live telemetry</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-xs text-gray-400 mb-3">
              <span className="text-green-600 font-semibold">Green</span> = within safe range &nbsp;|&nbsp;
              <span className="text-red-600 font-semibold">Red</span> = exceeds threshold
            </p>
            <SensorReadingsTable readings={readings} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
