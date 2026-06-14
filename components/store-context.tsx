'use client';
import { createContext, useContext, type ReactNode } from 'react';

interface Store { slug: string; currency: string; name: string; accent: string; }
const Ctx = createContext<Store>({ slug: '', currency: 'NGN', name: 'Store', accent: '#b08968' });

export function StoreProvider({ value, children }: { value: Store; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useStore() { return useContext(Ctx); }
