# Developer Guidelines & Soul

## 1. Code Style
- เขียนโค้ดแบบ Clean Code แยก Component ให้ชัดเจน (เช่น `ProductCard`, `CartSidebar`, `OrderModal`)
- ห้ามเขียน Component ขนาดยักษ์รวมกันในไฟล์เดียว (Don't put everything in page.tsx)
- ใช้ Tailwind CSS ในการจัด Layout โดยเน้นที่ Grid และ Flexbox เป็นหลัก

## 2. Git & Version Control
- เมื่อสั่ง Commit โค้ด บังคับใช้รูปแบบ **Conventional Commits** เสมอ เช่น:
  - `feat: add shopping cart component`
  - `fix: resolve hydration error on modal`
  - `style: update button hover states`

## 3. Execution Rule
- คิดให้จบก่อนพิมพ์โค้ด
- ถ้าต้องติดตั้ง Package ใหม่ ให้ใช้คำสั่ง `pnpm add <package_name>` เสมอ
