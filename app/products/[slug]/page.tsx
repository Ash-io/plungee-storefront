import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { resolveSlug } from '@/lib/store';
import { ProductDetail } from '@/components/ProductDetail';

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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={p} currency={currency} />
    </>
  );
}
