'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { User, CartItem, Product } from '@/types';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';


interface AppContextProps {
  cart: Record<string, number>;
  cartItems: CartItem[];
  totalItemsCount: number;
  totalAmount: number;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  lastOrderId: string | null;
  user: User | null;
  token: string | null;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  handleAddToCart: (productId: string) => void;
  handleIncrement: (productId: string) => void;
  handleDecrement: (productId: string) => void;
  handleRemoveItem: (productId: string) => void;
  handleConfirmOrder: () => void;
  handleStartNewOrder: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {

  // App State
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Auto Login
  useEffect(() => {
    // 🔒 อ่าน Token จาก Cookie แทน localStorage เพื่อความปลอดภัยจากบางช่องทาง
    const savedToken = Cookies.get('access_token');
    
    if (savedToken) {
      setTimeout(() => setToken(savedToken), 0);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${savedToken}`,
          'Accept': 'application/json'
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Unauthorized');
      })
      .then(data => {
        if (data && data.data) {
          setUser(data.data);
        }
      })
      .catch(() => {
        // Invalid token
        Cookies.remove('access_token');
        setToken(null);
        setUser(null);
      });
    }
  }, []);

  // Fetch Products
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          interface ApiProduct {
            id: string;
            name: string;
            category_id: number;
            category: string;
            price: string;
            image_thumbnail: string;
            isActive: boolean;
          }
          const mappedProducts = data.data.map((p: ApiProduct) => ({
            id: p.id,
            name: p.name,
            categoryId: p.category_id,
            categoryName: p.category,
            price: parseFloat(p.price),
            imageUrl: p.image_thumbnail,
            isActive: p.isActive
          }));
          setProducts(mappedProducts);
        }
      })
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  // --- Auth Handlers ---
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.status === 'success' && data.data) {
        setToken(data.data.access_token);
        setUser(data.data.user);
        // 🔒 บันทึก Cookie แบบ Secure และ SameSite ป้องกัน CSRF
        Cookies.set('access_token', data.data.access_token, { 
          expires: 7, // 7 วัน
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict' 
        });
        toast.success('Logged in successfully!');
        return true;
      }
      toast.error(data.message || 'Invalid credentials');
      return false;
    } catch (err) {
      console.error(err);
      toast.error('Connection error');
      return false;
    }
  };

  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (data.status === 'success' && data.data) {
        setToken(data.data.access_token);
        setUser(data.data.user);
        Cookies.set('access_token', data.data.access_token, { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict' 
        });
        toast.success('Registered successfully!');
        return true;
      }
      toast.error(data.message || 'Registration failed');
      return false;
    } catch (err) {
      console.error(err);
      toast.error('Connection error');
      return false;
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }
    setToken(null);
    setUser(null);
    Cookies.remove('access_token');
    toast.info('You have been logged out.');
  };

  // --- Cart Handlers ---
  const handleAddToCart = (productId: string) => {
    setCart((prev) => ({ ...prev, [productId]: 1 }));
    toast.success('Added to cart!');
  };

  const handleIncrement = (productId: string) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const handleDecrement = (productId: string) => {
    setCart((prev) => {
      const currentQty = prev[productId] || 0;
      const newQty = currentQty - 1;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const handleConfirmOrder = async () => {
    try {
      const items = Object.keys(cart).map(id => ({
        product_id: id, // It's UUID now
        quantity: cart[id]
      }));

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ items })
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success('Order confirmed successfully! 🎉');
        if (data.data && data.data.orderId) {
          setLastOrderId(data.data.orderId);
        }
        setIsModalOpen(true);
      } else {
        toast.error('Failed to confirm order: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      toast.error('Error confirming order');
    }
  };

  const handleStartNewOrder = () => {
    setCart({});
    setIsModalOpen(false);
    setLastOrderId(null);
  };

  // --- Derived State ---
  const cartItems = useMemo(() => {
    return Object.keys(cart).map((id) => {
      const product = products.find((p) => p.id === id);
      if (!product) {
        return {
          id,
          categoryId: 0,
          categoryName: 'Unknown',
          name: 'Unknown Item',
          price: 0,
          imageUrl: '',
          isActive: false,
          quantity: cart[id],
        };
      }
      return {
        ...product,
        quantity: cart[id],
      };
    });
  }, [cart, products]);

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <AppContext.Provider
      value={{
        cart,
        cartItems,
        totalItemsCount,
        totalAmount,
        isModalOpen,
        setIsModalOpen,
        lastOrderId,
        user,
        token,
        products,
        setProducts,
        login,
        registerUser,
        logout,
        handleAddToCart,
        handleIncrement,
        handleDecrement,
        handleRemoveItem,
        handleConfirmOrder,
        handleStartNewOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
