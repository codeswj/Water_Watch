'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin, isFieldOfficer } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-sky-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="text-2xl">💧</span>
            <span className="hidden sm:inline">WaterWatch</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/map" className="hover:text-sky-200 transition-colors">Map</Link>
            {user && (
              <Link href="/report" className="hover:text-sky-200 transition-colors">Report Issue</Link>
            )}
            {(isAdmin || isFieldOfficer) && (
              <Link href="/dashboard" className="hover:text-sky-200 transition-colors">Dashboard</Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="hover:text-sky-200 transition-colors">Admin</Link>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sky-100 text-sm">
                  {user.name} <span className="text-sky-300">({user.role})</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-white text-sky-600 px-3 py-1.5 rounded text-sm font-semibold hover:bg-sky-50 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="px-3 py-1.5 rounded text-sm font-semibold hover:bg-sky-500 transition">
                  Login
                </Link>
                <Link href="/register" className="bg-white text-sky-600 px-3 py-1.5 rounded text-sm font-semibold hover:bg-sky-50 transition">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded hover:bg-sky-500"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-sky-700 px-4 pb-4 pt-2 flex flex-col gap-3 text-sm font-medium">
          <Link href="/map" onClick={() => setMenuOpen(false)}>Map</Link>
          {user && <Link href="/report" onClick={() => setMenuOpen(false)}>Report Issue</Link>}
          {(isAdmin || isFieldOfficer) && (
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
          {isAdmin && <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
          {user ? (
            <button onClick={logout} className="text-left text-red-300">Logout</button>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
