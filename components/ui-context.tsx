'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';

const Ctx = createContext<{
  cartOpen: boolean; openCart: () => void; closeCart: () => void;
  menuOpen: boolean; openMenu: () => void; closeMenu: () => void;
}>({
  cartOpen: false, openCart: () => {}, closeCart: () => {},
  menuOpen: false, openMenu: () => {}, closeMenu: () => {},
});

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Ctx.Provider value={{
      cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
      menuOpen, openMenu: () => setMenuOpen(true), closeMenu: () => setMenuOpen(false)
    }}>
      {children}
    </Ctx.Provider>
  );
}
export function useUI() { return useContext(Ctx); }

// Simple global toast: components call toast(msg); ToastHost renders.
let pushToast: ((m: string) => void) | null = null;
export function toast(msg: string) { pushToast?.(msg); }
export function _registerToast(fn: ((m: string) => void) | null) { pushToast = fn; }
