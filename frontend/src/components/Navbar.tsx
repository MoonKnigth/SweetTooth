'use client';

import React from 'react';
import { ShoppingCart, LogIn, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { totalItemsCount, user, logout } = useApp();
  const pathname = usePathname();

  return (
    <nav className="bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-[#c73b0f] cursor-pointer flex items-center gap-2"
        >
          🍰 SweetTooth
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/menu"
            className={`font-semibold transition-colors ${
              pathname === '/menu'
                ? 'text-[#c73b0f]'
                : 'text-[#87635a] hover:text-foreground'
            }`}
          >
            Menu
          </Link>

          <Link
            href="/menu"
            className="relative p-2 text-[#87635a] hover:text-[#c73b0f] transition-colors"
            aria-label="View Shopping Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#c73b0f] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4 bg-background py-2 px-4 rounded-full border border-gray-100">
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80">
                <User className="w-5 h-5 text-[#87635a]" />
                <span className="text-sm font-semibold text-foreground">👋 สวัสดี, {user.name}</span>
              </Link>
              
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-colors"
                >
                  ⚙️ Admin
                </Link>
              )}
              
              <button
                onClick={logout}
                className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors ml-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-[#c73b0f] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#a6300a] transition-all transform hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
