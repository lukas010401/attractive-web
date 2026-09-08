import { useEffect, useState } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { AdminGuard } from '@/components/AdminGuard';
import { AdminShell } from '@/components/AdminShell';
import { apiFetch } from '@/lib/api';
import { orderStatusLabel, orderStatuses, statusBadgeClass } from '@/lib/admin-labels';
import { formatPrice } from '@/lib/format';
import type { OrderListItem, PaginatedResponse } from '@/lib/types';

const pageSize = 8;

function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize)
    });
    if (query.trim()) params.set('search', query.trim());
    if (status) params.set('status', status);

    setIsLoading(true);
    setError('');

    apiFetch<PaginatedResponse<OrderListItem>>(`/api/admin/orders?${params.toString()}`, {}, true)
      .then(result => {
        setOrders(result.items);
        setTotalCount(result.totalCount);
      })
      .catch(() => {
        setOrders([]);
        setTotalCount(0);
        setError('Impossible de charger les commandes.');
      })
      .finally(() => setIsLoading(false));
  }, [page, query, status]);

  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  function changeQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function changeStatus(value: string) {
    setStatus(value);
    setPage(1);
  }

  return (
    <AdminGuard>
      <AdminShell>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl">Commandes</h1>
        </div>

        <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-white/70 p-4 shadow-soft md:grid-cols-[1fr_220px]">
          <input value={query} onChange={event => changeQuery(event.target.value)} placeholder="Rechercher référence, client, téléphone..." className="rounded-2xl border border-cocoa/15 bg-white px-4 py-3 outline-none focus:border-cocoa" />
          <select value={status} onChange={event => changeStatus(event.target.value)} className="rounded-2xl border border-cocoa/15 bg-white px-4 py-3 outline-none focus:border-cocoa">
            <option value="">Tous les statuts</option>
            {orderStatuses.map(item => <option key={item} value={item}>{orderStatusLabel(item)}</option>)}
          </select>
        </div>

        {error ? <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-white/80 shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-cocoa/10 bg-sand/60 text-xs uppercase tracking-wide text-ink/55">
                <tr>
                  <th className="px-5 py-4">Référence</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Téléphone</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Statut</th>
                  <th className="px-5 py-4">Articles</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-ink/50">Chargement des commandes...</td>
                  </tr>
                ) : orders.length ? (
                  orders.map(order => (
                    <tr key={order.id} className="border-b border-cocoa/10 transition hover:bg-sand/40">
                      <td className="px-5 py-4 font-semibold">
                        <Link href={`/admin/orders/${order.id}`} className="hover:text-cocoa">{order.reference}</Link>
                      </td>
                      <td className="px-5 py-4 text-ink/60">{formatOrderDate(order.createdAt)}</td>
                      <td className="px-5 py-4 text-ink/70">{order.customerName}</td>
                      <td className="px-5 py-4 text-ink/60">{order.customerPhone}</td>
                      <td className="px-5 py-4 font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                          {orderStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-ink/60">{order.itemCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-ink/50">Aucune commande trouvée.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-4 px-5 py-4 text-sm text-ink/60">
            <span>{totalCount} commande(s)</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1 || isLoading} onClick={() => setPage(current => Math.max(1, current - 1))} className="rounded-full border border-cocoa/15 px-4 py-2 disabled:opacity-40">Précédent</button>
              <span>Page {page} / {pageCount}</span>
              <button disabled={page >= pageCount || isLoading} onClick={() => setPage(current => Math.min(pageCount, current + 1))} className="rounded-full border border-cocoa/15 px-4 py-2 disabled:opacity-40">Suivant</button>
            </div>
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}


