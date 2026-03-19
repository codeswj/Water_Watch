'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/dashboard', label: '📊 Dashboard', roles: ['admin', 'field_officer'] },
  { href: '/map', label: '🗺️ Map View', roles: ['admin', 'field_officer', 'public'] },
  { href: '/report', label: '📝 Submit Report', roles: ['public'] },
];

const adminTabs = [
  { key: 'users', label: '👥 Users' },
  { key: 'sources', label: '💧 Water Sources' },
  { key: 'alerts', label: '🚨 Alerts' },
];

const dashboardTabs = [
  { key: 'reports', label: '📝 Community Reports' },
  { key: 'alerts', label: '🚨 Sensor Alerts' },
  { key: 'readings', label: '📡 Sensor Readings' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [adminOpen, setAdminOpen] = useState(false);

  const visible = navItems.filter((item) => item.roles.includes(user?.role));
  const isAdmin = user?.role === 'admin';
  const currentAdminTab = searchParams.get('tab') || 'users';
  const adminActive = pathname === '/admin';
  const currentDashboardTab = searchParams.get('tab') || 'reports';

  const gotoAdminTab = (tab) => {
    router.push(`/admin?tab=${tab}`);
    setAdminOpen(false);
  };
  const gotoDashboardTab = (tab) => {
    router.push(`/dashboard?tab=${tab}`);
    setAdminOpen(false);
  };
  const handleAdminToggle = () => {
    setAdminOpen((prev) => !prev);
  };

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 pt-6 px-3 flex flex-col gap-1 relative">
      {visible.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-sky-50 text-sky-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      {isAdmin && (
        <div className="mt-2">
          <button
            type="button"
            onClick={handleAdminToggle}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              adminActive
                ? 'bg-sky-50 text-sky-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span>⚙️ Admin Panel</span>
            <span className="text-xs">{adminOpen ? '▴' : '▾'}</span>
          </button>
          {adminOpen && (
            <div className="mt-1 flex flex-col gap-1 pl-2">
              {adminTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => gotoAdminTab(tab.key)}
                  className={`text-left px-3 py-1 rounded-md text-xs font-semibold transition ${
                    adminActive && currentAdminTab === tab.key
                      ? 'bg-sky-50 text-sky-600'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {(isAdmin || user?.role === 'field_officer') && (
        <div className="mt-2">
          <div className="flex flex-col gap-1">
            {dashboardTabs.map((tab) => {
              const activeDashboardTab = pathname === '/dashboard' && currentDashboardTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => gotoDashboardTab(tab.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeDashboardTab
                      ? 'bg-sky-50 text-sky-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
