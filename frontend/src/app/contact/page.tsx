import React from 'react';

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ติดต่อเรา (Contact Us)</h1>
        <p className="text-lg text-gray-600">
          หากคุณมีข้อสงสัยเกี่ยวกับการสั่งซื้อ สินค้า หรือต้องการความช่วยเหลือ สามารถติดต่อเราได้ตามช่องทางด้านล่างนี้
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-lg p-8 md:p-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">SweetTooth Bakery</h2>
            <div className="flex items-start space-x-4 mb-6">
              <div className="text-3xl">📧</div>
              <div>
                <h3 className="font-semibold text-gray-900">อีเมล</h3>
                <a href="mailto:jittipatjanphong@gmail.com" className="text-orange-600 hover:text-orange-700 hover:underline">
                  jittipatjanphong@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4 mb-6">
              <div className="text-3xl">📞</div>
              <div>
                <h3 className="font-semibold text-gray-900">เบอร์โทรศัพท์</h3>
                <a href="tel:0809763675" className="text-gray-700 hover:text-orange-600">
                  080-976-3675
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-3xl">⏰</div>
              <div>
                <h3 className="font-semibold text-gray-900">เวลาทำการ</h3>
                <p className="text-gray-700">จันทร์ - ศุกร์ (09:00 - 18:00 น.)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Display Image or Map placeholder */}
        <div className="relative h-[300px] md:h-full w-full rounded-2xl overflow-hidden bg-orange-50 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-orange-200">
            <div className="text-5xl mb-4">🧁</div>
            <h3 className="text-xl font-bold text-orange-800 mb-2">We bake with love!</h3>
            <p className="text-orange-600/80">
              ทุกคำถามและคำติชมของคุณ<br/>คือส่วนผสมสำคัญที่ทำให้เราพัฒนาต่อไป
            </p>
        </div>
      </div>
    </div>
  );
}
