import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { apiFetch, mediaUrl } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { productDisplayName } from '@/lib/product-title';
import { isLowStock, productStockLabel } from '@/lib/stock-label';
import type { ProductDetail } from '@/lib/types';

export default function ProductDetailPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);

  useEffect(() => {
    if (!router.query.slug) return;
    apiFetch<ProductDetail>(`/api/products/${router.query.slug}`).then(setProduct).catch(() => setProduct(null));
  }, [router.query.slug]);

  if (!product) return <div className="mx-auto max-w-7xl px-4 py-20 text-ink/60">Chargement du produit...</div>;

  const heroImage = product.images?.[0]?.url || product.primaryImageUrl;
  const displayName = productDisplayName(product);
  const stockLabel = productStockLabel(product.stockQuantity);

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
      <div className="rounded-[2rem] bg-sand p-4">
        {heroImage ? (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
            <Image src={mediaUrl(heroImage)} alt={displayName} layout="fill" objectFit="cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
          </div>
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center rounded-[1.5rem] bg-white font-display text-5xl text-cocoa/30">Attractive</div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-bronze">{product.categoryName}</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-ink">{displayName}</h1>
        <p className="mt-5 text-lg leading-8 text-ink/65">{product.description || product.shortDescription}</p>
        <div className="mt-6 text-3xl font-semibold text-cocoa">{formatPrice(product.price, product.currency)}</div>
        <button onClick={() => addItem(product)} className="mt-8 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-cream hover:bg-cocoa">
          Ajouter au panier
        </button>
        {isLowStock(product.stockQuantity) ? <p className="mt-3 text-sm font-semibold text-cocoa">{stockLabel}</p> : null}
        <div className="mt-10 rounded-[1.5rem] border border-cocoa/10 bg-white/60 p-6">
          <h2 className="font-display text-2xl text-ink">Spécifications</h2>
          <div className="mt-4 grid gap-3">
            {product.specifications.length ? product.specifications.map(spec => (
              <div key={spec.id} className="flex justify-between gap-4 border-b border-cocoa/10 pb-3 text-sm">
                <span className="font-semibold text-ink">{spec.name}</span>
                <span className="text-right text-ink/65">{spec.value}</span>
              </div>
            )) : <p className="text-sm text-ink/60">Aucune spécification renseignée.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
