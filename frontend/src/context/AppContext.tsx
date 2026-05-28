'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { User, CartItem, Product } from '@/types';

type PageType = 'home' | 'menu' | 'auth';
type AuthModeType = 'login' | 'register';

interface AppContextProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  authMode: AuthModeType;
  setAuthMode: (mode: AuthModeType) => void;
  cart: Record<string, number>;
  cartItems: CartItem[];
  totalItemsCount: number;
  totalAmount: number;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  products: Product[];
  
  // Actions
  handleAddToCart: (productId: string) => void;
  handleIncrement: (productId: string) => void;
  handleDecrement: (productId: string) => void;
  handleRemoveItem: (productId: string) => void;
  handleConfirmOrder: () => void;
  handleStartNewOrder: () => void;
  handleMockLogin: (e: React.FormEvent) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [authMode, setAuthMode] = useState<AuthModeType>('login');

  // App State
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Fetch Products from Laravel API
  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const mappedProducts = data.data.map((p: any) => ({
            id: p.id.toString(),
            name: p.name,
            categoryId: p.id,
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

  // --- Cart Handlers ---
  const handleAddToCart = (productId: string) => {
    setCart((prev) => ({ ...prev, [productId]: 1 }));
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
    if (!user) {
      setCurrentPage('auth');
      return;
    }

    try {
      const items = Object.keys(cart).map(id => ({
        product_id: parseInt(id),
        quantity: cart[id]
      }));

      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items, user_id: 1 }) // dummy user_id
      });

      const data = await response.json();
      if (data.status === 'success') {
        setIsModalOpen(true);
      } else {
        alert('Failed to confirm order: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error confirming order');
    }
  };

  const handleStartNewOrder = () => {
    setCart({});
    setIsModalOpen(false);
  };

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: 'usr_1',
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'customer',
    });
    setCurrentPage('menu');
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
        currentPage,
        setCurrentPage,
        authMode,
        setAuthMode,
        cart,
        cartItems,
        totalItemsCount,
        totalAmount,
        isModalOpen,
        setIsModalOpen,
        user,
        setUser,
        products,
        handleAddToCart,
        handleIncrement,
        handleDecrement,
        handleRemoveItem,
        handleConfirmOrder,
        handleStartNewOrder,
        handleMockLogin,
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
