import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { apiFetch } from '@/lib/api';
import type { Metadata, ProductListItem } from '@/lib/types';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [metadata, setMetadata] = useState<Metadata>({ categories: [], brands: [] });
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiFetch<Metadata>('/api/products/metadata').then(setMetadata).catch(() => setMetadata({ categories: [], brands: [] }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (router.query.category) params.set('category', String(router.query.category));
    if (router.query.brand) params.set('brand', String(router.query.brand));
    if (search.trim()) params.set('q', search.trim());
    apiFetch<ProductListItem[]>(`/api/products?${params}`).then(setProducts).catch(() => setProducts([]));
  }, [router.query.category, router.query.brand, search]);

  const fieldClass = 'w-full rounded-2xl border border-cocoa/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-cocoa focus:ring-2 focus:ring-cocoa/10';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="rounded-[2rem] border border-cocoa/10 bg-sand/60 p-6 shadow-soft md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-bronze">Catalogue</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-5xl text-ink">Produits cosmétiques</h1>
          <span className="text-sm text-ink/55">{products.length} produit(s)</span>
        </div>

        <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-cocoa/10 bg-cream/65 p-4 md:grid-cols-[1fr_230px_230px]">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa/70">Recherche</span>
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Nom du produit..." className={fieldClass} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa/70">Catégorie</span>
            <select value={router.query.category || ''} onChange={event => router.push({ pathname: '/products', query: { ...router.query, category: event.target.value || undefined } })} className={fieldClass}>
              <option value="">Toutes les catégories</option>
              {metadata.categories.map(category => <option key={category.id} value={category.slug}>{category.name}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa/70">Marque</span>
            <select value={router.query.brand || ''} onChange={event => router.push({ pathname: '/products', query: { ...router.query, brand: event.target.value || undefined } })} className={fieldClass}>
              <option value="">Toutes les marques</option>
              {metadata.brands.map(brand => <option key={brand.id} value={brand.slug}>{brand.name}</option>)}
            </select>
          </label>
        </div>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
