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
              {count > 0 ? <Link href="/checkout" className="hover:text-cocoa">Finaliser la commande</Link> : null}
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
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:px-6 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
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
                <Link href="/a-propos">À propos d’Attractive</Link>
                <Link href="/cart">Panier</Link>
                {count > 0 ? <Link href="/checkout">Finaliser la commande</Link> : null}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-ink">Commande</h3>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                Entrez votre nom, téléphone et adresse. L’équipe confirme ensuite la livraison.
              </p>
            </div>
            <div id="contact" className="scroll-mt-64">
              <h3 className="font-semibold text-ink">Contact</h3>
              <dl className="mt-3 grid gap-4 text-sm">
                <div>
                  <dt className="font-medium text-ink">Facebook</dt>
                  <dd className="mt-1 text-ink/65">
                    <a href="https://web.facebook.com/attractive.mg" target="_blank" rel="noopener noreferrer" className="rounded underline underline-offset-4 hover:text-cocoa focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cocoa">
                      Attractive Cosmetics<span className="sr-only"> (nouvel onglet)</span>
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
