'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { I } from './icons';
import { Media } from './Ph';
import { useCart } from './cart';
import { useUI } from './ui-context';
import { useStore } from './store-context';
import { formatPrice } from '@/lib/api';

export function CartDrawer() {
  const { items, setQty, remove, total, count, ready } = useCart();
  const { cartOpen, closeCart } = useUI();
  const { currency } = useStore();
  const router = useRouter();
  const shipping = total > 75000 || total === 0 ? 0 : 2500;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    if (cartOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartOpen, closeCart]);

  const goCheckout = () => { closeCart(); router.push('/checkout'); };
  const goShop = () => { closeCart(); router.push('/products'); };

  return (
    <>
      <div className={'drawer-scrim' + (cartOpen ? ' open' : '')} onClick={closeCart} />
      <aside className={'drawer' + (cartOpen ? ' open' : '')} aria-hidden={!cartOpen}>
        <div className="drawer-head">
          <h3>Your Bag {ready && count > 0 && <span style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-body)', fontSize: 16 }}>({count})</span>}</h3>
          <button className="icon-btn" onClick={closeCart} aria-label="Close"><I.close /></button>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-state">
              <I.bag width="56" height="56" />
              <h4>Your bag is empty</h4>
              <p style={{ marginBottom: 22 }}>Beautiful things are waiting.</p>
              <button className="btn btn-ink" onClick={goShop}>Start shopping</button>
            </div>
          ) : items.map((l) => (
            <div className="cart-line" key={l.id}>
              <Media src={l.image} alt={l.name} seed={l.id} />
              <div>
                <div className="cart-line-name">{l.name}</div>
                <div className="cart-qty">
                  <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease"><I.minus width="14" height="14" /></button>
                  <span>{l.qty}</span>
                  <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase"><I.plus width="14" height="14" /></button>
                </div>
                <button className="cart-remove" onClick={() => remove(l.id)}>Remove</button>
              </div>
              <div className="cart-line-price">{formatPrice(l.price * l.qty, currency)}</div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="summary-row"><span>Subtotal</span><span className="serif-num">{formatPrice(total, currency)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping, currency)}</span></div>
            <div className="summary-row total"><span>Total</span><span className="serif-num">{formatPrice(total + shipping, currency)}</span></div>
            <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18 }} onClick={goCheckout}>Checkout <I.arrow /></button>
            <div className="secure-note"><I.lock /> Secure checkout</div>
          </div>
        )}
      </aside>
    </>
  );
}
