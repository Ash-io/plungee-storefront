import { headers } from 'next/headers';

// Store slug comes from the subdomain (set by middleware); falls back to
// DEV_STORE_SLUG for local development where there's no subdomain.
export function resolveSlug(): string {
  const s = headers().get('x-store-slug');
  return s || process.env.DEV_STORE_SLUG || '';
}
