'use client';
import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import { I } from './icons';
import { Media } from './Ph';
import { useCart } from './cart';
import { toast } from './ui-context';
import { formatPrice, type ProductCard as P } from '@/lib/api';

// favourites (localStorage)
const KEY = 'plungee_favs';
const subs = new Set<() => void>();
let favSet = new Set<number>();
if (typeof window !== 'undefined') {
  try { favSet = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { /* ignore */ }
}
function toggleFav(id: number) {
  favSet.has(id) ? favSet.delete(id) : favSet.add(id);
  try { localStorage.setItem(KEY, JSON.stringify([...favSet])); } catch { /* ignore */ }
  subs.forEach((f) => f());
}
function useFav(id: number): [boolean, () => void] {
  const [, force] = useReducer((x: number) => x + 1, 0);
  useEffect(() => { subs.add(force); return () => { subs.delete(force); }; }, []);
  return [favSet.has(id), () => toggleFav(id)];
}

export function ProductCard({ p, currency }: { p: P; currency: string }) {
  const [fav, flip] = useFav(p.id);
  const { add } = useCart();
  const href = `/products/${p.slug}`;
  return (
    <article className="pcard">
      <Link href={href} className="pcard-media" style={{ display: 'block' }}>
        <Media src={p.image} alt={p.name} seed={p.id} meta={{ cat: p.category || undefined, color: p.name }} />
        {!p.in_stock && <div className="pcard-badges"><span className="badge badge-best">Sold out</span></div>}
        <button className={'pcard-fav' + (fav ? ' on' : '')} aria-label="Save"
          onClick={(e) => { e.preventDefault(); flip(); }}>
          {fav ? <I.heartFill /> : <I.heart />}
        </button>
        <button className="pcard-add"
          onClick={(e) => { e.preventDefault(); add({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price) || 0, image: p.image }); toast('Added · ' + p.name); }}>
          <I.plus width="15" height="15" /> Add to bag
        </button>
      </Link>
      <Link href={href} className="pcard-body" style={{ display: 'flex' }}>
        {p.category && <span className="pcard-cat">{p.category}</span>}
        <h3 className="pcard-name">{p.name}</h3>
        <div className="pcard-foot">
          <span className="pcard-price">{formatPrice(p.price, currency)}</span>
        </div>
      </Link>
    </article>
  );
}
