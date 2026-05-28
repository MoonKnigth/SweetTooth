'use client';

import React from 'react';
import ProductCard from './ProductCard';
import CartSidebar from './CartSidebar';
import { useApp } from '@/context/AppContext';

export default function MenuView() {
  const { products } = useApp();
  
  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-6 py-10 animate-in fade-in duration-500">
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-8 text-[#260f08]">Desserts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <CartSidebar />
    </div>
  );
}
