import Head from 'next/head';
import { AppLink as Link } from '@/components/AppLink';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>À propos | Attractive Store Madagascar</title>
        <meta name="description" content="Découvrez Attractive Cosmetics, boutique en ligne de cosmétiques à Madagascar : soins, maquillage et parfums, à commander sans compte." />
      </Head>
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-20">
        <article aria-labelledby="about-title" className="rounded-[2rem] border border-cocoa/10 bg-white/70 p-6 shadow-soft sm:p-10">
          <h1 id="about-title" className="font-display text-4xl leading-tight text-ink sm:text-5xl">À propos d’Attractive</h1>
          <p className="mt-6 text-lg font-semibold leading-8 text-cocoa">La beauté commence par des choix qui vous ressemblent.</p>
          <div className="mt-6 space-y-6 leading-8 text-ink/75">
            <p>
              Attractive Cosmetics est une boutique en ligne de cosmétiques à Madagascar, née d’une envie simple : vous permettre de découvrir et de choisir vos produits de beauté plus facilement.
            </p>
            <p>
              Soins du visage et du corps, produits capillaires, maquillage et parfums : nous réunissons nos produits dans un catalogue clair, avec leurs prix et leurs caractéristiques pour vous aider à trouver ce qui correspond à vos envies et à votre routine.
            </p>
            <p>
              Retrouvez notamment les marques <strong className="font-semibold text-ink">Balea, Essence, Eliza Jones et Mango</strong>, et prenez le temps de découvrir leurs univers.
            </p>
            <p>
              Commander se fait directement sur notre site, sans création de compte. Une fois votre commande passée, nous vous contactons pour confirmer les modalités de livraison, avec paiement à la réception.
            </p>
            <p>
              Bienvenue chez Attractive, et merci de faire grandir cette aventure avec nous.
            </p>
          </div>
          <Link href="/products" className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-cocoa focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cocoa">
            Découvrir nos produits
          </Link>
        </article>
      </div>
    </>
  );
}
