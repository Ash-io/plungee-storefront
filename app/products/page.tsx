import Link from 'next/link';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { resolveSlug } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Shop' };

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string; category?: string };
}) {
  const slug = resolveSlug();
  const page = Number(searchParams.page) || 1;
  const q = searchParams.q || '';
  const category = searchParams.category || '';

  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('per_page', '24');
  if (q) qs.set('search', q);
  if (category) qs.set('category', category);

  const [store, res, categories] = await Promise.all([
    api.store(slug),
    api.products(slug, `?${qs.toString()}`),
    api.categories(slug),
  ]);
  const products = res?.data || [];
  const meta = res?.meta || { pages: 1, current_page: 1 };
  const currency = store?.currency || 'NGN';

  const pageHref = (p: number) => {
    const u = new URLSearchParams();
    if (q) u.set('q', q);
    if (category) u.set('category', category);
    if (p > 1) u.set('page', String(p));
    const s = u.toString();
    return s ? `/products?${s}` : '/products';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-ink">Shop</h1>
        <form action="/products" className="w-full sm:w-72">
          <input name="q" defaultValue={q} placeholder="Search products…"
            className="w-full px-4 py-2.5 text-sm bg-surface border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30" />
        </form>
      </div>

      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/products" className={`px-3 py-1.5 rounded-full text-sm border ${!category ? 'bg-brand text-white border-brand' : 'bg-surface border-line text-ink-body'}`}>All</Link>
          {categories.map((c) => (
            <Link key={c} href={`/products?category=${encodeURIComponent(c)}`}
              className={`px-3 py-1.5 rounded-full text-sm border ${category === c ? 'bg-brand text-white border-brand' : 'bg-surface border-line text-ink-body hover:border-brand'}`}>
              {c}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-ink-muted py-16 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} p={p} currency={currency} />)}
        </div>
      )}

      {meta.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          {page > 1 && <Link href={pageHref(page - 1)} className="px-4 py-2 rounded-lg border border-line text-sm">Prev</Link>}
          <span className="text-sm text-ink-muted">Page {page} of {meta.pages}</span>
          {page < meta.pages && <Link href={pageHref(page + 1)} className="px-4 py-2 rounded-lg border border-line text-sm">Next</Link>}
        </div>
      )}
    </div>
  );
}
