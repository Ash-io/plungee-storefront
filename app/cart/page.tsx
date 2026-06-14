'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/cart';
import { useStore } from '@/components/store-context';
import { formatPrice } from '@/lib/api';

export default function CartPage() {
  const { items, setQty, remove, total } = useCart();
  const { currency } = useStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold text-ink">Your cart is empty</h1>
        <Link href="/products" className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-brand text-white font-semibold">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-ink mb-2">Cart</h1>
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-4 bg-surface border border-line rounded-2xl p-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-alt shrink-0">
              {it.image && <Image src={it.image} alt={it.name} fill sizes="64px" className="object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink line-clamp-1">{it.name}</div>
              <div className="text-brand font-semibold text-sm">{formatPrice(it.price, currency)}</div>
            </div>
            <div className="flex items-center border border-line rounded-lg">
              <button className="px-2.5 py-1.5 text-ink-muted" onClick={() => setQty(it.id, it.qty - 1)}>−</button>
              <span className="px-3 text-sm tabular-nums">{it.qty}</span>
              <button className="px-2.5 py-1.5 text-ink-muted" onClick={() => setQty(it.id, it.qty + 1)}>+</button>
            </div>
            <button className="text-ink-muted hover:text-red-500 text-sm px-2" onClick={() => remove(it.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-line rounded-2xl p-5 h-fit">
        <div className="flex justify-between text-sm mb-2"><span className="text-ink-muted">Subtotal</span><span className="font-semibold">{formatPrice(total, currency)}</span></div>
        <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-line"><span>Total</span><span>{formatPrice(total, currency)}</span></div>
        <Link href="/checkout" className="block text-center mt-5 px-5 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover">Checkout</Link>
      </div>
    </div>
  );
}
