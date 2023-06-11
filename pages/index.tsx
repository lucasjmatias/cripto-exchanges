import Head from 'next/head';
import Image from 'next/image';
import CoinsList from './components/CoinsList';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CoinsList />
      </main>
    </div>
  );
}
