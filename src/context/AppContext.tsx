'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { User, CartItem } from '@/types';
import { mockProducts } from '@/data/mockData';

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
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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

  const handleConfirmOrder = () => {
    if (!user) {
      setCurrentPage('auth');
      return;
    }
    setIsModalOpen(true);
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
      const product = mockProducts.find((p) => p.id === id);
      if (!product) {
        // Safe fallback in case of mismatch
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
  }, [cart]);

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
