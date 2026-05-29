'use client';

import React from 'react';
import Navbar from './Navbar';
import HomeView from './HomeView';
import AuthView from './AuthView';
import MenuView from './MenuView';
import OrderModal from './OrderModal';
import LoginModal from './LoginModal';
import AdminDashboard from './AdminDashboard';
import { useApp } from '@/context/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MainApp() {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf8f6] font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {currentPage === 'home' && <HomeView />}
        {currentPage === 'auth' && <AuthView />}
        {currentPage === 'menu' && <MenuView />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      <OrderModal />
      <LoginModal />
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
