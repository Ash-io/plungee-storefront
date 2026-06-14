'use client';
import Link from 'next/link';
import { useCart } from './cart';

export function Header({ storeName }: { storeName: string }) {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-ink tracking-tight">{storeName}</Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-ink-muted">
          <Link href="/products" className="hover:text-ink">Shop</Link>
          <Link href="/cart" className="relative hover:text-ink">
            Cart
            {count > 0 && (
              <span className="absolute -right-4 -top-2 bg-brand text-white text-[11px] rounded-full px-1.5 py-0.5 font-semibold">{count}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
