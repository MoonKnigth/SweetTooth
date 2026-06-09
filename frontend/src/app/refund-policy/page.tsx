import React from 'react';
import Link from 'next/link';

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">นโยบายการคืนเงิน (Refund Policy)</h1>
      <div className="prose prose-lg text-gray-700">
        <p className="mb-4">
          ที่ SweetTooth Bakery เราใส่ใจในคุณภาพและความสดใหม่ของขนมทุกชิ้น เพื่อความพึงพอใจสูงสุดของลูกค้า เรามีนโยบายการคืนเงินและเปลี่ยนสินค้าดังนี้:
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">1. กรณีที่สามารถขอคืนเงินหรือเปลี่ยนสินค้าได้</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>สินค้าได้รับความเสียหายอย่างหนักระหว่างการจัดส่ง (เช่น กล่องบุบจนขนมเละ)</li>
          <li>ได้รับสินค้าไม่ตรงตามออเดอร์ที่สั่งซื้อ</li>
          <li>สินค้ามีคุณภาพไม่เป็นไปตามมาตรฐาน (เช่น มีสิ่งแปลกปลอม หรือเสียก่อนวันหมดอายุที่ระบุ)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">2. ระยะเวลาการแจ้งเรื่อง</h2>
        <p className="mb-4">
          ลูกค้าต้องแจ้งปัญหาและขอคืนเงิน/เปลี่ยนสินค้า <strong>ภายใน 24 ชั่วโมง</strong> หลังจากได้รับสินค้า หากเกินระยะเวลาที่กำหนด ทางร้านขอสงวนสิทธิ์ในการพิจารณาเป็นกรณีไป
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">3. ขั้นตอนการขอคืนเงิน</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>ถ่ายรูปสินค้าที่ได้รับความเสียหาย หรือสินค้าที่ได้รับผิด อย่างชัดเจน</li>
          <li>ติดต่อเราผ่านทางอีเมล <strong>jittipatjanphong@gmail.com</strong> หรือเบอร์โทร <strong>080-976-3675</strong></li>
          <li>ระบุหมายเลขคำสั่งซื้อ (Order ID) และรายละเอียดของปัญหา</li>
        </ol>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">4. ระยะเวลาการคืนเงิน</h2>
        <p className="mb-4">
          เมื่อคำร้องขอคืนเงินได้รับการอนุมัติ ทางเราจะดำเนินการคืนเงินผ่านช่องทางที่ท่านใช้ชำระเงิน ภายใน <strong>7-14 วันทำการ</strong> (ขึ้นอยู่กับนโยบายของธนาคารหรือผู้ให้บริการบัตรเครดิตของท่าน)
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">5. ข้อยกเว้น</h2>
        <p className="mb-4">
          ทางร้านขอสงวนสิทธิ์ไม่รับคืนเงินหรือเปลี่ยนสินค้าในกรณีที่:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>ลูกค้าเปลี่ยนใจหลังจากสั่งซื้อสำเร็จแล้ว</li>
          <li>ความเสียหายเกิดจากการจัดเก็บไม่ถูกต้องหลังจากได้รับสินค้า</li>
        </ul>
        
        <div className="mt-12 p-6 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-0">
            หากมีข้อสงสัยเพิ่มเติม สามารถดูรายละเอียดการติดต่อได้ที่ <Link href="/contact" className="text-orange-600 hover:underline">หน้าติดต่อเรา</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
