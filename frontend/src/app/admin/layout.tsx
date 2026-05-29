'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token } = useApp();

  useEffect(() => {
    // If auth state has been loaded and user is not admin, redirect
    // We delay this slightly to let AppContext restore token from localStorage
    const timer = setTimeout(() => {
      if (!token || user?.role !== 'admin') {
        router.push('/');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [user, token, router]);

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Orders', path: '/admin/orders' },
  ];

  return (
    <div className="flex-1 flex bg-[#fcf8f6]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 py-8 px-4 flex flex-col min-h-[calc(100vh-80px)]">
        <h2 className="text-xl font-bold text-[#260f08] mb-6 px-4">Admin Panel</h2>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#c73b0f] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#260f08]'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}
