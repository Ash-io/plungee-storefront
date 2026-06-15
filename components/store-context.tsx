'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { StoreMeta } from '@/lib/api';

const Ctx = createContext<StoreMeta | null>(null);

export function StoreProvider({ value: initialValue, children }: { value: StoreMeta; children: ReactNode }) {
  const [store, setStore] = useState<StoreMeta>(initialValue);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'plungee-preview') {
        const previewConfig = e.data.config;
        setStore((prev) => {
          const merged = { ...prev, ...previewConfig };

          // Apply preview visual settings to document/body
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', merged.theme || 'light');
            
            const RADII: Record<string, Record<string, string>> = {
              sharp: { '--r-sm': '3px', '--r-md': '4px', '--r-lg': '6px', '--r-xl': '8px', '--r-pill': '8px' },
              round: { '--r-sm': '12px', '--r-md': '16px', '--r-lg': '24px', '--r-xl': '34px', '--r-pill': '999px' },
              soft: { '--r-sm': '8px', '--r-md': '12px', '--r-lg': '18px', '--r-xl': '26px', '--r-pill': '999px' },
            };
            const radiusVars = RADII[merged.radius] || RADII.soft;
            
            const body = document.body;
            body.style.setProperty('--accent', merged.accent);
            body.style.setProperty('--accent-ink', merged.accent_ink || '#ffffff');
            if (merged.font === 'sans') {
              body.style.setProperty('--font-display', 'var(--font-hanken)');
            } else {
              body.style.setProperty('--font-display', 'var(--font-cormorant), Georgia, serif');
            }
            
            for (const [k, v] of Object.entries(radiusVars)) {
              body.style.setProperty(k, v);
            }
          }
          return merged;
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    setStore(initialValue);
  }, [initialValue]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): StoreMeta {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used within StoreProvider');
  return s;
}
