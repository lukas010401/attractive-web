import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/AdminGuard';
import { AdminShell } from '@/components/AdminShell';
import { apiFetch } from '@/lib/api';
import { orderStatusLabel, orderStatuses, statusBadgeClass } from '@/lib/admin-labels';
import { formatPrice } from '@/lib/format';
import type { OrderDetail } from '@/lib/types';

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    if (!router.query.id) return;
    apiFetch<OrderDetail>(`/api/admin/orders/${router.query.id}`, {}, true).then(setOrder);
  }, [router.query.id]);

  async function updateStatus(status: string) {
    if (!order) return;
    const updated = await apiFetch<OrderDetail>(`/api/admin/orders/${order.id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, true);
    setOrder(updated);
  }

  if (!order) {
    return <AdminGuard><AdminShell>Chargement...</AdminShell></AdminGuard>;
  }

  return (
    <AdminGuard>
      <AdminShell>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl">Commande {order.reference}</h1>
          <span className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${statusBadgeClass(order.status)}`}>
            {orderStatusLabel(order.status)}
          </span>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-[1.5rem] bg-white/80 p-6 shadow-soft">
            <h2 className="font-display text-2xl">Articles commandés</h2>
            <div className="mt-4 grid gap-3">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between gap-4 border-b border-cocoa/10 py-3">
                  <span>{item.productName} × {item.quantity}</span>
                  <span className="font-semibold">{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
          <aside className="rounded-[1.5rem] bg-sand p-6">
            <h2 className="font-display text-2xl">Client</h2>
            <p className="mt-4 font-semibold">{order.customerName}</p>
            <p className="text-ink/65">{order.customerPhone}</p>
            <p className="mt-3 text-ink/65">{order.deliveryAddress}</p>
            {order.customerNote ? <p className="mt-3 text-sm text-ink/55">{order.customerNote}</p> : null}
            <label className="mt-6 grid gap-2">
              <span className="text-sm font-semibold text-ink">Statut de la commande</span>
              <select value={order.status} onChange={event => updateStatus(event.target.value)} className="w-full rounded-2xl border border-cocoa/15 bg-white px-4 py-3 outline-none focus:border-cocoa">
                {orderStatuses.map(status => <option key={status} value={status}>{orderStatusLabel(status)}</option>)}
              </select>
            </label>
          </aside>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
