import Link from 'next/link';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { resolveSlug } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { I } from '@/components/icons';

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
  const meta = res?.meta || { pages: 1, total: products.length };
  const currency = store?.currency || 'NGN';
  const title = category || (q ? `“${q}”` : 'All products');

  const hrefFor = (p: number) => {
    const u = new URLSearchParams();
    if (q) u.set('q', q);
    if (category) u.set('category', category);
    if (p > 1) u.set('page', String(p));
    const s = u.toString();
    return s ? `/products?${s}` : '/products';
  };

  return (
    <div className="container">
      <div className="listing-head">
        <div className="crumbs">
          <Link href="/">Home</Link><span>/</span>
          {category ? <><Link href="/products">Shop</Link><span>/</span><span style={{ color: 'var(--ink)' }}>{category}</span></> : <span style={{ color: 'var(--ink)' }}>Shop</span>}
        </div>
        <h1 className="display">{title}</h1>
        <p style={{ color: 'var(--ink-soft)', marginTop: 10, maxWidth: '52ch' }}>
          The full collection, curated and ready to ship.
        </p>
      </div>

      <div className="toolbar">
        <div className="filter-row">
          <Link href="/products" className={'chip' + (!category ? ' is-active' : '')}>All</Link>
          {(categories || []).map((c) => (
            <Link key={c} href={`/products?category=${encodeURIComponent(c)}`} className={'chip' + (category === c ? ' is-active' : '')}>{c}</Link>
          ))}
        </div>
        <div className="toolbar-right">
          <span className="result-count">{meta.total} item{meta.total === 1 ? '' : 's'}</span>
        </div>
      </div>

      <section className="section-sm" style={{ paddingTop: 32 }}>
        {products.length === 0 ? (
          <div className="empty-state"><I.bag width="56" height="56" /><h4>Nothing here yet</h4><p>Try another category.</p></div>
        ) : (
          <div className="product-grid">
            {products.map((p) => <ProductCard key={p.id} p={p} currency={currency} />)}
          </div>
        )}
      </section>

      {meta.pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 60 }}>
          {page > 1 && <Link href={hrefFor(page - 1)} className="btn btn-outline btn-sm">Prev</Link>}
          <span className="result-count">Page {page} of {meta.pages}</span>
          {page < meta.pages && <Link href={hrefFor(page + 1)} className="btn btn-outline btn-sm">Next</Link>}
        </div>
      )}
    </div>
  );
}
