import Image from 'next/image';
import { useEffect, useState } from 'react';
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

export default function CoinsList() {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/exchanges/?per_page=100&page=1')
      .then(resp => resp.json())
      .then(setCoins);
  }, []);

  function handleNextPage() {
    fetch('https://api.coingecko.com/api/v3/exchanges/?per_page=100&page=2')
      .then(resp => resp.json())
      .then(setCoins);
  }

  return (
    <div>
      <h1 id="fruits-heading">Coins</h1>
      <div>
        <button disabled>Previous Page</button>
        <button onClick={handleNextPage}>Next Page</button>
      </div>
      <div>
        <ul aria-labelledby="fruits-heading">
          {coins.map(coin => (
            <CoinSummary key={coin.id} coin={coin} />
          ))}
        </ul>
      </div>
    </div>
  );
}
