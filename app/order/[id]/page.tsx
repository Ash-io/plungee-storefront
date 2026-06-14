import Link from 'next/link';
import type { Metadata } from 'next';
import { api, formatPrice } from '@/lib/api';
import { resolveSlug } from '@/lib/store';

export const metadata: Metadata = { title: 'Order confirmation', robots: { index: false } };

export default async function OrderPage({ params }: { params: { id: string } }) {
  const slug = resolveSlug();
  const order: any = await api.order(slug, params.id);

  if (!order) {
    return <div className="text-center py-20 text-ink-muted">Order not found.</div>;
  }

  const pay = order.payment || {};
  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full bg-brand-light text-brand grid place-items-center mx-auto text-2xl">✓</div>
        <h1 className="text-2xl font-bold text-ink mt-4">Order placed</h1>
        <p className="text-ink-muted mt-1">Order reference {pay.reference || `#${order.id}`}</p>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-5">
        <h2 className="font-semibold text-ink mb-3">Pay by bank transfer</h2>
        <p className="text-sm text-ink-muted mb-4">{pay.instructions || 'Transfer the total to the account below. Your order is processed once payment is confirmed.'}</p>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between"><dt className="text-ink-muted">Bank</dt><dd className="font-medium">{pay.bank}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-muted">Account name</dt><dd className="font-medium">{pay.account_name}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-muted">Account number</dt><dd className="font-mono font-semibold">{pay.account_number}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-muted">Reference</dt><dd className="font-medium">{pay.reference}</dd></div>
          <div className="flex justify-between pt-2 border-t border-line text-base"><dt className="font-semibold">Total</dt><dd className="font-bold text-brand">{formatPrice(order.total, order.currency || 'NGN')}</dd></div>
        </dl>
      </div>

      {Array.isArray(order.items) && order.items.length > 0 && (
        <div className="mt-5 bg-surface border border-line rounded-2xl p-5">
          <h3 className="font-semibold text-ink mb-2">Items</h3>
          <div className="space-y-1.5 text-sm">
            {order.items.map((it: any, i: number) => (
              <div key={i} className="flex justify-between"><span className="text-ink-body">{it.name} × {it.quantity}</span><span>{formatPrice((Number(it.price) || 0) * (it.quantity || 1), order.currency || 'NGN')}</span></div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mt-6">
        <Link href="/products" className="text-brand font-medium">Continue shopping</Link>
      </div>
    </div>
  );
}
