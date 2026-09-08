import Image from 'next/image';
import { useEffect } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { apiFetch, mediaUrl } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { productDisplayName } from '@/lib/product-title';
import type { ProductDetail } from '@/lib/types';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, setItemImage } = useCart();

  useEffect(() => {
    items
      .filter(item => (!item.imageUrl || !item.brandName) && item.slug)
      .forEach(item => {
        apiFetch<ProductDetail>(`/api/products/${item.slug}`)
          .then(product => {
            const imageUrl = product.primaryImageUrl || product.images?.[0]?.url;
            if (imageUrl) setItemImage(item.productId, imageUrl, product.brandName);
          })
          .catch(() => undefined);
      });
  }, [items, setItemImage]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <h1 className="font-display text-5xl text-ink">Votre panier</h1>
      {!items.length ? (
        <div className="mt-8 rounded-[2rem] bg-sand p-8">
          <p className="text-ink/65">Votre panier est vide.</p>
          <Link href="/products" className="mt-5 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream">
            Découvrir les produits
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {items.map(item => {
              const displayName = productDisplayName(item);
              return (
                <div key={item.productId} className="grid gap-4 rounded-[1.5rem] border border-cocoa/10 bg-white/70 p-4 sm:grid-cols-[96px_1fr_auto]">
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-sand">
                    {item.imageUrl ? (
                      <Image src={mediaUrl(item.imageUrl)} alt={displayName} layout="fill" objectFit="cover" sizes="96px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-xl text-cocoa/30">Attractive</div>
                    )}
                  </div>
                  <div>
                    <Link href={`/products/${item.slug}`} className="font-display text-2xl text-ink hover:text-cocoa">{displayName}</Link>
                    <div className="mt-2 text-sm text-cocoa">{formatPrice(item.price, item.currency)} / article</div>
                    <button onClick={() => removeItem(item.productId)} className="mt-3 text-sm text-ink/50 underline hover:text-cocoa">Retirer</button>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <div className="flex items-center gap-3 rounded-full border border-cocoa/15 bg-white px-2 py-1">
                      <button aria-label={`Diminuer ${displayName}`} onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand">−</button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button aria-label={`Augmenter ${displayName}`} onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand">+</button>
                    </div>
                    <div className="text-sm text-ink/55">Total ligne</div>
                    <div className="font-semibold text-ink">{formatPrice(item.price * item.quantity, item.currency)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <aside className="h-fit rounded-[1.75rem] bg-ink p-6 text-cream shadow-soft">
            <h2 className="font-display text-3xl">Résumé</h2>
            <div className="mt-6 flex justify-between border-b border-white/10 pb-4">
              <span>Sous-total</span>
              <span>{formatPrice(total, items[0]?.currency || 'MGA')}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-cream/65">Livraison et confirmation par téléphone. Paiement à la livraison.</p>
            <Link href="/checkout" className="mt-6 flex justify-center rounded-full bg-cream px-6 py-3 text-sm font-semibold text-ink">
              Finaliser la commande
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
