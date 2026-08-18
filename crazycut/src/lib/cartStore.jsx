import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'ccp_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const s = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = (fabric, quantity = 1, garment_type = null) => {
    const key = fabric.id + (garment_type ? `::${garment_type}` : '');
    setItems(prev => {
      const idx = prev.findIndex(i => i.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, {
        key, fabric_id: fabric.id, fabric_name: fabric.name, brand: fabric.brand, price: fabric.price,
        quantity, garment_type, image_url: fabric.image_url
      }];
    });
    setOpen(true);
  };

  const updateQty = (key, quantity) =>
    setItems(prev => quantity <= 0 ? prev.filter(i => i.key !== key) : prev.map(i => i.key === key ? { ...i, quantity } : i));

  const removeItem = (key) => setItems(prev => prev.filter(i => i.key !== key));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, open, setOpen, addItem, updateQty, removeItem, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);