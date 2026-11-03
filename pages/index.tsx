import { AppLink as Link } from '@/components/AppLink';
import { ProductCard } from '@/components/ProductCard';
import { API_BASE_URL, mediaUrl } from '@/lib/api';
import { productDisplayName } from '@/lib/product-title';
import type { GetServerSideProps } from 'next';
import type { Metadata, PaginatedResponse, ProductListItem, ProductShowcaseItem } from '@/lib/types';

type HomePageProps = {
  products: ProductListItem[];
  metadata: Metadata;
  showcaseProducts: ProductShowcaseItem[];
};

export default function HomePage({ products, metadata, showcaseProducts }: HomePageProps) {
  const showcaseGridClass = showcaseProducts.length === 1 ? 'mx-auto max-w-44 grid-cols-1' : showcaseProducts.length === 2 ? 'mx-auto max-w-sm grid-cols-2' : 'grid-cols-3';

  return (
    <>
      <section className="overflow-hidden border-b border-cocoa/10 bg-cream">
        <div className={`mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 md:px-6 lg:gap-12 lg:py-12 ${showcaseProducts.length ? 'lg:grid-cols-2' : ''}`}>
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-bronze">Attractive Cosmetics</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
              Vos essentiels beauté à Madagascar.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-ink/65 sm:text-lg sm:leading-8">
              Soins, maquillage et parfums : découvrez notre sélection, avec des prix affichés et une commande sans compte.
            </p>
            <div className="mt-7">
              <Link href="/products" className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-cocoa focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cocoa">
                Découvrir nos produits
              </Link>
            </div>
          </div>
          {showcaseProducts.length ? (
            <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-cocoa/10 bg-sand/70 px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
              <div className={`grid items-center gap-3 sm:gap-4 ${showcaseGridClass}`}>
                {showcaseProducts.map((product, index) => {
                  const isCenter = showcaseProducts.length === 3 && index === 1;
                  const positionClass = showcaseProducts.length === 1 || isCenter ? '' : index === 0 ? '-rotate-6' : 'rotate-6';

                  return (
                    <Link key={product.id} href={`/products/${product.slug}`} className={`block overflow-hidden rounded-2xl border border-cocoa/10 bg-white p-2 shadow-soft transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cocoa sm:p-3 ${isCenter ? 'aspect-[3/5]' : 'aspect-[3/4]'} ${positionClass}`}>
                      <img
                        src={mediaUrl(product.primaryImageUrl)}
                        alt={productDisplayName(product)}
                        loading="eager"
                        decoding="async"
                        className="h-full w-full object-contain"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-bronze">Catégories</p>
            <h2 className="mt-3 font-display text-4xl text-ink">Explorer par besoin</h2>
          </div>
          <Link href="/products" className="inline-flex rounded-full border border-cocoa/20 px-5 py-2 text-sm font-semibold text-cocoa">Tout voir</Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {metadata.categories.map(category => (
            <Link key={category.id} href={`/products?category=${encodeURIComponent(category.slug)}`} className="flex min-h-20 items-center justify-center rounded-[1.5rem] border border-cocoa/10 bg-white/65 p-5 text-center font-display text-2xl text-cocoa shadow-soft">
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-bronze">Marques</p>
            <h2 className="mt-3 font-display text-4xl text-ink">Explorer par marque</h2>
          </div>
          <Link href="/products" className="inline-flex rounded-full border border-cocoa/20 px-5 py-2 text-sm font-semibold text-cocoa">Tout voir</Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {metadata.brands.map(brand => (
            <Link key={brand.id} href={`/products?brand=${encodeURIComponent(brand.slug)}`} className="flex min-h-24 items-center justify-center rounded-[1.5rem] border border-cocoa/10 bg-white p-5 text-center font-display text-2xl text-cocoa shadow-soft transition hover:-translate-y-0.5">
              {brand.logoUrl ? <img src={mediaUrl(brand.logoUrl)} alt={brand.name} loading="lazy" decoding="async" className="max-h-14 max-w-full bg-white object-contain mix-blend-multiply" /> : brand.name}
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
               Aucun produit publié pour le moment.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`Failed to fetch ${path}`);
  return response.json();
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const [productsResult, metadata, showcaseProducts] = await Promise.all([
    fetchJson<PaginatedResponse<ProductListItem>>('/api/products?featured=true&pageSize=8').catch(() => null),
    fetchJson<Metadata>('/api/products/metadata').catch(() => ({ categories: [], brands: [] })),
    fetchJson<ProductShowcaseItem[]>('/api/products/showcase').catch(() => [])
  ]);

  return {
    props: {
      products: productsResult?.items || [],
      metadata,
      showcaseProducts
    }
  };
};
