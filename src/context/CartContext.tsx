import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { CartItem, Product } from "../types";
interface CartCtx { items: CartItem[]; add: (p: Product, storeName: string) => void; remove: (id: string) => void; setQty: (id: string, qty: number) => void; clear: () => void; total: number; count: number; storeId: string | null; }
const Ctx = createContext<CartCtx>({} as CartCtx);
const KEY = "nuwafra_cart";
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { const raw = localStorage.getItem(KEY); if (raw) try { setItems(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);
  const add: CartCtx["add"] = (p, storeName) => {
    setItems(prev => {
      if (prev.length > 0 && prev[0].store_id !== p.store_id) {
        if (!confirm("سيتم إفراغ السلة لأنها من متجر آخر. متابعة؟")) return prev;
        return [{ product: p, quantity: 1, store_id: p.store_id, store_name: storeName }];
      }
      const ex = prev.find(i => i.product.id === p.id);
      if (ex) return prev.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product: p, quantity: 1, store_id: p.store_id, store_name: storeName }];
    });
  };
  const remove = (id: string) => setItems(prev => prev.filter(i => i.product.id !== id));
  const setQty = (id: string, qty: number) => setItems(prev => qty <= 0 ? prev.filter(i => i.product.id !== id) : prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + (i.product.discount_price || i.product.price) * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const storeId = items[0]?.store_id ?? null;
  return <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count, storeId }}>{children}</Ctx.Provider>;
}
export const useCart = () => useContext(Ctx);