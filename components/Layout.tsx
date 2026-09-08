import { useRouter } from 'next/router';
import { AppLink as Link } from './AppLink';
import { BrandLogo } from './BrandLogo';
import { useCart } from '@/lib/cart';

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { count } = useCart();
  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-cream text-ink">
      {!isAdmin && (
        <header className="sticky top-0 z-30 border-b border-cocoa/10 bg-cream/90 backdrop-blur">
          <div className="bg-[#f6e5cf] px-4 py-2.5 text-center text-sm font-medium text-ink md:text-base">
            Les essentiels beauté à Madagascar, à commander simplement avec paiement à la livraison ✨
          </div>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
            <Link href="/" className="flex items-center">
              <BrandLogo compact />
            </Link>
            <nav className="hidden items-center gap-7 text-sm font-medium text-ink/75 md:flex">
              <Link href="/products" className="hover:text-cocoa">Catalogue</Link>
              <Link href="/#categories" className="hover:text-cocoa">Catégories</Link>
              <Link href="/checkout" className="hover:text-cocoa">Commander</Link>
            </nav>
            <Link href="/cart" className="rounded-full border border-cocoa/20 px-4 py-2 text-sm font-semibold text-cocoa hover:bg-sand">
              Panier ({count})
            </Link>
          </div>
        </header>
      )}
      <main>{children}</main>
      {!isAdmin && (
        <footer className="border-t border-cocoa/10 bg-sand/70">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr] md:px-6">
            <div>
              <BrandLogo compact />
              <p className="mt-4 max-w-md text-sm leading-6 text-ink/65">
                Catalogue cosmétique à Madagascar. Commande simple, sans compte, avec paiement à la livraison.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-ink">Navigation</h3>
              <div className="mt-3 grid gap-2 text-sm text-ink/65">
                <Link href="/products">Catalogue</Link>
                <Link href="/cart">Panier</Link>
                <Link href="/checkout">Finaliser la commande</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-ink">Commande</h3>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                Entrez votre nom, téléphone et adresse. L’équipe confirme ensuite la livraison.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
