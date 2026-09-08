import { useState } from 'react';
import { useRouter } from 'next/router';
import { AppLink as Link } from './AppLink';
import { clearTokens } from '@/lib/auth';

const navItems = [
  { href: '/admin', label: 'Tableau de bord' },
  { href: '/admin/orders', label: 'Commandes' },
  { href: '/admin/products', label: 'Produits' },
  { href: '/admin/brands', label: 'Marques' }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function logout() {
    clearTokens();
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-cocoa/10 bg-cream/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsMenuOpen(current => !current)}
            aria-label={isMenuOpen ? 'Fermer le menu admin' : 'Ouvrir le menu admin'}
            aria-expanded={isMenuOpen}
            className="grid h-11 w-11 place-items-center rounded-full border border-cocoa/15 bg-white text-ink"
          >
            <span className="grid gap-1.5">
              <span className={`block h-0.5 w-5 rounded-full bg-ink transition ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-ink transition ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-ink transition ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cocoa">Admin</span>
          <button onClick={logout} className="rounded-full border border-cocoa/15 bg-white px-3 py-2 text-xs font-semibold text-cocoa">
            Sortir
          </button>
        </div>

        {isMenuOpen ? (
          <nav className="mt-3 grid gap-2 rounded-2xl border border-cocoa/10 bg-white p-2 text-sm shadow-soft">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} className="rounded-xl px-4 py-3 font-semibold text-ink hover:bg-sand">
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-cocoa/10 bg-ink p-6 text-cream md:block">
        <nav className="grid gap-3 text-sm">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 hover:bg-white/10">
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="absolute bottom-6 left-6 rounded-full border border-white/20 px-4 py-2 text-sm">
          Déconnexion
        </button>
      </aside>

      <div className="md:pl-64">
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}

