import Link from 'next/link';
import { api } from '@/lib/api';
import { resolveSlug } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';

export const revalidate = 60;

export default async function HomePage() {
  const slug = resolveSlug();
  const [store, productsRes, categories] = await Promise.all([
    api.store(slug),
    api.products(slug, '?per_page=8'),
    api.categories(slug),
  ]);
  const products = productsRes?.data || [];
  const currency = store?.currency || 'NGN';

  return (
    <div className="space-y-12">
      <section className="text-center py-10 sm:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-ink tracking-tight">{store?.name || 'Welcome'}</h1>
        {store?.tagline && <p className="mt-4 text-lg text-ink-body max-w-2xl mx-auto">{store.tagline}</p>}
        <Link href="/products" className="inline-block mt-7 px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover transition-colors">
          Browse products
        </Link>
      </section>

      {categories && categories.length > 0 && (
        <section className="flex flex-wrap justify-center gap-2">
          {categories.slice(0, 12).map((c) => (
            <Link key={c} href={`/products?category=${encodeURIComponent(c)}`}
              className="px-4 py-2 rounded-full bg-surface border border-line text-sm text-ink-body hover:border-brand hover:text-brand transition-colors">
              {c}
            </Link>
          ))}
        </section>
      )}

      {products.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-ink">Featured</h2>
            <Link href="/products" className="text-sm font-medium text-brand">View all</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} p={p} currency={currency} />)}
          </div>
        </section>
      )}
    </div>
  );
}
