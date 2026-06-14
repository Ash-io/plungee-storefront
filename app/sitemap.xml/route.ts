import { NextRequest } from 'next/server';
import { api } from '@/lib/api';
import { slugFromHost } from '@/lib/host';

export const revalidate = 600;

export async function GET(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  const base = `${proto}://${host}`;
  const slug = slugFromHost(host);
  const sm = slug ? await api.sitemap(slug) : null;
  const urls = sm?.urls || [];
  const items = urls
    .map((u) => `<url><loc>${base}/products/${u.slug}</loc>${u.updatedAt ? `<lastmod>${new Date(u.updatedAt).toISOString()}</lastmod>` : ''}</url>`)
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}/</loc></url><url><loc>${base}/products</loc></url>${items}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
