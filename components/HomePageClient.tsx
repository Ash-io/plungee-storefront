'use client';
import Link from 'next/link';
import { useStore } from './store-context';
import { ProductCard } from './ProductCard';
import { Media, Ph } from './Ph';
import { I } from './icons';
import type { ProductCard as P } from '@/lib/api';

const TRUST_ICONS = [<I.truck key="t" />, <I.refresh key="r" />, <I.shield key="s" />, <I.leaf key="l" />];

export function HomePageClient({
  initialProducts,
  initialCategories,
}: {
  initialProducts: P[];
  initialCategories: string[];
}) {
  const store = useStore();
  const currency = store.currency || 'NGN';
  const sections = store.sections;
  const hero = store.hero;

  const heroArt = hero?.image
    ? { image: hero.image, name: store.name || 'store', id: 0 }
    : initialProducts.find((p) => p.image) || initialProducts[0];

  const heroStyle = hero?.style || 'full';
  const heroTitle = hero?.title || 'Carry something worth keeping.';
  const heroSub = hero?.subtitle || 'A considered edit, curated and delivered.';
  const heroCta = hero?.cta_label || 'Shop the collection';
  const heroKicker = store.tagline || 'New collection';

  const heroMedia = heroArt
    ? <Media src={heroArt.image} alt={heroArt.name} seed={heroArt.id} />
    : <Ph seed={store.name || 'store'} label={store.name || 'S'} mono={false} style={{ position: 'absolute', inset: 0 }} />;

  const heroCopy = (
    <div className="hero-copy">
      <p className="eyebrow hero-kicker">{heroKicker}</p>
      <h1 className="display hero-h1">{heroTitle}</h1>
      <p className="hero-sub">{heroSub}</p>
      <div className="hero-cta">
        <Link href="/products" className="btn btn-primary btn-lg">{heroCta} <I.arrow /></Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Hero */}
      <div className="container">
        {heroStyle === 'split' ? (
          <div className="hero hero-split">
            {heroCopy}
            <div className="ph hero-art">{heroMedia}</div>
          </div>
        ) : heroStyle === 'minimal' ? (
          <div className="hero hero-min">
            {heroCopy}
          </div>
        ) : (
          <div className="hero hero-full">
            {heroMedia}
            <div className="hero-veil" />
            {heroCopy}
          </div>
        )}
      </div>

      {/* Trust row */}
      {sections?.trust && store.trust && store.trust.length > 0 && (
        <div className="trust"><div className="container trust-inner">
          {store.trust.map((t, i) => (
            <div className="trust-item" key={i}>{TRUST_ICONS[i % TRUST_ICONS.length]}<span>{t.label}</span></div>
          ))}
        </div></div>
      )}

      {/* Categories */}
      {sections?.categories && initialCategories && initialCategories.length > 0 && (
        <section className="section container">
          <div className="section-head">
            <div>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Shop by category</p>
              <h2 className="section-title display">Find your edit.</h2>
            </div>
            <Link href="/products" className="link-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>View all <I.arrowUpRight /></Link>
          </div>
          <div className="cat-grid">
            {initialCategories.slice(0, 5).map((cat) => (
              <Link key={cat} className="cat-card" href={`/products?category=${encodeURIComponent(cat)}`}>
                <Ph seed={cat} label={cat} mono={false} style={{ position: 'absolute', inset: 0 }} />
                <div className="cat-name"><span>{cat}</span><I.arrowUpRight /></div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {sections?.featured && initialProducts.length > 0 && (
        <section className="section container">
          <div className="section-head">
            <div>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Just landed</p>
              <h2 className="section-title display">New arrivals.</h2>
            </div>
            <Link href="/products" className="link-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>View all <I.arrowUpRight /></Link>
          </div>
          <div className="product-grid">
            {initialProducts.map((p) => <ProductCard key={p.id} p={p} currency={currency} />)}
          </div>
        </section>
      )}

      {/* Editorial band */}
      {sections?.editorial && store.editorial && (store.editorial.title || store.editorial.body) && (
        <section className="section container">
          <div className="editorial">
            <div className="editorial-media">
              {store.editorial.image
                ? <Media src={store.editorial.image} alt={store.editorial.title} seed={1} />
                : <Ph seed={store.editorial.title || 'editorial'} label="" mono={false} style={{ position: 'absolute', inset: 0 }} />}
            </div>
            <div className="editorial-copy">
              <h2 className="display">{store.editorial.title}</h2>
              <p>{store.editorial.body}</p>
              {store.editorial.cta_label && (
                <Link href="/products" className="btn btn-ink">{store.editorial.cta_label} <I.arrow /></Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Quote */}
      {sections?.quote && store.quote && store.quote.text && (
        <section className="section">
          <div className="container" style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <blockquote className="display" style={{ fontSize: 'clamp(26px,3.4vw,40px)', lineHeight: 1.28, color: 'var(--ink)' }}>
              &ldquo;{store.quote.text}&rdquo;
            </blockquote>
            <p style={{ color: 'var(--ink-faint)', marginTop: 20, fontSize: 14, letterSpacing: '.04em' }}>{(store.quote.author || 'VERIFIED BUYER').toUpperCase()}</p>
          </div>
        </section>
      )}
    </>
  );
}
