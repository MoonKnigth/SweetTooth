'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { toast } from 'react-toastify';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { oauthLogin } = useApp();
  const [isProcessing] = useState(true);

  const hasProcessed = React.useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    
    const processCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        hasProcessed.current = true;
        toast.error('Google login failed or was cancelled.');
        router.push('/login');
        return;
      }

      if (token) {
        hasProcessed.current = true;
        const success = await oauthLogin(token);
        if (success) {
          router.push('/');
        } else {
          router.push('/login');
        }
      } else {
        hasProcessed.current = true;
        router.push('/login');
      }
    };

    processCallback();
  }, [searchParams, oauthLogin, router]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-[#c73b0f] border-t-transparent rounded-full animate-spin"></div>
      <h2 className="text-xl font-semibold text-gray-700">
        {isProcessing ? 'Authenticating...' : 'Redirecting...'}
      </h2>
      <p className="text-gray-500 text-sm">Please wait while we log you in safely.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 min-h-[60vh]">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#c73b0f] border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      }>
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
