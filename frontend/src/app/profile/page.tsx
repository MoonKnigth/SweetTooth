'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, token } = useApp();
  const router = useRouter();

  useEffect(() => {
    // Simple check, if no token after a short delay, redirect.
    // Assuming token is loaded from cookie synchronously or via an initial effect.
    if (!token && !user) {
      const timer = setTimeout(() => {
        if (!token && !user) router.push('/login');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, token, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 flex items-center gap-6 border border-gray-100">
          <div className="w-20 h-20 bg-[#c73b0f] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
