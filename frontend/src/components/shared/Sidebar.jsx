'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', roles: ['admin', 'field_officer'] },
  { href: '/map', label: 'Map View', roles: ['admin', 'field_officer', 'public'] },
  { href: '/report', label: 'Submit Report', roles: ['public'] },
];

const dashboardModules = [
  { href: '/dashboard/reports', label: 'Community Reports' },
  { href: '/dashboard/alerts', label: 'Sensor Alerts' },
  { href: '/dashboard/readings', label: 'Sensor Readings' },
];

const adminLinks = [
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/sources', label: 'Water Sources' },
  { href: '/admin/alerts', label: 'Alerts' },
  { href: '/admin/feedback', label: 'Feedback' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [adminOpen, setAdminOpen] = useState(false);

  const visible = navItems.filter((item) => item.roles.includes(user?.role));
  const isAdmin = user?.role === 'admin';
  const adminActive = pathname === '/admin' || pathname.startsWith('/admin/');

  const handleAdminToggle = () => {
    setAdminOpen((prev) => !prev);
  };
  const gotoAdminLink = (href) => {
    router.push(href);
    setAdminOpen(false);
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
            <span>Admin Panel</span>
            <span className="text-xs">{adminOpen ? '−' : '+'}</span>
          </button>
          {adminOpen && (
            <div className="mt-1 flex flex-col gap-1 pl-2">
              {adminLinks.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => gotoAdminLink(link.href)}
                    className={`text-left px-3 py-1 rounded-md text-xs font-semibold transition ${
                      active
                        ? 'bg-sky-50 text-sky-600'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
      {(isAdmin || user?.role === 'field_officer') && (
        <div className="mt-4">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Monitoring
          </p>
          <div className="flex flex-col gap-1">
            {dashboardModules.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
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
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
