'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart';
import { useStore } from '@/components/store-context';
import { Media } from '@/components/Ph';
import { I } from '@/components/icons';
import { api, formatPrice } from '@/lib/api';

type Form = { first_name: string; last_name: string; email: string; phone: string; address_1: string; city: string; state: string };

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { slug, currency } = useStore();
  const router = useRouter();
  const [form, setForm] = useState<Form>({ first_name: '', last_name: '', email: '', phone: '', address_1: '', city: '', state: '' });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const shipping = total > 75000 || total === 0 ? 0 : 2500;

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const place = async () => {
    setError('');
    if (!form.first_name || !form.email || !form.phone) { setError('Please fill in your name, email, and phone.'); return; }
    setPlacing(true);
    try {
      const res = await api.createOrder(slug, { customer: form, items: items.map((i) => ({ product_id: i.id, quantity: i.qty })) });
      const orderId = res?.data?.order_ids?.[0];
      if (!orderId) throw new Error(res?.message || 'Could not place order');
      clear();
      router.push(`/order/${orderId}`);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Please try again.');
    } finally { setPlacing(false); }
  };

  if (items.length === 0) {
    return <div className="container"><div className="empty-state"><I.bag width="56" height="56" /><h4>Your bag is empty</h4></div></div>;
  }

  const fields: [keyof Form, string][] = [['first_name', 'First name'], ['last_name', 'Last name'], ['email', 'Email'], ['phone', 'Phone']];

  return (
    <div className="container">
      <div className="listing-head"><h1 className="display" style={{ fontSize: 'clamp(30px,4vw,46px)' }}>Checkout</h1></div>
      <div className="checkout">
        <div>
          <div className="co-panel">
            <div className="co-step-title"><span className="co-step-num">1</span> Contact &amp; delivery</div>
            <div className="field-row">
              {fields.slice(0, 2).map(([k, l]) => (
                <div className="field" key={k}><label>{l}</label><input value={form[k]} onChange={set(k)} /></div>
              ))}
            </div>
            <div className="field-row">
              <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set('email')} /></div>
              <div className="field"><label>Phone</label><input value={form.phone} onChange={set('phone')} /></div>
            </div>
            <div className="field"><label>Address</label><input value={form.address_1} onChange={set('address_1')} /></div>
            <div className="field-row">
              <div className="field"><label>City</label><input value={form.city} onChange={set('city')} /></div>
              <div className="field"><label>State</label><input value={form.state} onChange={set('state')} /></div>
            </div>
          </div>

          <div className="co-panel" style={{ marginTop: 18 }}>
            <div className="co-step-title"><span className="co-step-num">2</span> Payment</div>
            <div className="pay-method">
              <div className="pay-opt active"><b>Bank transfer</b><span>Plungee Pay — pay to an account, order ships once confirmed</span></div>
            </div>
            {error && <p style={{ color: '#c0392b', fontSize: 14 }}>{error}</p>}
            <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 8 }} onClick={place} disabled={placing}>
              {placing ? 'Placing order…' : 'Place order'} {!placing && <I.arrow />}
            </button>
            <div className="secure-note"><I.lock /> Secure checkout</div>
          </div>
        </div>

        <aside className="co-summary co-panel">
          <div className="co-step-title" style={{ fontSize: 20 }}>Your order</div>
          {items.map((i) => (
            <div className="co-line" key={i.id}>
              <Media src={i.image} alt={i.name} seed={i.id} />
              <div><div className="co-line-name">{i.name}</div><div className="co-line-qty">Qty {i.qty}</div></div>
              <span className="serif-num" style={{ fontWeight: 600 }}>{formatPrice(i.price * i.qty, currency)}</span>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <div className="summary-row"><span>Subtotal</span><span className="serif-num">{formatPrice(total, currency)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping, currency)}</span></div>
            <div className="summary-row total"><span>Total</span><span className="serif-num">{formatPrice(total + shipping, currency)}</span></div>
          </div>
          <div className="plungee-pay"><span className="plungee-mark" style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 800 }}>P</span> Secured by <b>Plungee</b></div>
        </aside>
      </div>
    </div>
  );
}
