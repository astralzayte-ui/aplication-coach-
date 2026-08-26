'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: number, size?: string, color?: string) => void;
  updateQuantity: (productId: number, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('drip_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('drip_cart', JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function addItem(product: Product, quantity = 1, size?: string, color?: string) {
    setItems(prev => {
      const existing = prev.find(i =>
        i.product.id === product.id && i.size === size && i.color === color
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, size, color }];
    });
  }

  function removeItem(productId: number, size?: string, color?: string) {
    setItems(prev => prev.filter(i =>
      !(i.product.id === productId && i.size === size && i.color === color)
    ));
  }

  function updateQuantity(productId: number, quantity: number, size?: string, color?: string) {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    setItems(prev => prev.map(i =>
      i.product.id === productId && i.size === size && i.color === color
        ? { ...i, quantity }
        : i
    ));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
