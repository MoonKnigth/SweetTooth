'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Package, Calendar, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  product: {
    name: string;
    image_thumbnail: string;
  };
}

interface Order {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function CustomerOrdersPage() {
  const { token } = useApp();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setOrders(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
          <Package className="w-6 h-6 text-[#c73b0f]" />
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-[#c73b0f] border-t-transparent rounded-full animate-spin mb-4" />
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-lg font-medium text-gray-900">You haven&apos;t placed any orders yet.</p>
            <p className="text-gray-500 mt-2 mb-6">Discover our delicious desserts and place your first order!</p>
            <button 
              onClick={() => router.push('/menu')}
              className="px-6 py-3 bg-[#c73b0f] text-white rounded-full font-semibold hover:bg-[#a6300a] transition-colors shadow-sm"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order.id} className="p-6 transition-colors hover:bg-gray-50/50">
                <div 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-gray-900 text-lg">
                        #{order.id.split('-')[0].toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(order.created_at).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-700">{Number(order.total_price).toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                  
                  <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium">
                    {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                    {expandedOrder === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Order Items Expanded View */}
                {expandedOrder === order.id && (
                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      Items in this order:
                    </h4>
                    <div className="grid gap-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
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
                              Qty: {item.quantity} × ${Number(item.price_at_time).toFixed(2)}
                            </p>
                          </div>
                          <div className="font-bold text-[#c73b0f] text-lg">
                            ${(item.quantity * Number(item.price_at_time)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-5 mt-2 border-t border-gray-100 font-bold text-xl">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-[#c73b0f]">${Number(order.total_price).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
