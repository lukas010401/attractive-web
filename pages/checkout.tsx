import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { AppLink as Link } from '@/components/AppLink';
import { apiFetch } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { productDisplayName } from '@/lib/product-title';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;

    setError('');

    if (!items.length) {
      setError('Votre panier est vide.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setError('Nom, téléphone et adresse de livraison sont obligatoires.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiFetch<{ reference: string }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          deliveryAddress: deliveryAddress.trim(),
          customerNote: customerNote.trim(),
          deliveryFee: 0,
          items: items.map(item => ({ productId: item.productId, quantity: item.quantity }))
        })
      });
      clearCart();
      router.push(`/order-success?reference=${encodeURIComponent(response.reference)}`);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Commande impossible pour le moment. Vérifiez les informations puis réessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="rounded-[2rem] bg-sand p-8">
          <h1 className="font-display text-4xl">Panier vide</h1>
          <Link href="/products" className="mt-5 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream">Retour catalogue</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1fr_380px] md:px-6">
      <form onSubmit={submit} className="rounded-[2rem] border border-cocoa/10 bg-white/70 p-6 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-bronze">Commande sans compte</p>
        <h1 className="mt-3 font-display text-5xl text-ink">Livraison</h1>
        <div className="mt-8 grid gap-4">
          <input required disabled={submitting} value={customerName} onChange={event => setCustomerName(event.target.value)} placeholder="Nom complet" className="rounded-2xl border border-cocoa/15 px-4 py-3 outline-none focus:border-cocoa disabled:bg-sand/60" />
          <input required disabled={submitting} value={customerPhone} onChange={event => setCustomerPhone(event.target.value)} placeholder="Téléphone" className="rounded-2xl border border-cocoa/15 px-4 py-3 outline-none focus:border-cocoa disabled:bg-sand/60" />
          <textarea required disabled={submitting} value={deliveryAddress} onChange={event => setDeliveryAddress(event.target.value)} placeholder="Adresse de livraison" rows={4} className="rounded-2xl border border-cocoa/15 px-4 py-3 outline-none focus:border-cocoa disabled:bg-sand/60" />
          <textarea disabled={submitting} value={customerNote} onChange={event => setCustomerNote(event.target.value)} placeholder="Note optionnelle" rows={3} className="rounded-2xl border border-cocoa/15 px-4 py-3 outline-none focus:border-cocoa disabled:bg-sand/60" />
        </div>
        {error ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <button disabled={submitting} className="mt-6 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-cream disabled:cursor-not-allowed disabled:opacity-50">
          {submitting ? 'Envoi de la commande...' : 'Valider la commande'}
        </button>
      </form>
      <aside className="h-fit rounded-[2rem] bg-sand p-6">
        <h2 className="font-display text-3xl">Votre sélection</h2>
        <div className="mt-5 grid gap-3">
          {items.map(item => (
            <div key={item.productId} className="flex justify-between gap-4 text-sm">
              <span>{productDisplayName(item)} × {item.quantity}</span>
              <span className="font-semibold">{formatPrice(item.price * item.quantity, item.currency)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between border-t border-cocoa/15 pt-4 font-semibold">
          <span>Total</span>
          <span>{formatPrice(total, items[0]?.currency || 'MGA')}</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-ink/60">Paiement à la livraison. Aucun paiement en ligne demandé.</p>
      </aside>
    </div>
  );
}
