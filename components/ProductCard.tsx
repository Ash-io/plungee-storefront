import Link from 'next/link';
import Image from 'next/image';
import { type ProductCard as P, formatPrice } from '@/lib/api';

export function ProductCard({ p, currency }: { p: P; currency: string }) {
  return (
    <Link href={`/products/${p.slug}`} className="group block bg-surface rounded-2xl border border-line overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-surface-alt">
        {p.image ? (
          <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-ink-muted text-sm">No image</div>
        )}
        {!p.in_stock && (
          <span className="absolute top-2 left-2 bg-ink/80 text-white text-[11px] px-2 py-0.5 rounded-full">Out of stock</span>
        )}
      </div>
      <div className="p-3">
        {p.category && <div className="text-[11px] uppercase tracking-wide text-ink-muted">{p.category}</div>}
        <h3 className="text-sm font-medium text-ink line-clamp-2 mt-0.5">{p.name}</h3>
        <div className="mt-1.5 font-semibold text-brand">{formatPrice(p.price, currency)}</div>
      </div>
    </Link>
  );
}
