<!-- SKILL.md -->
# Developer Guidelines & Soul

## 1. Code Style
- เขียนโค้ดแบบ Clean Code แยก Component ให้ชัดเจน (เช่น `ProductCard`, `CartSidebar`, `OrderModal`)
- ห้ามเขียน Component ขนาดยักษ์รวมกันในไฟล์เดียว (Don't put everything in page.tsx)
- ใช้ Tailwind CSS ในการจัด Layout โดยเน้นที่ Grid และ Flexbox เป็นหลัก

## 2. Backend & API Standard
- **API Response:** คืนค่า JSON เสมอ มีโครงสร้างสม่ำเสมอ (เช่น `status`, `message`, `data`)
- **Validation:** ใช้ Request Validation ก่อนเซฟลง Database ทุกครั้ง
- **Security:** - ราคาสินค้าต้องคำนวณจาก Database เสมอ ห้ามเชื่อค่าที่ส่งมาจาก Frontend เด็ดขาด
  - ป้องกัน IDOR: ห้ามรับค่า `user_id` จาก Request Body ให้ดึงจาก `$request->user()->id` (Token) เท่านั้น
- **Authentication:** ใช้ JWT ในการทำ API Token Auth แบบ Stateless (ห้ามใช้ Sanctum)
- **Security (IDOR Protection):** ห้ามรับค่า `user_id` จากฝั่ง Frontend (Request Body) เพื่อนำมาบันทึกข้อมูลเด็ดขาด ให้ใช้ `$request->user()->id` จาก Token เสมอเพื่อความปลอดภัย

## 3. Git & Version Control
- **โครงสร้าง Branch:** ใช้โครงสร้างมาตรฐาน `main` เป็น Production เสมอ และ `develop` สำหรับฟีเจอร์ที่กำลังพัฒนาอยู่ ห้ามพุชโค้ดที่ยังไม่เสถียรขึ้น `main` โดยตรง
- **ไม่ต้องทำการ Commit โค้ดทุกครั้งที่ทำงานเสร็จ** ให้ทำการ Commit เฉพาะเมื่อผู้ใช้สั่งให้ทำเท่านั้น
- เมื่อสั่ง Commit โค้ด บังคับใช้รูปแบบ **Conventional Commits** เสมอ เช่น:
  - `feat: add shopping cart component`
  - `fix: resolve hydration error on modal`
  - `style: update button hover states`

## 4. Execution Rule
- คิดให้จบก่อนพิมพ์โค้ด
- รันคำสั่งให้ถูกโฟลเดอร์เสมอ (`/frontend` สำหรับ Next.js, `/backend` สำหรับ Laravel)
- ฝั่ง Frontend ใช้คำสั่ง `pnpm add <package_name>`
- ฝั่ง Backend ใช้คำสั่ง `composer require <package_name>` และคำสั่ง `php artisan`
