import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ProductDetail, ProductListItem } from './types';

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  brandName?: string | null;
  price: number;
  currency: string;
  imageUrl?: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: ProductListItem | ProductDetail, quantity?: number) => void;
  setItemImage: (productId: string, imageUrl: string, brandName?: string | null) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'attractive_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter(item => item.productId && item.name && item.quantity > 0));
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [isHydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      count,
      total,
      addItem(product, quantity = 1) {
        setItems(current => {
          const existing = current.find(item => item.productId === product.id);
          const imageUrl = product.primaryImageUrl || ('images' in product ? product.images?.[0]?.url : null);
          if (existing) {
            return current.map(item => item.productId === product.id ? { ...item, imageUrl: item.imageUrl || imageUrl, quantity: item.quantity + quantity } : item);
          }
          return [...current, { productId: product.id, slug: product.slug, name: product.name, brandName: product.brandName, price: product.price, currency: product.currency, imageUrl, quantity }];
        });
      },
      setItemImage(productId, imageUrl, brandName) {
        setItems(current => current.map(item => item.productId === productId ? { ...item, imageUrl: item.imageUrl || imageUrl, brandName: item.brandName || brandName } : item));
      },
      updateQuantity(productId, quantity) {
        if (quantity <= 0) {
          setItems(current => current.filter(item => item.productId !== productId));
          return;
        }
        setItems(current => current.map(item => item.productId === productId ? { ...item, quantity } : item));
      },
      removeItem(productId) {
        setItems(current => current.filter(item => item.productId !== productId));
      },
      clearCart() {
        setItems([]);
      }
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside CartProvider');
  return value;
}
