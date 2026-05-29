# 🗺️ Project Flow & Roadmap: SweetTooth (Monorepo)

## 📌 Architecture & System Workflow
This diagram represents the current production-ready workflow of the system, including both the Frontend (Next.js) and Backend (Laravel) interactions.

```mermaid
flowchart TD
    classDef user fill:#f9f2ec,stroke:#c73b0f,stroke-width:2px,color:#260f08
    classDef frontend fill:#eef2ff,stroke:#4f46e5,stroke-width:2px,color:#1e1b4b
    classDef backend fill:#fef2f2,stroke:#ef4444,stroke-width:2px,color:#7f1d1d
    classDef database fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#064e3b
    classDef newfeature fill:#fef08a,stroke:#eab308,stroke-width:2px,color:#713f12,stroke-dasharray: 5 5

    Guest([👤 Guest / ผู้ใช้ทั่วไป]):::user
    Customer([👤 Customer / สมาชิก]):::user
    Admin([👑 Admin / ผู้ดูแลระบบ]):::user

    subgraph Frontend ["🖥️ Frontend (Next.js App Router)"]
        Landing["หน้าแรก (/)"]:::frontend
        MenuCart["หน้าร้าน & ตะกร้า (/menu)"]:::frontend
        AuthPages["เข้าสู่ระบบ/สมัครสมาชิก (/login, /register)"]:::frontend
        ProfilePage["โปรไฟล์ลูกค้า (/profile)"]:::frontend
        GuestTracking["หน้าติดตามสถานะ Guest (/track)"]:::newfeature
        AdminDashboard["แดชบอร์ดแอดมิน (/admin)"]:::frontend
        AdminProducts["จัดการสินค้า (/admin/products)"]:::frontend
        AdminCategories["จัดการหมวดหมู่ (/admin/categories)"]:::newfeature
        AdminOrders["จัดการออเดอร์ (/admin/orders)"]:::frontend
    end

    subgraph Backend ["⚙️ Backend API (Laravel Sanctum)"]
        PublicProductsAPI["GET /api/products & categories"]:::backend
        OrderAPI["POST /api/orders"]:::backend
        AuthAPI["POST /api/login, /register"]:::backend
        AdminAPI["Admin API (Protected)"]:::backend
    end

    subgraph DB ["🗄️ Database (PostgreSQL)"]
        UsersDB[("ตาราง Users (UUID)")]:::database
        CategoriesDB[("ตาราง Categories (ID)")]:::newfeature
        ProductsDB[("ตาราง Products (UUID + Soft Deletes)")]:::database
        OrdersDB[("ตาราง Orders & Items (UUID)")]:::database
    end

    Guest -->|"เข้าชมเว็บไซต์"| Landing
    Customer -->|"เข้าชมเว็บไซต์"| Landing
    Landing -->|"เลือกซื้อของ"| MenuCart
    MenuCart -->|"ดึงข้อมูลสินค้าและหมวดหมู่"| PublicProductsAPI
    PublicProductsAPI -.->|"Query"| CategoriesDB
    PublicProductsAPI -.->|"Query"| ProductsDB
    MenuCart -->|"กด Checkout ยืนยัน"| OrderAPI
    OrderAPI -.->|"บันทึกออเดอร์"| OrdersDB
    OrderAPI -- "คืนค่า Tracking (UUID)" --> GuestTracking

    Guest -->|"ต้องการเป็นสมาชิก"| AuthPages
    AuthPages -->|"ส่งอีเมล & รหัสผ่าน"| AuthAPI
    AuthAPI -.->|"ตรวจสอบ/บันทึก"| UsersDB
    AuthAPI -- "ตอบกลับ Token (Auto-Login)" --> Customer
    Customer -->|"ตั้งค่าส่วนตัว"| ProfilePage

    Admin -->|"ล็อกอิน"| AuthPages
    AuthPages -->|"Token + เช็ค Role"| AdminDashboard
    AdminDashboard --> AdminProducts
    AdminDashboard --> AdminCategories
    AdminDashboard --> AdminOrders
    AdminCategories -->|"เพิ่ม/แก้/ลบ หมวดหมู่"| AdminAPI
    AdminProducts -->|"เพิ่ม/แก้/ลบ สินค้า"| AdminAPI
    AdminOrders -->|"เปลี่ยนสถานะออเดอร์"| AdminAPI
    AdminAPI -.->|"CRUD หมวดหมู่"| CategoriesDB
    AdminAPI -.->|"CRUD สินค้า"| ProductsDB
    AdminAPI -.->|"อัปเดต Status"| OrdersDB
```

## 📌 Phase 1: Foundation (✅ เสร็จสิ้น)
- [x] Setup Monorepo (Next.js + Laravel 11).
- [x] สร้าง UI หน้าบ้านด้วย Next.js และจัดการ State ตะกร้าสินค้า.
- [x] สร้าง Backend API พื้นฐาน (ตาราง Products, Orders).
- [x] เชื่อมต่อหน้าบ้านและหลังบ้าน (ยิง API ดึงสินค้า และบันทึกคำสั่งซื้อ).

## 📌 Phase 2: Database Refactoring (✅ เสร็จสิ้น)
- [x] อัปเกรด Database Schema ตาม ERD ล่าสุด (เปลี่ยนใช้ UUID).
- [x] เพิ่มระบบ Soft Delete ในตาราง `products`.
- [x] เตรียมฟิลด์ `role`, `provider`, `provider_id` ในตาราง `users` สำหรับระบบ Login.

## 📌 Phase 3: API Testing & Authentication (✅ เสร็จสิ้น)
- [x] Setup Bruno Collection ในโฟลเดอร์ `bruno-api-tests` เพื่อทดสอบ API ทุกเส้น.
- [x] พัฒนาระบบ Authentication (Laravel Sanctum) ฝั่ง Backend.
- [x] พัฒนาฟีเจอร์ Login/Register ฝั่ง Frontend ด้วย Next.js App Router.

## 📌 Phase 4: Admin Dashboard & Order History (✅ เสร็จเกือบทั้งหมด)
- [x] สร้าง API สำหรับ Admin (CRUD Products & Orders).
- [x] สร้างหน้า Admin Dashboard บน Next.js.
- [x] สร้างระบบจัดการสินค้า (Admin Products).
- [x] สร้างหน้า Order Management เปลี่ยนสถานะได้.
- [x] สร้างระบบจัดการหมวดหมู่สินค้า (Admin Categories).
- [x] สร้างระบบดูประวัติคำสั่งซื้อ (Order History) สำหรับ User ที่ Login แล้ว.
- [x] สร้างระบบติดตามสถานะ Guest Tracking.

## 📌 Phase 5: Security Hardening & Social Login (✅ เสร็จสิ้น)
- [x] สแกนระบบและทำ Security Audit Report.
- [x] อุดช่องโหว่ (Security Hardening) ตามผลรายงาน.
- [x] ตั้งค่า Google Cloud Console (Client ID & Client Secret).
- [x] เชื่อมต่อระบบ Google OAuth ด้วย Laravel Socialite และ Next.js.
- [ ] test report