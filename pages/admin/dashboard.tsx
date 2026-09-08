import { useEffect, useState } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { AdminGuard } from '@/components/AdminGuard';
import { AdminShell } from '@/components/AdminShell';
import { apiFetch } from '@/lib/api';
import { orderStatusLabel, statusBadgeClass } from '@/lib/admin-labels';
import { formatPrice } from '@/lib/format';
import type { AdminDashboard } from '@/lib/types';

function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function MetricCard({ label, value, hint, strong = false }: { label: string; value: string | number; hint?: string; strong?: boolean }) {
  return (
    <div className={`rounded-[1.5rem] border border-cocoa/10 bg-white/80 p-5 shadow-soft ${strong ? 'md:col-span-2' : ''}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa/70">{label}</p>
      <p className="mt-3 font-display text-3xl text-ink md:text-4xl">{value}</p>
      {hint ? <p className="mt-2 text-sm text-ink/55">{hint}</p> : null}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setError('');

    apiFetch<AdminDashboard>('/api/admin/dashboard', {}, true)
      .then(setDashboard)
      .catch(() => {
        setDashboard(null);
        setError('Impossible de charger le tableau de bord.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AdminGuard>
      <AdminShell>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">Tableau de bord</h1>
          </div>
          <Link href="/admin/orders" className="rounded-full border border-cocoa/15 bg-white px-5 py-2 text-sm font-semibold text-cocoa hover:bg-sand">
            Voir les commandes
          </Link>
        </div>

        {error ? <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}

        {isLoading ? (
          <div className="mt-6 rounded-[1.5rem] bg-white/70 px-5 py-10 text-center text-ink/50 shadow-soft">Chargement du tableau de bord...</div>
        ) : dashboard ? (
          <>
            <section className="mt-6 grid gap-4 md:grid-cols-4">
              <MetricCard
                strong
                label="Argent en livraison"
                value={formatPrice(dashboard.orders.outForDeliveryTotal)}
                hint={`${dashboard.orders.outForDeliveryCount} commande(s) actuellement en livraison`}
              />
              <MetricCard label="À traiter" value={dashboard.orders.pendingCount} hint="Nouvelles et confirmées" />
              <MetricCard label="En préparation" value={dashboard.orders.preparingCount} hint="Commandes à préparer" />
              <MetricCard label="Aujourd'hui" value={formatPrice(dashboard.orders.todayTotal)} hint={`${dashboard.orders.todayCount} commande(s)`} />
              <MetricCard label="Livrées" value={formatPrice(dashboard.orders.deliveredTotal)} hint={`${dashboard.orders.deliveredCount} commande(s) livrée(s)`} />
              <MetricCard label="Annulées" value={dashboard.orders.cancelledCount} hint={formatPrice(dashboard.orders.cancelledTotal)} />
              <MetricCard label="Total commandes" value={dashboard.orders.totalCount} hint={formatPrice(dashboard.orders.totalAmount)} />
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-4">
              <MetricCard label="Produits publiés" value={dashboard.products.publishedCount} hint={`${dashboard.products.totalCount} produit(s) au total`} />
              <MetricCard label="Ruptures" value={dashboard.products.outOfStockCount} hint="Stock à corriger" />
              <MetricCard label="Stock faible" value={dashboard.products.lowStockCount} hint="Stock entre 1 et 2" />
              <MetricCard label="Mis en avant" value={dashboard.products.featuredCount} hint="Affichés sur l'accueil" />
            </section>

            <section className="mt-6 overflow-hidden rounded-[1.5rem] bg-white/80 shadow-soft">
              <div className="flex items-center justify-between gap-4 border-b border-cocoa/10 px-5 py-4">
                <h2 className="font-display text-2xl">Commandes récentes</h2>
                <Link href="/admin/orders" className="text-sm font-semibold text-cocoa hover:text-ink">Tout voir</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
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
                    {dashboard.recentOrders.length ? dashboard.recentOrders.map(order => (
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
                    )) : (
                      <tr>
                        <td colSpan={7} className="px-5 py-10 text-center text-ink/50">Aucune commande récente.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </AdminShell>
    </AdminGuard>
  );
}

