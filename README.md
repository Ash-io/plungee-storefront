# Plungee Storefront

SEO-first hosted storefront for Plungee retailers who don't have their own store.
Next.js (App Router, SSR/ISR). Each retailer is a subdomain (`{slug}.<root-domain>`);
the middleware maps the subdomain to a store slug and pages read it server-side.

## SEO
- Per-page `generateMetadata` (title/description/OpenGraph/Twitter)
- JSON-LD `Product` schema on product pages
- Per-store `sitemap.xml` + `robots.txt` (host-aware route handlers)
- SSR + ISR (`revalidate`) so pages are crawlable and fast

## Pages
home, `/products` (catalog: search, category, pagination), `/products/[slug]`
(SSR + JSON-LD), `/cart`, `/checkout` (places order via Plungee Pay bank transfer),
`/order/[id]` (confirmation + transfer instructions).

## Run
```bash
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL, NEXT_PUBLIC_ROOT_DOMAIN, DEV_STORE_SLUG
npm install
npm run dev
```
Locally there's no subdomain, so `DEV_STORE_SLUG` selects which store to render.

## Deploy
Vercel/Railway. Set `NEXT_PUBLIC_API_URL` (Plungee backend), `NEXT_PUBLIC_ROOT_DOMAIN`
(e.g. `shopplungee.com`), and a wildcard DNS `*.shopplungee.com` -> the deployment.
