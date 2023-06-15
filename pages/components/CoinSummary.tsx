import Image from 'next/image';
import isURL from 'validator/lib/isURL';
import { useState } from 'react';

interface Props {
  coin: Coin;
}

export default function CoinSummary({ coin }: Props) {
  const {
    id,
    name,
    image,
    year_established,
    country,
    trust_score,
    trade_volume_24h_btc,
  } = coin;
  const [imageSrc, setImageSrc] = useState(
    isURL(image) ? image : '/vercel.svg'
  );
  return (
    <li key={id}>
      <div>
        <Image
          src={imageSrc}
          alt={name}
          width={40}
          height={40}
          onError={() => {
            console.log('erro');
            setImageSrc('/vercel.svg');
          }}
        />
        <span>{coin.name}</span>
      </div>
      <div>
        <label>Name:</label>
        <span>{year_established}</span>
      </div>
      <div>
        <label>Country:</label>
        <span>{country}</span>
      </div>
      <div>
        <label>Score:</label>
        <span>{trust_score}</span>
      </div>
      <div>
        <label>Trade Volume (24 hours):</label>
        <span>{trade_volume_24h_btc}</span>
      </div>
    </li>
  );
}
