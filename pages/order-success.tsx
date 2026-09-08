import { useRouter } from 'next/router';
import { AppLink as Link } from '@/components/AppLink';

export default function OrderSuccessPage() {
  const router = useRouter();
  const reference = router.query.reference;

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
      <div className="rounded-[2.5rem] bg-sand p-10 shadow-soft">
        <div className="text-5xl text-cocoa">✦</div>
        <h1 className="mt-5 font-display text-5xl text-ink">Commande reçue</h1>
        <p className="mt-5 text-ink/65">Merci. L’équipe Attractive vous contactera pour confirmer la livraison.</p>
        {reference ? <p className="mt-4 font-semibold text-cocoa">Référence : {reference}</p> : null}
        <Link href="/products" className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
