'use client';
import Link from 'next/link';
import { useCart } from '@/components/cart';
import { useStore } from '@/components/store-context';
import { Media } from '@/components/Ph';
import { I } from '@/components/icons';
import { formatPrice } from '@/lib/api';

export default function CartPage() {
  const { items, setQty, remove, total, ready } = useCart();
  const { currency } = useStore();
  const shipping = total > 75000 || total === 0 ? 0 : 2500;

  if (!ready) {
    return (
      <div className="container"><div className="empty-state" style={{ padding: '90px 20px' }}>
        <p style={{ color: 'var(--ink-soft)' }}>Loading your bag…</p>
      </div></div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container"><div className="empty-state" style={{ padding: '90px 20px' }}>
        <I.bag width="56" height="56" /><h4>Your bag is empty</h4>
        <p style={{ marginBottom: 22 }}>Beautiful things are waiting.</p>
        <Link href="/products" className="btn btn-ink">Start shopping</Link>
      </div></div>
    );
  }

  return (
    <div className="container">
      <div className="listing-head"><h1 className="display" style={{ fontSize: 'clamp(30px,4vw,46px)' }}>Your bag</h1></div>
      <div className="checkout">
        <div className="co-panel">
          {items.map((l) => (
            <div className="cart-line" key={l.id}>
              <div className="ph">
                <Media src={l.image} alt={l.name} seed={l.id} />
              </div>
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
        <aside className="co-summary co-panel">
          <div className="co-step-title" style={{ fontSize: 20 }}>Summary</div>
          <div className="summary-row"><span>Subtotal</span><span className="serif-num">{formatPrice(total, currency)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping, currency)}</span></div>
          <div className="summary-row total"><span>Total</span><span className="serif-num">{formatPrice(total + shipping, currency)}</span></div>
          <Link href="/checkout" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18 }}>Checkout <I.arrow /></Link>
          <div className="secure-note"><I.lock /> Secure checkout</div>
        </aside>
      </div>
    </div>
  );
}
