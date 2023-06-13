import '@/styles/global.css';
import { fetcher } from 'helpers/fetcher';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 30000,
        fetcher: fetcher,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
