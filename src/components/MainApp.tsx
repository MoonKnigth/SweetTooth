'use client';

import React from 'react';
import Navbar from './Navbar';
import HomeView from './HomeView';
import AuthView from './AuthView';
import MenuView from './MenuView';
import OrderModal from './OrderModal';
import { useApp } from '@/context/AppContext';

export default function MainApp() {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf8f6] font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {currentPage === 'home' && <HomeView />}
        {currentPage === 'auth' && <AuthView />}
        {currentPage === 'menu' && <MenuView />}
      </main>

      <OrderModal />
    </div>
  );
}
