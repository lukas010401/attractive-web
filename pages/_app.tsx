import type { AppProps } from 'next/app';
import Head from 'next/head';
import { CartProvider } from '@/lib/cart';
import { Layout } from '@/components/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Attractive Store Madagascar</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <CartProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      </CartProvider>
    </>
  );
}
