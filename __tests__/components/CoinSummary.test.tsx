import CoinSummary from '@/pages/components/CoinSummary';
import { render, screen, within } from '@testing-library/react';

describe('General CoinList test', () => {
  const coin: Coin = {
    id: 'gdax',
    name: 'Coinbase Exchange',
    year_established: 2012,
    country: 'United States',
    image:
      'https://assets.coingecko.com/markets/images/23/small/Coinbase_Coin_Primary.png?1621471875',
    trust_score: 10,
    trade_volume_24h_btc: 60098.05805095501,
  };

  it('should render', () => {
    render(<CoinSummary coin={coin} />);
  });

  it('should render name.', async () => {
    render(<CoinSummary coin={coin} />);

    const coinsName = screen.getByText('Coinbase Exchange', { exact: true });
    expect(coinsName).toBeInTheDocument();
  });

  it('should render image', async () => {
    render(<CoinSummary coin={coin} />);

    const image = (await screen.findByAltText(
      'Coinbase Exchange'
    )) as HTMLImageElement;
    expect(image.src).toContain('Coinbase_Coin_Primary');
  });

  it('should render year_established.', async () => {
    render(<CoinSummary coin={coin} />);
    expect(screen.getByText('2012', { exact: true })).toBeInTheDocument();
  });

  it('should render country.', async () => {
    render(<CoinSummary coin={coin} />);
    expect(
      screen.getByText('United States', { exact: true })
    ).toBeInTheDocument();
  });

  it('should render trust_score.', async () => {
    render(<CoinSummary coin={coin} />);
    expect(screen.getByText('10', { exact: true })).toBeInTheDocument();
  });

  it('should render trade_volume_24h_btc.', async () => {
    render(<CoinSummary coin={coin} />);
    expect(
      screen.getByText('60098.05805095501', { exact: true })
    ).toBeInTheDocument();
  });
});
