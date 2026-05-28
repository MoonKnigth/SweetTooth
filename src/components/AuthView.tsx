'use client';

import React from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AuthView() {
  const { authMode, setAuthMode, handleMockLogin } = useApp();

  return (
    <div className="flex-1 flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#260f08] mb-2">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-[#87635a]">
            {authMode === 'login'
              ? 'Enter your details to access your account.'
              : 'Join us to start ordering delicious desserts.'}
          </p>
        </div>

        {/* OAuth Button Simulation */}
        <button className="w-full mb-6 bg-white border-2 border-gray-100 text-[#260f08] font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-[#87635a] text-sm">
            Or continue with email
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleMockLogin} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-[#260f08] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-[#fcf8f6] border border-gray-200 rounded-xl focus:outline-none focus:border-[#c73b0f] focus:ring-1 focus:ring-[#c73b0f] transition-all"
                  required
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-[#260f08] mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[#fcf8f6] border border-gray-200 rounded-xl focus:outline-none focus:border-[#c73b0f] focus:ring-1 focus:ring-[#c73b0f] transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#260f08] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#fcf8f6] border border-gray-200 rounded-xl focus:outline-none focus:border-[#c73b0f] focus:ring-1 focus:ring-[#c73b0f] transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#c73b0f] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#a6310c] transition-colors mt-6 shadow-md shadow-orange-100"
          >
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-[#87635a] text-sm">
          {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-[#c73b0f] font-bold hover:underline"
          >
            {authMode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
