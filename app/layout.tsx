import './globals.css';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { resolveSlug } from '@/lib/store';
import { CartProvider } from '@/components/cart';
import { StoreProvider } from '@/components/store-context';
import { Header } from '@/components/Header';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const slug = resolveSlug();
  const store = slug ? await api.store(slug) : null;
  const name = store?.name || 'Store';

  return (
    <html lang="en">
      <body>
        {store ? (
          <StoreProvider slug={store.slug} currency={store.currency}>
            <CartProvider>
              <Header storeName={name} />
              <main className="max-w-6xl mx-auto px-5 py-8 min-h-[70vh]">{children}</main>
              <footer className="border-t border-line mt-16">
                <div className="max-w-6xl mx-auto px-5 py-8 text-sm text-ink-muted flex flex-col sm:flex-row gap-2 justify-between">
                  <span>© {new Date().getFullYear()} {name}</span>
                  <span>Powered by Plungee</span>
                </div>
              </footer>
            </CartProvider>
          </StoreProvider>
        ) : (
          <div className="max-w-md mx-auto px-5 py-24 text-center">
            <h1 className="text-xl font-bold text-ink">Store not found</h1>
            <p className="text-ink-muted mt-2">This storefront is not available.</p>
          </div>
        )}
      </body>
    </html>
  );
}
