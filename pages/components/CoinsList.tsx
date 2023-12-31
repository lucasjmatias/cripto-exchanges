import Image from 'next/image';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import CoinSummary from './CoinSummary';
import { usePagination } from '../hooks/paginationHooks';

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

const prepareCoins = (filterText: string) => (coins: Coin[] | undefined) => {
  if (!coins) {
    return [];
  }
  if (filterText === '') {
    return coins;
  }
  return coins.filter(coin =>
    coin.name.toLowerCase().includes(filterText.toLowerCase())
  );
};

export default function CoinsList() {
  const [filterText, setFilterText] = useState<string>('');

  const { page, setPage, data, error, isLoading, lastPage } =
    usePagination<Coin>(
      `https://api.coingecko.com/api/v3/exchanges/?per_page=100`,
      'page'
    );
  const coins = prepareCoins(filterText)(data);
  const totalOnPage = data?.length || 0;

  if (error) return <div>Could not fetch coins data</div>;

  function handlePreviousPage() {
    setPage(currPage => currPage - 1);
  }

  function handleNextPage() {
    setPage(currPage => currPage + 1);
  }

  function handleFilter(event: React.FormEvent<HTMLInputElement>) {
    setFilterText(event.currentTarget.value);
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
        <label htmlFor="coin-filter-input">Filter</label>
        <input
          id="coin-filter-input"
          type="text"
          placeholder="Filter by name"
          value={filterText}
          onChange={handleFilter}
        />
      </div>
      {coins && filterText && (
        <div>
          Showing {coins.length} of {totalOnPage}
        </div>
      )}
      <div>
        {isLoading ? <div>Loading...</div> : ''}
        <ul aria-labelledby="fruits-heading">
          {coins.map(coin => (
            <CoinSummary key={coin.id} coin={coin} />
          ))}
        </ul>
      </div>
    </div>
  );
}
