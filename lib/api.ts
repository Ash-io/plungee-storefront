const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300';

// Plungee responses are { status, statusCode, message, data }. Unwrap `data`.
async function get(path: string, revalidate = 300) {
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? json;
  } catch {
    return null;
  }
}

export interface StoreMeta {
  slug: string;
  name: string;
  tagline: string;
  logo: string;
  accent: string;
  accent_ink: string;
  currency: string;
  theme: 'light' | 'dark';
  font: 'serif' | 'sans';
  radius: 'sharp' | 'soft' | 'round';
  hero: { style: 'full' | 'split' | 'minimal'; title: string; subtitle: string; cta_label: string; image: string };
  announcement: { enabled: boolean; text: string };
  sections: { trust: boolean; categories: boolean; featured: boolean; editorial: boolean; quote: boolean; newsletter: boolean };
  trust: { label: string }[];
  editorial: { title: string; body: string; image: string; cta_label: string };
  quote: { text: string; author: string };
  social: { instagram: string; tiktok: string; x: string };
  footer: { about: string };
}
export interface ProductCard { id: number; slug: string; name: string; price: string; image: string | null; category: string | null; in_stock: boolean; }
export interface ProductDetail extends ProductCard {
  description: string; short_description: string; regular_price: string; sale_price: string; sku: string;
  images: { src: string; alt: string }[]; categories: string[];
}

export const api = {
  store: (slug: string) => get(`/v3/shop/${slug}`) as Promise<StoreMeta | null>,
  products: (slug: string, qs = '') =>
    get(`/v3/shop/${slug}/products${qs}`) as Promise<{ data: ProductCard[]; meta: any } | null>,
  product: (slug: string, productSlug: string) =>
    get(`/v3/shop/${slug}/products/${productSlug}`) as Promise<ProductDetail | null>,
  categories: (slug: string) => get(`/v3/shop/${slug}/categories`) as Promise<string[] | null>,
  sitemap: (slug: string) => get(`/v3/shop/${slug}/sitemap`, 600) as Promise<{ urls: { slug: string; updatedAt: string }[] } | null>,
  order: (slug: string, id: string) => get(`/v3/shop/${slug}/order/${id}`, 0),
  async createOrder(slug: string, body: any) {
    const res = await fetch(`${BASE}/v3/shop/${slug}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
};

export function formatPrice(amount: string | number, currency = 'NGN') {
  const n = Number(amount) || 0;
  const sym = currency === 'NGN' ? '₦' : '';
  return `${sym}${n.toLocaleString()}`;
}
