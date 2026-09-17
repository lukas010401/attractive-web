import { useEffect, useState } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { AdminGuard } from '@/components/AdminGuard';
import { AdminShell } from '@/components/AdminShell';
import { apiFetch, mediaUrl } from '@/lib/api';
import type { Brand, PaginatedResponse } from '@/lib/types';

const pageSize = 8;

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
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

    apiFetch<PaginatedResponse<Brand>>(`/api/admin/metadata/brands?${params.toString()}`, {}, true)
      .then(result => {
        setBrands(result.items);
        setTotalCount(result.totalCount);
      })
      .catch(() => {
        setBrands([]);
        setTotalCount(0);
        setError('Impossible de charger les marques.');
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
          <h1 className="font-display text-4xl">Marques</h1>
          <Link href="/admin/brands/new" className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-cream">Créer</Link>
        </div>

        <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-white/70 p-4 shadow-soft md:grid-cols-[1fr_220px]">
          <input value={query} onChange={event => changeQuery(event.target.value)} placeholder="Rechercher marque ou slug..." className="rounded-2xl border border-cocoa/15 bg-white px-4 py-3 outline-none focus:border-cocoa" />
          <select value={status} onChange={event => changeStatus(event.target.value)} className="rounded-2xl border border-cocoa/15 bg-white px-4 py-3 outline-none focus:border-cocoa">
            <option value="">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="hidden">Masquées</option>
          </select>
        </div>

        {error ? <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-white/80 shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-cocoa/10 bg-sand/60 text-xs uppercase tracking-wide text-ink/55">
                <tr>
                  <th className="px-5 py-4">Logo</th>
                  <th className="px-5 py-4">Marque</th>
                  <th className="px-5 py-4">Slug</th>
                  <th className="px-5 py-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-ink/50">Chargement des marques...</td>
                  </tr>
                ) : brands.length ? (
                  brands.map(brand => {
                    const isActive = brand.isActive ?? true;
                    return (
                      <tr key={brand.id} className="border-b border-cocoa/10 transition hover:bg-sand/40">
                        <td className="px-5 py-4">
                          <Link href={`/admin/brands/${brand.id}`} className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-xl bg-sand p-2 hover:bg-cream">
                            {brand.logoUrl ? <img src={mediaUrl(brand.logoUrl)} alt={brand.name} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" /> : <span className="text-xs font-semibold text-cocoa/40">Logo</span>}
                          </Link>
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          <Link href={`/admin/brands/${brand.id}`} className="hover:text-cocoa">{brand.name}</Link>
                        </td>
                        <td className="px-5 py-4 text-ink/60">{brand.slug}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-stone-100 text-stone-500'}`}>
                            {isActive ? 'Active' : 'Masquée'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-ink/50">Aucune marque trouvée.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-4 px-5 py-4 text-sm text-ink/60">
            <span>{totalCount} marque(s)</span>
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