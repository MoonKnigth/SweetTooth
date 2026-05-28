'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';

export default function OrderModal() {
  const {
    isModalOpen,
    setIsModalOpen,
    cartItems,
    totalAmount,
    user,
    handleStartNewOrder,
  } = useApp();

  if (!isModalOpen) return null;

  const firstName = user?.name ? user.name.split(' ')[0] : 'Guest';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
        onClick={() => setIsModalOpen(false)}
      ></div>
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
        <CheckCircle className="w-16 h-16 text-green-500 mb-6 mx-auto" />
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#260f08] mb-2">Order Confirmed</h2>
          <p className="text-[#87635a]">
            We hope you enjoy your food!
          </p>
        </div>
        <div className="bg-[#fcf8f6] rounded-xl p-6 mb-8 border border-gray-100">
          <div className="max-h-48 overflow-y-auto mb-4 pr-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-3 border-b border-gray-200/50 last:border-0"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#260f08] text-sm truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span className="text-[#c73b0f] font-bold">
                      {item.quantity}x
                    </span>
                    <span className="text-[#87635a]">
                      @ ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="font-semibold text-[#260f08]">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-200/50 flex items-center justify-between">
            <span className="text-[#260f08] text-sm">Order Total</span>
            <span className="text-2xl font-bold text-[#260f08]">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          onClick={handleStartNewOrder}
          className="w-full bg-[#c73b0f] text-white py-4 rounded-full font-bold hover:bg-[#a6310c] transition-colors"
        >
          Start New Order
        </button>
      </div>
    </div>
  );
}
