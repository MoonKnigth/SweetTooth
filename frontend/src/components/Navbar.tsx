'use client';

import React from 'react';
import { ShoppingCart, LogIn, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const { currentPage, setCurrentPage, totalItemsCount, user, setIsLoginModalOpen, logout } = useApp();

  return (
    <nav className="bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div
          className="text-2xl font-bold text-[#c73b0f] cursor-pointer flex items-center gap-2"
          onClick={() => setCurrentPage('home')}
        >
          🍰 SweetTooth
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentPage('menu')}
            className={`font-semibold transition-colors ${
              currentPage === 'menu'
                ? 'text-[#c73b0f]'
                : 'text-[#87635a] hover:text-[#260f08]'
            }`}
          >
            Menu
          </button>

          <button
            onClick={() => setCurrentPage('menu')}
            className="relative p-2 text-[#87635a] hover:text-[#c73b0f] transition-colors"
            aria-label="View Shopping Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#c73b0f] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {totalItemsCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-4 bg-[#fcf8f6] py-2 px-4 rounded-full border border-gray-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#87635a]" />
                <span className="text-sm font-semibold text-[#260f08]">👋 สวัสดี, {user.name}</span>
              </div>
              
              {user.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-colors"
                >
                  ⚙️ Admin Dashboard
                </button>
              )}
              
              <button
                onClick={logout}
                className="text-xs font-bold text-[#c73b0f] border border-[#c73b0f] px-3 py-1.5 rounded-full hover:bg-[#c73b0f] hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 bg-[#c73b0f] text-white py-2 px-5 rounded-full font-semibold hover:bg-[#a6310c] transition-colors"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
