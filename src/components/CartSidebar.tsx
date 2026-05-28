'use client';

import React from 'react';
import { ShoppingCart, XCircle, Leaf } from 'lucide-react';
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
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-32 h-32 mb-4 opacity-50 text-[#87635a] flex items-center justify-center bg-[#fcf8f6] rounded-full">
              <ShoppingCart className="w-12 h-12" />
            </div>
            <p className="text-[#87635a] font-semibold">
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
                    <p className="font-semibold text-[#260f08] mb-1">{item.name}</p>
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
                    className="text-gray-300 hover:text-[#260f08] transition-colors"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="py-6 flex items-center justify-between">
              <span className="text-[#260f08]">Order Total</span>
              <span className="text-3xl font-bold text-[#260f08]">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="bg-[#fcf8f6] rounded-lg p-4 flex items-center justify-center gap-2 mb-6">
              <Leaf className="w-5 h-5 text-green-600" />
              <p className="text-[#260f08] text-sm">
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
