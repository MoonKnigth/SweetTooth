import React from 'react';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">ข้อตกลงและเงื่อนไข (Terms and Conditions)</h1>
      <div className="prose prose-lg text-gray-700">
        <p className="mb-4">
          ยินดีต้อนรับสู่ SweetTooth Bakery การที่ท่านเข้าใช้บริการและสั่งซื้อสินค้าผ่านเว็บไซต์ของเรา ถือว่าท่านตกลงยอมรับข้อตกลงและเงื่อนไขเหล่านี้ โปรดอ่านอย่างละเอียด
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">1. ข้อมูลทั่วไป</h2>
        <p className="mb-4">
          เว็บไซต์นี้ดำเนินการโดย SweetTooth Bakery เราให้บริการจำหน่ายและจัดส่งขนมเบเกอรี่ผ่านช่องทางออนไลน์
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">2. การสั่งซื้อและการชำระเงิน</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>การสั่งซื้อจะสมบูรณ์ก็ต่อเมื่อได้รับการยืนยันการชำระเงินผ่านระบบ Payment Gateway เรียบร้อยแล้ว</li>
          <li>ทางร้านสงวนสิทธิ์ในการยกเลิกคำสั่งซื้อในกรณีที่สินค้าหมด หรือมีเหตุสุดวิสัยที่ไม่สามารถจัดส่งได้ โดยจะทำการคืนเงินเต็มจำนวน</li>
          <li>ราคาที่แสดงบนเว็บไซต์อาจมีการเปลี่ยนแปลงได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">3. การจัดส่งสินค้า</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>ทางร้านจะดำเนินการจัดส่งสินค้าตามที่อยู่ที่ท่านระบุไว้</li>
          <li>เวลาที่ใช้ในการจัดส่งเป็นเพียงการประมาณการเท่านั้น อาจมีความล่าช้าจากปัจจัยการขนส่ง</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">4. นโยบายการเปลี่ยนและคืนสินค้า</h2>
        <p className="mb-4">
          กรุณาศึกษาที่ <Link href="/refund-policy" className="text-orange-600 hover:underline">นโยบายการคืนเงิน</Link> สำหรับข้อมูลเพิ่มเติมเกี่ยวกับการขอคืนเงินหรือเปลี่ยนสินค้า
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">5. ทรัพย์สินทางปัญญา</h2>
        <p className="mb-4">
          เนื้อหาทั้งหมดบนเว็บไซต์นี้ รวมถึงรูปภาพ โลโก้ และข้อความ เป็นทรัพย์สินทางปัญญาของ SweetTooth Bakery ห้ามมิให้ทำซ้ำ ดัดแปลง หรือเผยแพร่โดยไม่ได้รับอนุญาต
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">6. การแก้ไขเปลี่ยนแปลง</h2>
        <p className="mb-4">
          เราขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงข้อตกลงและเงื่อนไขนี้ได้ตลอดเวลาโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
        </p>

        <p className="mt-12 text-sm text-gray-500">
          อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
        </p>
      </div>
    </div>
  );
}
