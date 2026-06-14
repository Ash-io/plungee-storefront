import Link from 'next/link';
import { api } from '@/lib/api';
import { resolveSlug } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { Media, Ph } from '@/components/Ph';
import { I } from '@/components/icons';

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
  const heroArt = products.find((p) => p.image) || products[0];

  return (
    <>
      {/* Hero — full-bleed editorial */}
      <div className="container">
        <div className="hero hero-full">
          {heroArt
            ? <Media src={heroArt.image} alt={heroArt.name} seed={heroArt.id} />
            : <Ph seed={store?.name || 'store'} label={store?.name || 'S'} mono={false} style={{ position: 'absolute', inset: 0 }} />}
          <div className="hero-veil" />
          <div className="hero-copy">
            <p className="eyebrow hero-kicker">{store?.tagline || 'New collection'}</p>
            <h1 className="display hero-h1">Carry something<br />worth keeping.</h1>
            <p className="hero-sub">A considered edit, curated and delivered. Designed for the everyday and the occasion alike.</p>
            <div className="hero-cta">
              <Link href="/products" className="btn btn-primary btn-lg">Shop the collection <I.arrow /></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust row */}
      <div className="trust"><div className="container trust-inner">
        {[[<I.truck key="t" />, 'Fast nationwide delivery'], [<I.refresh key="r" />, 'Easy returns'], [<I.shield key="s" />, 'Buyer protection'], [<I.leaf key="l" />, 'Carefully sourced']].map(([icon, label], i) => (
          <div className="trust-item" key={i}>{icon}<span>{label as string}</span></div>
        ))}
      </div></div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="section container">
          <div className="section-head">
            <div>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Shop by category</p>
              <h2 className="section-title display">Find your edit.</h2>
            </div>
            <Link href="/products" className="link-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>View all <I.arrowUpRight /></Link>
          </div>
          <div className="cat-grid">
            {categories.slice(0, 5).map((cat) => (
              <Link key={cat} className="cat-card" href={`/products?category=${encodeURIComponent(cat)}`}>
                <Ph seed={cat} label={cat} mono={false} style={{ position: 'absolute', inset: 0 }} />
                <div className="cat-name"><span>{cat}</span><I.arrowUpRight /></div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {products.length > 0 && (
        <section className="section container">
          <div className="section-head">
            <div>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Just landed</p>
              <h2 className="section-title display">New arrivals.</h2>
            </div>
            <Link href="/products" className="link-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>View all <I.arrowUpRight /></Link>
          </div>
          <div className="product-grid">
            {products.map((p) => <ProductCard key={p.id} p={p} currency={currency} />)}
          </div>
        </section>
      )}

      {/* Quote */}
      <section className="section">
        <div className="container" style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <blockquote className="display" style={{ fontSize: 'clamp(26px,3.4vw,40px)', lineHeight: 1.28, color: 'var(--ink)' }}>
            &ldquo;Exactly as pictured, beautifully packaged, and it arrived fast. I&rsquo;ll be back.&rdquo;
          </blockquote>
          <p style={{ color: 'var(--ink-faint)', marginTop: 20, fontSize: 14, letterSpacing: '.04em' }}>VERIFIED BUYER</p>
        </div>
      </section>
    </>
  );
}
