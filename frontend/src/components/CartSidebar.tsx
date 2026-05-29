'use client';

import React from 'react';
import { XCircle, Leaf } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CartSidebar() {
  const {
    cartItems,
    totalItemsCount,
    totalAmount,
    handleRemoveItem,
    handleConfirmOrder,
    user,
  } = useApp();

  return (
    <div className="lg:w-96 shrink-0">
      <div className="bg-white p-6 rounded-xl shadow-sm sticky top-28 border border-gray-50">
        <h2 className="text-[#c73b0f] text-2xl font-bold mb-6">
          Your Cart ({totalItemsCount})
        </h2>
        {totalItemsCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-48 h-40 mb-4 flex items-center justify-center">
              <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Plate */}
                <ellipse cx="64" cy="90" rx="55" ry="12" fill="#e2d8d5" />
                <ellipse cx="64" cy="87" rx="50" ry="10" fill="#f5ebe8" />
                
                {/* Cake Back Slice */}
                <path d="M85 52 L98 55 L98 75 L85 72 Z" fill="#87635a" />
                <path d="M98 55 L106 48 L106 68 L98 75 Z" fill="#65463f" />
                <path d="M85 52 L93 45 L106 48 L98 55 Z" fill="#c73b0f" />
                {/* Layer Lines Back Slice */}
                <path d="M85 62 L98 65" stroke="#ffffff" strokeWidth="2" />
                <path d="M98 65 L106 58" stroke="#ffffff" strokeWidth="2" />

                {/* Cake Front Slice (Main cut) */}
                <path d="M30 65 L55 75 L80 65 L80 85 L55 95 L30 85 Z" fill="#ad7a6e" />
                <path d="M30 65 C30 53, 80 53, 80 65 L80 85 C80 90, 30 90, 30 85 Z" fill="#87635a" stroke="#65463f" strokeWidth="1" />
                
                {/* Frosting / Top */}
                <path d="M30 65 C30 53, 80 53, 80 65 Z" fill="#582a20" />
                <path d="M30 65 L55 75 L80 65" stroke="#582a20" strokeWidth="4" />
                
                {/* Cream Fillings */}
                <path d="M30 75 L55 85 L80 75" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <path d="M30 80 L55 90 L80 80" stroke="#582a20" strokeWidth="2" strokeLinecap="round" />
                
                {/* Cherry/Topping */}
                <circle cx="55" cy="58" r="6" fill="#c73b0f" />
                <path d="M55 52 C55 52, 58 45, 62 42" stroke="#87635a" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[#87635a] font-semibold text-center text-sm px-4">
              Your added items will appear here
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="max-h-[50vh] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b border-[#fcf8f6]"
                >
                  <div>
                    <p className="font-semibold text-foreground mb-1">{item.name}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[#c73b0f] font-semibold">
                        {item.quantity}x
                      </span>
                      <span className="text-[#87635a]">@ ${item.price.toFixed(2)}</span>
                      <span className="font-semibold text-[#87635a]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-300 hover:text-foreground transition-colors"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="py-6 flex items-center justify-between">
              <span className="text-foreground">Order Total</span>
              <span className="text-3xl font-bold text-foreground">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="bg-background rounded-lg p-4 flex items-center justify-center gap-2 mb-6">
              <Leaf className="w-5 h-5 text-green-600" />
              <p className="text-foreground text-sm">
                This is a <span className="font-semibold">carbon-neutral</span> delivery
              </p>
            </div>
            <button
              onClick={handleConfirmOrder}
              className="w-full bg-[#c73b0f] text-white py-4 rounded-full font-bold hover:bg-[#a6310c] transition-colors shadow-lg shadow-orange-100"
            >
              {user ? 'Confirm Order' : 'Sign in to Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
