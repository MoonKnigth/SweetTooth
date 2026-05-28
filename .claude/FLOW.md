# 🗺️ Project Flow & Roadmap: Dessert Shop (Monorepo)

## 📌 Phase 1: Foundation (✅ เสร็จสิ้น)
- [x] Setup Monorepo (Next.js + Laravel 11).
- [x] สร้าง UI หน้าบ้านด้วย Next.js และจัดการ State ตะกร้าสินค้า.
- [x] สร้าง Backend API พื้นฐาน (ตาราง Products, Orders).
- [x] เชื่อมต่อหน้าบ้านและหลังบ้าน (ยิง API ดึงสินค้า และบันทึกคำสั่งซื้อ).

## 📌 Phase 2: Database Refactoring (🔄 กำลังดำเนินการ)
- [ ] อัปเกรด Database Schema ตาม ERD ล่าสุด (เปลี่ยนใช้ UUID).
- [ ] แยกตาราง `categories` และตั้งค่า Foreign Key.
- [ ] เพิ่มระบบ Soft Delete ในตาราง `products`.
- [ ] เตรียมฟิลด์ `role`, `provider`, `provider_id` ในตาราง `users` สำหรับระบบ Login.

## 📌 Phase 3: API Testing & Authentication (⏳ ลำดับต่อไป)
- [ ] Setup Bruno Collection ในโฟลเดอร์ `bruno-api-tests` เพื่อทดสอบ API ทุกเส้น.
- [ ] พัฒนาระบบ Authentication (Laravel Sanctum) ฝั่ง Backend.
- [ ] พัฒนาฟีเจอร์ Login/Register ฝั่ง Frontend (เชื่อมต่อ NextAuth หรือเรียก API ตรง).

## 📌 Phase 4: Admin Dashboard & Order History
- [ ] สร้าง API สำหรับ Admin (CRUD Products & Categories).
- [ ] สร้างหน้า Admin Dashboard บน Next.js.
- [ ] สร้างระบบดูประวัติคำสั่งซื้อ (Order History) สำหรับ User ที่ Login แล้ว.