'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/lib/supabase';

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity: number, unit_type: 'unite' | 'boite') => void;
  removeItem: (productId: string, unit_type: 'unite' | 'boite') => void;
  updateItem: (productId: string, quantity: number, unit_type: 'unite' | 'boite') => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cosmo-cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cosmo-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number, unit_type: 'unite' | 'boite') => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.unit_type === unit_type);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.unit_type === unit_type
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, unit_type }];
    });
  };

const removeItem = (productId: string, unit_type: 'unite' | 'boite') => {
  setItems(prev => prev.filter(i => !(i.product.id === productId && i.unit_type === unit_type)));
};

const updateItem = (productId: string, quantity: number, unit_type: 'unite' | 'boite') => {
  if (quantity <= 0) { removeItem(productId, unit_type); return; }
    setItems(prev =>
      prev.map(i => i.product.id === productId ? { ...i, quantity, unit_type } : i)
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => {
    const price = item.unit_type === 'boite' ? item.product.price_box : item.product.price_unit;
    return sum + price * item.quantity;
  }, 0);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
