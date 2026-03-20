'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/context/AuthContext';
import { notificationsAPI } from '@/lib/api';
import { formatDate } from '@/utils/helpers';

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [markAllLoading, setMarkAllLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationsAPI.getMy();
      const list = res.data.notifications || [];
      setNotifications(list.filter((n) => n.type === 'feedback'));
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const handleMarkRead = async (id) => {
    setProcessingId(id);
    try {
      await notificationsAPI.markAsRead(id);
      await loadNotifications();
    } catch (err) {
      console.error('Mark as read failed', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAll = async () => {
    setMarkAllLoading(true);
    try {
      await notificationsAPI.markAllAsRead();
      await loadNotifications();
    } catch (err) {
      console.error('Mark all as read failed', err);
    } finally {
      setMarkAllLoading(false);
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              <p className="text-sm text-gray-500">Admin feedback on the issues you reported.</p>
            </div>
            <button
              onClick={handleMarkAll}
              disabled={markAllLoading || unreadCount === 0}
              className="text-xs font-semibold text-sky-600 px-3 py-2 rounded-full border border-sky-200 hover:bg-sky-50 transition disabled:opacity-50 disabled:hover:bg-transparent disabled:border-gray-200"
            >
              {markAllLoading ? 'Marking…' : `Mark all as read (${unreadCount})`}
            </button>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
            {loading ? (
              <p className="text-sm text-gray-400">Loading notifications…</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                No feedback yet. Once an admin responds to your report, it will show up here.
              </p>
            ) : (
              notifications.map((notification) => {
                const isUnread = !notification.is_read;
                return (
                  <article
                    key={notification.id}
                    className={`border rounded-2xl p-4 transition ${
                      isUnread ? 'border-sky-200 bg-sky-50' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm text-gray-700">{notification.message}</p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          isUnread ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {isUnread ? 'Unread' : 'Read'}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400 gap-4">
                      <span>{formatDate(notification.created_at)}</span>
                      {isUnread && (
                        <button
                          type="button"
                          disabled={processingId === notification.id}
                          onClick={() => handleMarkRead(notification.id)}
                          className="text-sky-600 font-semibold hover:text-sky-700 disabled:opacity-50"
                        >
                          {processingId === notification.id ? 'Marking…' : 'Mark as read'}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
