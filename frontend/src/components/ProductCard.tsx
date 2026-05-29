'use client';

import React from 'react';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cart, handleAddToCart, handleDecrement, handleIncrement } = useApp();
  const quantity = cart[product.id] || 0;

  return (
    <div className="flex flex-col group">
      <div className="relative mb-8">
        <div className="overflow-hidden rounded-xl">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className={`w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105 ${
              quantity > 0 ? 'border-2 border-[#c73b0f]' : ''
            }`}
          />
        </div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-40 h-11 z-10">
          {quantity === 0 ? (
            <button
              onClick={() => handleAddToCart(product.id)}
              className="w-full h-full bg-white border border-gray-300 rounded-full flex items-center justify-center gap-2 font-semibold text-foreground hover:border-[#c73b0f] hover:text-[#c73b0f] transition-all shadow-sm"
            >
              <ShoppingCart className="w-5 h-5 text-[#c73b0f]" /> Add to Cart
            </button>
          ) : (
            <div className="w-full h-full bg-[#c73b0f] rounded-full flex items-center justify-between px-3 shadow-md animate-in zoom-in-95">
              <button
                onClick={() => handleDecrement(product.id)}
                className="w-7 h-7 rounded-full border border-white flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 text-white" />
              </button>
              <span className="text-white font-semibold">{quantity}</span>
              <button
                onClick={() => handleIncrement(product.id)}
                className="w-7 h-7 rounded-full border border-white flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-[#87635a] text-sm mb-1">{product.categoryName}</p>
        <p className="font-semibold text-lg leading-tight mb-1">{product.name}</p>
        <p className="text-[#c73b0f] font-semibold">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
