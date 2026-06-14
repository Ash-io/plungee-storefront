import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { api, formatPrice } from '@/lib/api';
import { resolveSlug } from '@/lib/store';
import { AddToCart } from '@/components/AddToCart';

export const revalidate = 60;

const strip = (s: string) => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = resolveSlug();
  const p = await api.product(slug, params.slug);
  if (!p) return { title: 'Product not found', robots: { index: false } };
  const desc = strip(p.short_description || p.description).slice(0, 160);
  const img = p.images?.[0]?.src;
  return {
    title: p.name,
    description: desc,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.name, description: desc, type: 'website', images: img ? [img] : [] },
    twitter: { card: 'summary_large_image', title: p.name, description: desc, images: img ? [img] : [] },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const slug = resolveSlug();
  const [store, p] = await Promise.all([api.store(slug), api.product(slug, params.slug)]);
  if (!p) notFound();
  const currency = store?.currency || 'NGN';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: (p.images || []).map((i) => i.src),
    sku: p.sku || undefined,
    description: strip(p.short_description || p.description),
    offers: {
      '@type': 'Offer',
      price: Number(p.price) || 0,
      priceCurrency: currency,
      availability: p.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div>
        <div className="relative aspect-square bg-surface-alt rounded-2xl overflow-hidden border border-line">
          {p.images?.[0]?.src
            ? <Image src={p.images[0].src} alt={p.images[0].alt || p.name} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" priority />
            : <div className="w-full h-full grid place-items-center text-ink-muted">No image</div>}
        </div>
        {p.images && p.images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {p.images.slice(0, 6).map((im, i) => (
              <div key={i} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-line">
                <Image src={im.src} alt={im.alt || p.name} fill sizes="64px" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {p.categories?.[0] && <div className="text-xs uppercase tracking-wide text-ink-muted">{p.categories[0]}</div>}
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-1">{p.name}</h1>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-brand">{formatPrice(p.price, currency)}</span>
          {p.sale_price && p.regular_price && p.sale_price !== p.regular_price && (
            <span className="text-ink-muted line-through">{formatPrice(p.regular_price, currency)}</span>
          )}
        </div>
        <div className="mt-2 text-sm">
          {p.in_stock ? <span className="text-emerald-600">In stock</span> : <span className="text-red-500">Out of stock</span>}
        </div>

        <div className="mt-6">
          <AddToCart item={{ id: p.id, slug: p.slug, name: p.name, price: Number(p.price) || 0, image: p.images?.[0]?.src || null }} />
        </div>

        {(p.short_description || p.description) && (
          <div className="mt-8 prose prose-sm max-w-none text-ink-body"
            dangerouslySetInnerHTML={{ __html: p.short_description || p.description }} />
        )}
      </div>
    </div>
  );
}
