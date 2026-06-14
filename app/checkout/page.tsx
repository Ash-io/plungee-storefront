'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart';
import { useStore } from '@/components/store-context';
import { api, formatPrice } from '@/lib/api';

const FIELDS: [keyof Form, string, boolean][] = [
  ['first_name', 'First name', true],
  ['last_name', 'Last name', true],
  ['email', 'Email', true],
  ['phone', 'Phone', true],
  ['address_1', 'Address', false],
  ['city', 'City', false],
  ['state', 'State', false],
];
type Form = { first_name: string; last_name: string; email: string; phone: string; address_1: string; city: string; state: string };

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { slug, currency } = useStore();
  const router = useRouter();
  const [form, setForm] = useState<Form>({ first_name: '', last_name: '', email: '', phone: '', address_1: '', city: '', state: '' });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const place = async () => {
    setError('');
    if (!form.first_name || !form.email || !form.phone) { setError('Please fill in your name, email, and phone.'); return; }
    if (items.length === 0) { setError('Your cart is empty.'); return; }
    setPlacing(true);
    try {
      const res = await api.createOrder(slug, {
        customer: form,
        items: items.map((i) => ({ product_id: i.id, quantity: i.qty })),
      });
      const orderId = res?.data?.order_ids?.[0];
      if (!orderId) throw new Error(res?.message || 'Could not place order');
      clear();
      router.push(`/order/${orderId}`);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <div className="text-center py-20 text-ink-muted">Your cart is empty.</div>;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8">
      <div>
        <h1 className="text-2xl font-bold text-ink mb-5">Checkout</h1>
        <div className="grid sm:grid-cols-2 gap-3">
          {FIELDS.map(([key, label, req]) => (
            <div key={key} className={key === 'address_1' ? 'sm:col-span-2' : ''}>
              <label className="text-xs font-semibold text-ink-body uppercase tracking-wide">{label}{req ? ' *' : ''}</label>
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full mt-1 px-4 py-2.5 text-sm bg-surface border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
          ))}
        </div>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        <p className="mt-4 text-xs text-ink-muted">You will receive bank-transfer payment details on the next screen. Your order is processed once payment is confirmed.</p>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-5 h-fit">
        <h2 className="font-semibold text-ink mb-3">Order summary</h2>
        <div className="space-y-2 text-sm">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between gap-3">
              <span className="text-ink-body line-clamp-1">{i.name} × {i.qty}</span>
              <span className="font-medium shrink-0">{formatPrice(i.price * i.qty, currency)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-line"><span>Total</span><span>{formatPrice(total, currency)}</span></div>
        <button onClick={place} disabled={placing} className="w-full mt-5 px-5 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover disabled:opacity-60">
          {placing ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </div>
  );
}
