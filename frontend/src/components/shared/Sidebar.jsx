'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/dashboard',          label: '📊 Dashboard',      roles: ['admin', 'field_officer'] },
  { href: '/map',                label: '🗺️ Map View',        roles: ['admin', 'field_officer', 'public'] },
  { href: '/report',             label: '📝 Submit Report',   roles: ['admin', 'field_officer', 'public'] },
  { href: '/admin',              label: '⚙️ Admin Panel',     roles: ['admin'] },
  { href: '/admin/users',        label: '👥 Users',           roles: ['admin'] },
  { href: '/admin/water-sources',label: '💧 Water Sources',   roles: ['admin', 'field_officer'] },
  { href: '/admin/alerts',       label: '🚨 Alerts',          roles: ['admin', 'field_officer'] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const visible = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 pt-6 px-3 flex flex-col gap-1">
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
    </aside>
  );
}
