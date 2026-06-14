import { NextRequest, NextResponse } from 'next/server';

// Map subdomain -> store slug, exposed to server components via x-store-slug.
export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').split(':')[0];
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN || '';
  let slug = '';
  if (root && host.endsWith(root)) {
    const sub = host.slice(0, host.length - root.length).replace(/\.$/, '');
    if (sub && sub !== 'www') slug = sub;
  }
  const requestHeaders = new Headers(req.headers);
  if (slug) requestHeaders.set('x-store-slug', slug);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
