'use client';

import { useApp } from '@/context/AppContext';

export default function ProfilePage() {
  const { user } = useApp();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#260f08]">My Profile</h1>
      <p className="text-[#87635a]">View and manage your personal details.</p>
      
      <div className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
            {user?.name || 'Loading...'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
            {user?.email || 'Loading...'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 capitalize">
            {user?.role || 'Loading...'}
          </div>
        </div>
      </div>
    </div>
  );
}
