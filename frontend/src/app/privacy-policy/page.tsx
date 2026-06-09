import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
      <div className="prose prose-lg text-gray-700">
        <p className="mb-4">
          SweetTooth Bakery เคารพสิทธิความเป็นส่วนตัวของท่าน นโยบายนี้อธิบายถึงวิธีการที่เรารวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของท่านเมื่อใช้บริการเว็บไซต์ของเรา
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">1. ข้อมูลที่เราจัดเก็บ</h2>
        <p className="mb-4">
          เราอาจเก็บรวบรวมข้อมูลส่วนบุคคลของท่านเมื่อท่านทำการลงทะเบียน สั่งซื้อสินค้า หรือติดต่อเรา ข้อมูลดังกล่าวอาจรวมถึง:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>ชื่อ-นามสกุล</li>
          <li>ที่อยู่สำหรับจัดส่งและออกบิล</li>
          <li>หมายเลขโทรศัพท์</li>
          <li>ที่อยู่อีเมล</li>
          <li>ข้อมูลที่เกี่ยวข้องกับการชำระเงิน (ดำเนินการผ่าน Payment Gateway ที่ได้มาตรฐาน)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">2. วัตถุประสงค์ในการเก็บรวบรวมข้อมูล</h2>
        <p className="mb-4">เราจัดเก็บและใช้ข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ต่อไปนี้เท่านั้น:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>เพื่อดำเนินการรับคำสั่งซื้อ จัดส่งสินค้า และออกใบเสร็จรับเงิน</li>
          <li>เพื่อติดต่อสื่อสารเกี่ยวกับการสั่งซื้อ หรือตอบข้อซักถามของท่าน</li>
          <li>เพื่อปรับปรุงบริการและประสบการณ์การใช้งานเว็บไซต์</li>
          <li>เพื่อปฏิบัติตามข้อบังคับทางกฎหมายที่เกี่ยวข้อง</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">3. การเปิดเผยข้อมูลแก่บุคคลที่สาม</h2>
        <p className="mb-4">
          เราจะ <strong>ไม่ขาย หรือให้เช่า</strong> ข้อมูลส่วนบุคคลของท่านแก่บุคคลที่สาม อย่างไรก็ตาม เราอาจจำเป็นต้องแบ่งปันข้อมูลของท่านกับพันธมิตรที่ให้บริการที่จำเป็น (เช่น บริษัทขนส่ง หรือผู้ให้บริการ Payment Gateway) เพียงเท่าที่จำเป็นสำหรับการให้บริการเท่านั้น
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">4. ความปลอดภัยของข้อมูล</h2>
        <p className="mb-4">
          เรามีมาตรการรักษาความปลอดภัยทางเทคนิคและกระบวนการจัดการที่เหมาะสม เพื่อป้องกันการเข้าถึง การใช้ หรือการเปิดเผยข้อมูลส่วนบุคคลของท่านโดยไม่ได้รับอนุญาต
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900">5. สิทธิของเจ้าของข้อมูล</h2>
        <p className="mb-4">
          ท่านมีสิทธิในการขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของท่านที่อยู่ในความดูแลของเรา โดยติดต่อเราผ่านทาง <Link href="/contact" className="text-orange-600 hover:underline">หน้าติดต่อเรา</Link>
        </p>

        <p className="mt-12 text-sm text-gray-500">
          อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
        </p>
      </div>
    </div>
  );
}
