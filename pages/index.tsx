import { useEffect, useState } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { BrandLogo } from '@/components/BrandLogo';
import { ProductCard } from '@/components/ProductCard';
import { apiFetch } from '@/lib/api';
import type { Metadata, ProductListItem } from '@/lib/types';

export default function HomePage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [metadata, setMetadata] = useState<Metadata>({ categories: [], brands: [] });

  useEffect(() => {
    apiFetch<ProductListItem[]>('/api/products?featured=true').then(setProducts).catch(() => setProducts([]));
    apiFetch<Metadata>('/api/products/metadata').then(setMetadata).catch(() => setMetadata({ categories: [], brands: [] }));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-cocoa/10 bg-cream">
        <div className="absolute inset-0 cosmetic-surface" />
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute right-[-8rem] top-16 h-96 w-96 rounded-full bg-bronze/20 blur-3xl" />
        <div className="absolute bottom-[-9rem] left-1/3 h-80 w-80 rounded-full bg-linen/80 blur-3xl" />
        <div className="relative mx-auto min-h-[560px] max-w-7xl px-4 py-20 md:px-6">
          <div className="max-w-4xl">
            <h1 className="max-w-3xl font-display text-5xl leading-tight text-ink md:text-7xl">
              Beauté douce, sélection claire, commande rapide.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/65">
              Découvrez les produits Attractive, consultez les prix et spécifications, ajoutez au panier et commandez sans compte.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-cocoa">
                Voir le catalogue
              </Link>
              <Link href="/checkout" className="rounded-full border border-cocoa/25 bg-white/35 px-6 py-3 text-sm font-semibold text-cocoa hover:bg-white/70">
                Commander maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="rounded-[2rem] border border-cocoa/10 bg-white/70 p-8 text-center shadow-soft">
          <div className="mx-auto flex justify-center">
            <BrandLogo />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-ink/65">
            Trouvez vos produits, ajoutez-les au panier et commandez facilement en quelques étapes.
          </p>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-bronze">Catégories</p>
            <h2 className="mt-3 font-display text-4xl text-ink">Explorer par besoin</h2>
          </div>
          <Link href="/products" className="hidden rounded-full border border-cocoa/20 px-5 py-2 text-sm font-semibold text-cocoa md:inline-flex">Tout voir</Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {metadata.categories.map(category => (
            <Link key={category.id} href={`/products?category=${category.slug}`} className="rounded-[1.5rem] border border-cocoa/10 bg-white/65 p-5 font-display text-2xl text-cocoa shadow-soft">
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-bronze">Sélection</p>
        <h2 className="mt-3 font-display text-4xl text-ink">Produits mis en avant</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.length ? products.map(product => <ProductCard key={product.id} product={product} />) : (
            <div className="rounded-[1.5rem] border border-dashed border-cocoa/20 bg-white/50 p-8 text-ink/60">
              Aucun produit publié pour le moment. Ajoute les premiers produits dans le back-office.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
