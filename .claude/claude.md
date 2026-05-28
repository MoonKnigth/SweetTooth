# Project Overview: SweetTooth (Product List with Cart)
โปรเจกต์นี้คือระบบร้านขนมหวานออนไลน์ แบ่งโครงสร้างเป็น Monorepo (Frontend และ Backend)

## Directory Structure
1. **/frontend:** โปรเจกต์ Next.js (App Router)
2. **/backend:** โปรเจกต์ Laravel 11

## Tech Stack Rules
1. **Frontend:** ใช้ Next.js (App Router), React, TypeScript, และ Tailwind CSS
2. **Backend:** ใช้ Laravel 11 สร้าง REST API พร้อมระบบ Authentication (Sanctum) และใช้ฐานข้อมูล PostgreSQL
3. **Package Manager:** ฝั่ง Frontend บังคับใช้ `pnpm` ฝั่ง Backend ใช้ `composer` และ `php artisan`
4. **Data Models:** โครงสร้าง Database ยึดตาม Migration/ER Diagram และฝั่ง Frontend ยึดตาม TypeScript Interfaces
