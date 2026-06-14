'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { I } from './icons';
import { Media } from './Ph';
import { useCart } from './cart';
import { useUI } from './ui-context';
import { toast } from './ui-context';
import { formatPrice, type ProductDetail as P } from '@/lib/api';

export function ProductDetail({ product, currency }: { product: P; currency: string }) {
  const { add } = useCart();
  const { openCart } = useUI();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<string | null>('details');

  const images = product.images?.length ? product.images : [];
  const item = { id: product.id, slug: product.slug, name: product.name, price: Number(product.price) || 0, image: images[0]?.src || null };
  const addToBag = () => { add(item, qty); toast('Added · ' + product.name); openCart(); };
  const buyNow = () => { add(item, qty); router.push('/checkout'); };

  const accItems: [string, string, React.ReactNode][] = [
    ['details', 'Details', <p key="d">{product.short_description ? <span dangerouslySetInnerHTML={{ __html: product.short_description }} /> : 'A considered piece, made to be kept.'}</p>],
    ['shipping', 'Shipping & returns', <ul key="s"><li>Fast nationwide delivery</li><li>Easy returns within the return window</li><li>Buyer protection on every order</li></ul>],
  ];

  return (
    <div className="container">
      <div className="pdp">
        <div className="pdp-gallery">
          <div className="pdp-main">
            <Media src={images[active]?.src} alt={product.name} seed={product.id} sizes="(max-width:860px) 100vw, 55vw" priority />
          </div>
          {images.length > 1 && (
            <div className="pdp-thumbs">
              {images.map((im, i) => (
                <button key={i} className={'pdp-thumb' + (i === active ? ' active' : '')} onClick={() => setActive(i)} aria-label={`Image ${i + 1}`}>
                  <Media src={im.src} alt={im.alt} seed={`${product.id}-${i}`} sizes="120px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp-info">
          {product.categories?.[0] && <p className="eyebrow pdp-cat">{product.categories[0]}</p>}
          <h1 className="display pdp-title">{product.name}</h1>
          <div className="pdp-price">
            <span>{formatPrice(product.price, currency)}</span>
            {product.sale_price && product.regular_price && product.sale_price !== product.regular_price && (
              <span className="was">{formatPrice(product.regular_price, currency)}</span>
            )}
          </div>
          <div className="pdp-actions">
            <div className="qty-stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><I.minus /></button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase"><I.plus /></button>
            </div>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={addToBag} disabled={!product.in_stock}>
              {product.in_stock ? 'Add to bag' : 'Sold out'} {product.in_stock && <I.arrow />}
            </button>
          </div>
          {product.in_stock && (
            <button className="btn btn-ink btn-lg btn-block" style={{ marginTop: 12 }} onClick={buyNow}>Buy now</button>
          )}

          <div className="pdp-perks">
            <div className="perk"><I.truck /><div><b>Fast delivery</b><span>Shipped quickly, tracked to your door.</span></div></div>
            <div className="perk"><I.shield /><div><b>Buyer protection</b><span>Pay securely; we&rsquo;ve got your back.</span></div></div>
          </div>

          <div className="accordion">
            {accItems.map(([key, label, body]) => (
              <div key={key} className={'acc-item' + (open === key ? ' open' : '')}>
                <button className="acc-head" onClick={() => setOpen(open === key ? null : key)}>
                  {label}<I.plus />
                </button>
                <div className="acc-body">{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
