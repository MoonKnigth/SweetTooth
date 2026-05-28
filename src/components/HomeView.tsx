'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function HomeView() {
  const { setCurrentPage } = useApp();

  return (
    <div className="flex-1 flex items-center max-w-7xl mx-auto px-6 py-12 lg:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-block bg-orange-100 text-[#c73b0f] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
            100% Fresh & Homemade
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-[#260f08] leading-tight">
            Life is short, <br />
            make it <span className="text-[#c73b0f]">sweet.</span>
          </h1>
          <p className="text-lg text-[#87635a] max-w-md leading-relaxed">
            Indulge in our carefully crafted desserts, baked daily with love and premium ingredients. Delivered fresh to your door.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('menu')}
              className="bg-[#c73b0f] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#a6310c] transition-all hover:-translate-y-1 shadow-lg shadow-orange-200 flex items-center gap-2"
            >
              Order Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-30 -z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80"
            alt="Hero Dessert"
            className="w-full h-[500px] object-cover rounded-[2rem] shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
