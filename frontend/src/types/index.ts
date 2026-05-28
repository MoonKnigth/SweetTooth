export type Role = 'admin' | 'customer';
export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: Role;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  categoryId: number;
  categoryName: string; // ได้จากการ Join ตอนดึง API
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
}

// สำหรับ State ตะกร้าสินค้าใน Zustand หรือ Context
export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}
