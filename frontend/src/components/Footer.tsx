import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-[#c73b0f]">
              SweetTooth 🍰
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Fresh and premium homemade desserts delivered right to your door. Bake your day sweeter!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              เมนูลัด
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/menu" className="hover:text-[#c73b0f] transition-colors">เมนูขนม (Menu)</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#c73b0f] transition-colors">ประวัติการสั่งซื้อ (Orders)</Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              นโยบายร้านค้า
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/terms" className="hover:text-[#c73b0f] transition-colors">ข้อตกลงและเงื่อนไข (Terms)</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#c73b0f] transition-colors">นโยบายความเป็นส่วนตัว (Privacy)</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#c73b0f] transition-colors">นโยบายการคืนเงิน (Refund)</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              ติดต่อเรา
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/contact" className="hover:text-[#c73b0f] transition-colors">ศูนย์ช่วยเหลือ (Contact Us)</Link>
              </li>
              <li>📧 jittipatjanphong@gmail.com</li>
              <li>📞 080-976-3675</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} SweetTooth Bakery. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <span className="text-xs text-gray-400">
              Secure payments provided by Omise
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
