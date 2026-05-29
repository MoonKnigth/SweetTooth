'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!token || !user) {
        router.push('/login');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [user, token, router]);

  const navItems = [
    { name: 'My Profile', path: '/profile' },
    { name: 'Order History', path: '/profile/orders' },
  ];

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 shrink-0 self-start">
        <h2 className="text-xl font-bold text-foreground mb-6">Account</h2>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-background text-[#c73b0f] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {children}
      </div>
    </div>
  );
}
