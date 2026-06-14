import Link from 'next/link';
import type { Metadata } from 'next';
import { api, formatPrice } from '@/lib/api';
import { resolveSlug } from '@/lib/store';
import { I } from '@/components/icons';

export const metadata: Metadata = { title: 'Order confirmation', robots: { index: false } };

export default async function OrderPage({ params }: { params: { id: string } }) {
  const slug = resolveSlug();
  const order: any = await api.order(slug, params.id);
  if (!order) return <div className="container"><div className="empty-state">Order not found.</div></div>;
  const pay = order.payment || {};
  const cur = order.currency || 'NGN';

  return (
    <div className="container">
      <div className="confirm">
        <div className="confirm-check"><I.check width="40" height="40" /></div>
        <h1 className="display">Order placed</h1>
        <span className="order-id">Reference {pay.reference || `#${order.id}`}</span>

        <div className="confirm-card">
          <div className="co-step-title" style={{ fontSize: 20 }}>Pay by bank transfer</div>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 18, fontSize: 14.5 }}>
            {pay.instructions || 'Transfer the total to the account below. Your order is processed once payment is confirmed.'}
          </p>
          <div className="summary-row"><span>Bank</span><span style={{ color: 'var(--ink)', fontWeight: 600 }}>{pay.bank}</span></div>
          <div className="summary-row"><span>Account name</span><span style={{ color: 'var(--ink)', fontWeight: 600 }}>{pay.account_name}</span></div>
          <div className="summary-row"><span>Account number</span><span className="serif-num" style={{ color: 'var(--ink)', fontWeight: 700 }}>{pay.account_number}</span></div>
          <div className="summary-row total"><span>Total</span><span className="serif-num">{formatPrice(order.total, cur)}</span></div>
        </div>

        {Array.isArray(order.items) && order.items.length > 0 && (
          <div className="confirm-card" style={{ marginTop: 18 }}>
            <div className="co-step-title" style={{ fontSize: 18 }}>Items</div>
            {order.items.map((it: any, i: number) => (
              <div className="summary-row" key={i}><span>{it.name} × {it.quantity}</span><span className="serif-num">{formatPrice((Number(it.price) || 0) * (it.quantity || 1), cur)}</span></div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 30 }}><Link href="/products" className="btn btn-ink">Continue shopping</Link></div>
      </div>
    </div>
  );
}
