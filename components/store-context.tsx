'use client';
import { createContext, useContext, type ReactNode } from 'react';

const Ctx = createContext<{ slug: string; currency: string }>({ slug: '', currency: 'NGN' });

export function StoreProvider({ slug, currency, children }: { slug: string; currency: string; children: ReactNode }) {
  return <Ctx.Provider value={{ slug, currency }}>{children}</Ctx.Provider>;
}
export function useStore() { return useContext(Ctx); }
