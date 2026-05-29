'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, MapPin, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_time: number;
  product: {
    name: string;
    image_thumbnail: string;
  };
}

interface Order {
  id: string;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  total_price: number;
  created_at: string;
  items: OrderItem[];
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    
    setIsLoading(true);
    setError('');
    setOrder(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${idToFetch.trim()}`);
      const data = await res.json();
      
      if (res.ok && data.status === 'success') {
        setOrder(data.data);
      } else {
        setError('ไม่พบหมายเลขคำสั่งซื้อนี้ในระบบ โปรดตรวจสอบความถูกต้องและลองอีกครั้ง');
      }
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ โปรดลองอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'paid': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-8 h-8" />;
      case 'paid': return <MapPin className="w-8 h-8" />;
      case 'cancelled': return <XCircle className="w-8 h-8" />;
      default: return <Clock className="w-8 h-8" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'paid': return 'Preparing / Paid';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending Payment';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-[#c73b0f]/10 rounded-full flex items-center justify-center mx-auto text-[#c73b0f]">
          <Search className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Enter your order ID below to check the current status of your delicious treats.
        </p>
      </div>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3">
        <input 
          type="text" 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. ord_1234abcd" 
          className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-[#c73b0f] focus:ring-2 focus:ring-[#c73b0f]/20 transition-all outline-none text-gray-900 font-mono"
          required
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="bg-[#c73b0f] hover:bg-[#a6300a] text-white px-8 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Track Order'
          )}
        </button>
      </form>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center text-red-600 animate-in zoom-in-95">
          <AlertCircle className="w-12 h-12 mb-3 opacity-80" />
          <p className="font-medium text-lg">{error}</p>
        </div>
      )}

      {/* Results Area */}
      {order && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {/* Status Card */}
          <div className={`p-8 rounded-2xl border ${getStatusColor(order.status)} flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left`}>
            <div className="bg-white/50 p-4 rounded-full shadow-sm">
              {getStatusIcon(order.status)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold opacity-80 uppercase tracking-wider mb-1">Current Status</p>
              <h2 className="text-3xl font-bold">{getStatusText(order.status)}</h2>
              <p className="text-sm mt-2 opacity-80">
                Order placed on {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#c73b0f]" />
                  Order Details
                </h3>
                <span className="font-mono text-sm text-gray-500 bg-white px-3 py-1 rounded-md border border-gray-200 shadow-sm">
                  {order.id.split('-')[0].toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {item.product?.image_thumbnail ? (
                        <Image
                          src={item.product.image_thumbnail}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {item.product ? item.product.name : 'Unknown Product'}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="font-bold text-gray-900">
                      ${(item.quantity * Number(item.price_at_time)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-600">Total Amount</span>
                <span className="font-bold text-2xl text-[#c73b0f]">
                  ${Number(order.total_price).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center p-12 text-gray-500">Loading tracker...</div>}>
        <TrackContent />
      </Suspense>
    </div>
  );
}
