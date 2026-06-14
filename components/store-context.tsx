'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { StoreMeta } from '@/lib/api';

const Ctx = createContext<StoreMeta | null>(null);

export function StoreProvider({ value, children }: { value: StoreMeta; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useStore(): StoreMeta {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used within StoreProvider');
  return s;
}
