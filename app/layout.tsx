import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Hanken_Grotesk } from 'next/font/google';
import { api } from '@/lib/api';
import { resolveSlug } from '@/lib/store';
import { CartProvider } from '@/components/cart';
import { StoreProvider } from '@/components/store-context';
import { UIProvider } from '@/components/ui-context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { MenuDrawer } from '@/components/MenuDrawer';
import { ToastHost } from '@/components/Toast';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-cormorant' });
const hanken = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-hanken' });

export async function generateMetadata(): Promise<Metadata> {
  const slug = resolveSlug();
  const store = slug ? await api.store(slug) : null;
  const name = store?.name || 'Plungee Store';
  return {
    title: { default: name, template: `%s · ${name}` },
    description: store?.tagline || `Shop ${name}`,
    openGraph: { title: name, description: store?.tagline || '', type: 'website', siteName: name },
    twitter: { card: 'summary_large_image', title: name, description: store?.tagline || '' },
    robots: store ? { index: true, follow: true } : { index: false, follow: false },
  };
}

const RADII: Record<string, Record<string, string>> = {
  sharp: { '--r-sm': '3px', '--r-md': '4px', '--r-lg': '6px', '--r-xl': '8px', '--r-pill': '8px' },
  round: { '--r-sm': '12px', '--r-md': '16px', '--r-lg': '24px', '--r-xl': '34px', '--r-pill': '999px' },
  soft: {},
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const slug = resolveSlug();
  const store = slug ? await api.store(slug) : null;

  const themeVars: Record<string, string> = {};
  if (store) {
    themeVars['--accent'] = store.accent;
    themeVars['--accent-ink'] = store.accent_ink || '#ffffff';
    if (store.font === 'sans') themeVars['--font-display'] = 'var(--font-hanken)';
    Object.assign(themeVars, RADII[store.radius] || {});
  }

  return (
    <html lang="en" className={`${cormorant.variable} ${hanken.variable}`} data-theme={store?.theme || 'light'}>
      <body style={themeVars as React.CSSProperties}>
        {store ? (
          <StoreProvider value={store}>
            <UIProvider>
              <CartProvider>
                <Header />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
                <CartDrawer />
                <MenuDrawer />
                <ToastHost />
              </CartProvider>
            </UIProvider>
          </StoreProvider>
        ) : (
          <div style={{ maxWidth: 440, margin: '16vh auto', textAlign: 'center', padding: '0 20px' }}>
            <h1 className="display" style={{ fontSize: 32 }}>Store not found</h1>
            <p style={{ color: 'var(--ink-soft)', marginTop: 10 }}>This storefront is not available.</p>
          </div>
        )}
      </body>
    </html>
  );
}
