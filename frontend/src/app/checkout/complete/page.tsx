"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  id: string;
  product: {
    name: string;
    price: string;
  };
  quantity: number;
  price_at_time: string;
}

interface Order {
  id: string;
  total_price: string;
  status: "pending" | "paid" | "failed" | "cancelled";
  items: OrderItem[];
}

function CheckoutCompleteContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingCount, setPollingCount] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setError("ไม่พบข้อมูลหมายเลขสั่งซื้อ (Order ID)");
      setLoading(false);
      return;
    }

    // eslint-disable-next-line prefer-const
    let intervalId: NodeJS.Timeout | undefined;

    const fetchOrderStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        const res = await fetch(`${apiUrl}/orders/${orderId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลออเดอร์ได้");
        }

        const result = await res.json();
        
        if (result.status === "success" && result.data) {
          const currentOrder = result.data;
          setOrder(currentOrder);
          
          // ถ้าสถานะเป็น paid หรือ failed/cancelled แล้ว ให้หยุดดึงข้อมูล
          if (currentOrder.status === "paid" || currentOrder.status === "failed" || currentOrder.status === "cancelled") {
            setLoading(false);
            clearInterval(intervalId);
          } else {
            // หากยังเป็น pending และยังดึงไม่เกิน 15 ครั้ง (ประมาณ 30 วินาที) ให้ดึงข้อมูลต่อ
            if (pollingCount >= 15) {
              setLoading(false);
              clearInterval(intervalId);
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } else {
          setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
        setLoading(false);
        clearInterval(intervalId);
      }
    };

    // เรียกครั้งแรกทันที
    fetchOrderStatus();

    // ดำเนินการดึงซ้ำทุกๆ 2 วินาที (Polling)
    intervalId = setInterval(() => {
      setPollingCount((prev) => {
        const nextCount = prev + 1;
        fetchOrderStatus();
        return nextCount;
      });
    }, 2000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId, pollingCount]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500 text-3xl">
          ❌
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h1>
        <p className="text-gray-600 mb-8 max-w-md">{error}</p>
        <Link
          href="/menu"
          className="bg-[#c73b0f] text-white px-8 py-3 rounded-full font-medium hover:bg-[#a6300a] transition-all"
        >
          กลับหน้าเมนู
        </Link>
      </div>
    );
  }

  // กำลังยืนยันยอดเงิน (รันตอนแรก หรือ ตอนที่สถานะยังเป็น pending)
  if (loading && (!order || order.status === "pending")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[#c73b0f] border-t-transparent animate-spin"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3 animate-pulse">
          กำลังยืนยันสถานะการชำระเงิน...
        </h1>
        <p className="text-gray-500 max-w-sm">
          เรากำลังตรวจสอบยอดเงินของคุณจาก Payment Center กรุณารอสักครู่ ระบบจะอัปเดตโดยอัตโนมัติ
        </p>
      </div>
    );
  }

  // จ่ายเงินสำเร็จ (Paid)
  if (order?.status === "paid") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fadeIn">
        {/* Success Icon Animation container */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 text-green-500 mb-8 border border-green-200 shadow-inner scale-110 transition-transform duration-500">
          <svg className="w-12 h-12 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          ชำระเงินสำเร็จแล้ว! 🎉
        </h1>
        <p className="text-lg text-green-600 font-medium mb-8">
          ขอบคุณที่สั่งซื้อกับ SweetTooth ออเดอร์ของคุณได้รับการชำระเงินเรียบร้อยแล้ว
        </p>

        {/* Order Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden text-left mb-10 transform hover:shadow-2xl transition-all duration-300">
          <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">หมายเลขสั่งซื้อ</p>
              <p className="font-mono text-sm text-gray-700 font-semibold">{order.id}</p>
            </div>
            <div className="bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
              ชำระเงินแล้ว (Paid)
            </div>
          </div>

          <div className="p-6 space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">รายการสินค้า</h3>
            <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between text-sm">
                  <div className="text-gray-700">
                    <span className="font-semibold">{item.product.name}</span>
                    <span className="text-gray-400 mx-2">x</span>
                    <span className="text-gray-500 font-medium">{item.quantity}</span>
                  </div>
                  <div className="font-mono text-gray-900 font-semibold">
                    {(parseFloat(item.price_at_time) * item.quantity).toFixed(2)} THB
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">ยอดรวมทั้งสิ้น</span>
              <span className="text-2xl font-black text-[#c73b0f] font-mono">
                {parseFloat(order.total_price).toFixed(2)} THB
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu"
            className="bg-[#c73b0f] text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-[#a6300a] transition-all transform hover:scale-105 shadow-md text-center"
          >
            สั่งของหวานเพิ่ม 🍰
          </Link>
          <Link
            href="/profile"
            className="bg-gray-100 text-gray-700 px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-200 transition-all text-center"
          >
            ดูประวัติการสั่งซื้อ
          </Link>
        </div>
      </div>
    );
  }

  // กรณีการจ่ายเงินไม่สำเร็จ หรือ ออเดอร์ถูกยกเลิก (failed / cancelled)
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500 border border-red-100 text-3xl">
        ⚠️
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">การชำระเงินไม่สำเร็จ</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        การชำระเงินของออเดอร์นี้ถูกปฏิเสธ ล้มเหลว หรือหมดเวลาการทำธุรกรรมจากทาง Payment Center
      </p>

      {order && (
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 max-w-sm w-full mb-8 text-left">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">หมายเลขออเดอร์</p>
          <p className="font-mono text-sm text-gray-700 font-semibold truncate">{order.id}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mt-3">สถานะ</p>
          <p className="text-sm text-red-600 font-bold uppercase">{order.status}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs justify-center">
        <Link
          href="/menu"
          className="bg-[#c73b0f] text-white px-6 py-3 rounded-full font-medium hover:bg-[#a6300a] transition-all text-center"
        >
          กลับหน้าเมนู
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutCompletePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#c73b0f] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">กำลังโหลด...</p>
      </div>
    }>
      <CheckoutCompleteContent />
    </Suspense>
  );
}
