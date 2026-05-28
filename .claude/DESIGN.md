Product List with Cart - UI/UX Concept & Design System

เอกสารนี้รวบรวมแนวคิดการออกแบบ (Design System) ที่แกะมาจากภาพ UI ต้นฉบับ เพื่อใช้เป็นมาตรฐานในการพัฒนาแอปพลิเคชัน

1. Color Palette (โทนสี)

การใช้สีเน้นความรู้สึกอบอุ่น น่าทาน (Warm & Appetizing) สื่อถึงขนมหวานและเบเกอรี่

Background (พื้นหลัง): #fcf8f6 (สีชมพู/ส้มอ่อนๆ สบายตา)

Primary Text (ข้อความหลัก): #260f08 (สีน้ำตาลเข้ม ชัดเจนแต่อ่อนโยนกว่าสีดำ)

Secondary Text (ข้อความรอง/หมวดหมู่): #87635a (สีน้ำตาลเทา)

Brand / Action / Price (ปุ่มกดและราคา): #c73b0f (สีส้มอิฐ/แดงสนิม ดึงดูดสายตา)

Card Background (พื้นหลังการ์ด/ตะกร้า): #ffffff (สีขาว เพื่อสร้างคอนทราสต์ให้คอนเทนต์ลอยเด่นขึ้นมา)

Success (สถานะสำเร็จ): #1ea575 (สีเขียว สำหรับไอคอนเครื่องหมายถูก)

2. Typography (ฟอนต์)

Headings: ฟอนต์ตระกูล Sans-serif ตัวหนา (เช่น Poppins, Montserrat หรือฟอนต์ระบบ) ใช้สำหรับชื่อหน้า "Desserts", "Your Cart"

Body Text: ฟอนต์ Sans-serif น้ำหนักปกติ (เช่น Inter, Roboto) สำหรับชื่อสินค้า รายละเอียด และราคา

3. UI Components (ส่วนประกอบหน้าจอ)

3.1 Product Card (การ์ดสินค้า)

Image: ภาพสัดส่วน 1:1 มุมโค้ง (Rounded)

State ปกติ: ไม่มีขอบ

State เลือกแล้ว (In Cart): มีขอบสี #c73b0f (ส้มอิฐ)

Action Button (ตำแหน่งทับขอบล่างของภาพ):

Add to Cart: พื้นหลังขาว, ขอบเทาอ่อน, ไอคอนตะกร้า + ข้อความ "Add to Cart"

Quantity Selector: พื้นหลังสี #c73b0f, ไอคอน -, ตัวเลขจำนวน, ไอคอน + สีขาว

Text Info: ชื่อหมวดหมู่ (เล็ก/สีเทา), ชื่อสินค้า (หนา/สีน้ำตาลเข้ม), ราคา (สีส้มอิฐ)

3.2 Shopping Cart (ตะกร้าสินค้า)

Container: กล่องสีขาวมุมโค้ง มีเงาอ่อนๆ (Drop shadow)

Header: "Your Cart (X)" สีส้มอิฐ

Empty State: ภาพ Illustration เค้กถูกตัด พร้อมข้อความ "Your added items will appear here"

Filled State:

List สินค้า: ชื่อสินค้า, จำนวน (1x สีส้ม), ราคาต่อชิ้น, ราคารวม, ปุ่ม x ลบสินค้า

Order Total: แสดงราคารวมตัวหนาขนาดใหญ่

Banner: Carbon-neutral delivery (พื้นหลังเทาอ่อน ไอคอนต้นไม้สีเขียว)

Button: "Confirm Order" ปุ่มกว้างเต็มพื้นที่ สีส้มอิฐ

3.3 Order Confirmed Modal (ป๊อปอัปยืนยันคำสั่งซื้อ)

Overlay: สีดำโปร่งแสง 50% (Dimmed background)

Modal Box: กล่องสีขาว แสดงอยู่กลางจอ

Header: ไอคอนวงกลมเครื่องหมายถูกสีเขียว, ข้อความ "Order Confirmed", ข้อความรอง "We hope you enjoy your food!"

Order Summary Box: กล่องพื้นหลังสีส้มอ่อนมาก แสดงรายการสินค้าที่ซื้อ (มีรูป Thumbnail ขนาดเล็ก) และยอดรวม (Order Total)

Button: "Start New Order" ปุ่มสีส้มอิฐเพื่อรีเซ็ตระบบ