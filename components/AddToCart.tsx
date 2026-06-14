'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './cart';

export function AddToCart({ item }: { item: { id: number; slug: string; name: string; price: number; image: string | null } }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center border border-line rounded-xl overflow-hidden">
        <button className="px-3 py-2 text-ink-muted hover:bg-surface-alt" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
        <span className="px-4 text-sm font-medium tabular-nums">{qty}</span>
        <button className="px-3 py-2 text-ink-muted hover:bg-surface-alt" onClick={() => setQty((q) => q + 1)}>+</button>
      </div>
      <button
        onClick={() => { add(item, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
        className="px-5 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover transition-colors"
      >
        {added ? 'Added ✓' : 'Add to cart'}
      </button>
      <button
        onClick={() => { add(item, qty); router.push('/checkout'); }}
        className="px-5 py-2.5 rounded-xl border border-brand text-brand font-semibold hover:bg-brand-light transition-colors"
      >
        Buy now
      </button>
    </div>
  );
}
