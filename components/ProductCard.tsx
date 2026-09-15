import { useEffect, useState } from 'react';
import { AppLink as Link } from './AppLink';
import { mediaUrl } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { productDisplayName } from '@/lib/product-title';
import { isLowStock, productStockLabel } from '@/lib/stock-label';
import type { ProductListItem } from '@/lib/types';

export function ProductCard({ product }: { product: ProductListItem }) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const isAvailable = product.stockQuantity > 0;
  const displayName = productDisplayName(product);
  const stockLabel = productStockLabel(product.stockQuantity);
  const stockLabelClass = isLowStock(product.stockQuantity) ? 'bg-amber-50 text-amber-800' : 'bg-white/90 text-cocoa';

  useEffect(() => {
    if (!isAdded) return;
    const timeout = window.setTimeout(() => setIsAdded(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [isAdded]);

  function addToCart() {
    if (!isAvailable || isAdded) return;
    addItem(product);
    setIsAdded(true);
  }

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-white/75 shadow-soft transition hover:-translate-y-1 hover:bg-white">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand">
          {product.primaryImageUrl ? (
            <img
              src={mediaUrl(product.primaryImageUrl)}
              alt={displayName}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center font-display text-3xl text-cocoa/35">
              Attractive
            </div>
          )}
          <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${stockLabelClass}`}>
            {stockLabel}
          </span>
        </div>
      </Link>

      <div className="p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-bronze">{product.categoryName}</div>
        <Link href={`/products/${product.slug}`} className="mt-2 block font-display text-2xl text-ink hover:text-cocoa">
          {displayName}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/60">{product.shortDescription || 'Produit cosmétique sélectionné par Attractive.'}</p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="font-semibold text-cocoa">{formatPrice(product.price, product.currency)}</div>
            {product.compareAtPrice ? <div className="text-xs text-ink/40 line-through">{formatPrice(product.compareAtPrice, product.currency)}</div> : null}
          </div>
          <button
            type="button"
            onClick={addToCart}
            disabled={!isAvailable || isAdded}
            aria-label={`Ajouter ${displayName} au panier`}
            className={`grid h-11 min-w-11 place-items-center rounded-full px-3 text-cream shadow-sm transition disabled:cursor-not-allowed ${isAdded ? 'bg-emerald-600' : 'bg-ink hover:bg-cocoa disabled:bg-ink/25'}`}
          >
            {isAdded ? (
              <span className="text-xs font-semibold">Ajouté</span>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6 5 3H2" />
                <path d="M9 20h.01" />
                <path d="M18 20h.01" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
