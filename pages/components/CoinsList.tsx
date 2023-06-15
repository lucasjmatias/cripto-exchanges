import Image from 'next/image';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import CoinSummary from './CoinSummary';

interface Coin {
  id: string;
  name: string;
  year_established: number;
  country: string;
  image: string;
  trust_score: number;
  trade_volume_24h_btc: number;
}

interface CoinRequest {
  data: Coin[];
  headers: any;
}

export default function CoinsList() {
  const [page, setPage] = useState<number>(1);

  const { data, error, isLoading } = useSWR<CoinRequest>(
    `https://api.coingecko.com/api/v3/exchanges/?per_page=100&page=${page}`
  );
  const coins = (data && data.data) || [];
  const headers = data?.headers;

  const perPage = headers ? headers.get('per-page') : 1;
  const total = headers ? headers.get('total') : 1;
  const lastPage = Math.floor(total / perPage);

  if (error) return <div>Could not fetch coins data</div>;

  function handlePreviousPage() {
    setPage(currPage => (currPage > 1 ? currPage - 1 : 1));
  }

  function handleNextPage() {
    setPage(currPage => currPage + 1);
  }

  return (
    <div>
      <h1 id="fruits-heading">Coins</h1>
      <div>
        <button onClick={handlePreviousPage} disabled={page <= 1}>
          Previous Page
        </button>
        <button onClick={handleNextPage} disabled={page >= lastPage}>
          Next Page
        </button>
      </div>
      <div>
        {isLoading ? <div>Loading...</div> : ''}
        <ul aria-labelledby="fruits-heading">
          {coins &&
            coins.map(coin => <CoinSummary key={coin.id} coin={coin} />)}
        </ul>
      </div>
    </div>
  );
}
