'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { User, CartItem, Product } from '@/types';
import { toast } from 'react-toastify';


interface AppContextProps {
  cart: Record<string, number>;
  cartItems: CartItem[];
  totalItemsCount: number;
  totalAmount: number;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  user: User | null;
  token: string | null;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  
  // Actions
  login: (token: string, user: User) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Auto Login
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      setToken(savedToken);
      fetch('http://localhost:8000/api/user', {
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
        if (data && data.id) {
          setUser(data);
        }
      })
      .catch(() => {
        // Invalid token
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
      });
    }
  }, []);

  // Fetch Products
  useEffect(() => {
    fetch('http://localhost:8000/api/products')
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
  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('access_token', newToken);
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('http://localhost:8000/api/logout', {
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
    localStorage.removeItem('access_token');
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

      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({ items, user_id: user ? user.id : null })
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success('Order confirmed successfully! 🎉');
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
        user,
        token,
        products,
        setProducts,
        login,
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
