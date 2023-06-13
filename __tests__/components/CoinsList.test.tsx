import CoinsList from '@/pages/components/CoinsList';
import { SWRConfig } from 'swr';

import { fireEvent, getByText, waitFor, within } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { render, screen } from '../utils/test-utils';

describe('General CoinList test', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(
      JSON.stringify([
        {
          id: 'gdax',
          name: 'Coinbase Exchange',
          year_established: 2012,
          country: 'United States',
          image:
            'https://assets.coingecko.com/markets/images/23/small/Coinbase_Coin_Primary.png?1621471875',
          trust_score: 10,
          trade_volume_24h_btc: 60098.05805095501,
        },
        {
          id: 'bybit_spot',
          name: 'Bybit',
          year_established: 2018,
          country: 'British Virgin Islands',
          image:
            'https://assets.coingecko.com/markets/images/698/small/bybit_spot.png?1629971794',
          trust_score: 10,
          trust_score_rank: 2,
          trade_volume_24h_btc: 50887.355620258204,
        },
      ])
    );
  });

  it('should render API data', async () => {
    render(<CoinsList />);
    const coinBaseName = await screen.findByText(/coinbase exchange/i);
    expect(coinBaseName).toBeInTheDocument();
    const byBitName = await screen.findByText(/bybit/i);
    expect(byBitName).toBeInTheDocument();
  });

  it('should render disabled previous button pagination', async () => {
    render(<CoinsList />);

    const prevButton = await screen.findByRole('button', {
      name: /previous page/i,
    });
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).toBeDisabled();
  });

  it('should render enabled next button pagination', async () => {
    render(<CoinsList />);

    const nextButton = await screen.findByRole('button', {
      name: /next page/i,
    });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeEnabled();
  });
});

describe('Pagination CoinList test', () => {
  beforeAll(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponses(
      JSON.stringify([
        {
          id: 'gdax',
          name: 'Coinbase Exchange',
          year_established: 2012,
          country: 'United States',
          image:
            'https://assets.coingecko.com/markets/images/23/small/Coinbase_Coin_Primary.png?1621471875',
          trust_score: 10,
          trade_volume_24h_btc: 60098.05805095501,
        },
      ]),
      JSON.stringify([
        {
          id: 'bybit_spot',
          name: 'Bybit',
          year_established: 2018,
          country: 'British Virgin Islands',
          image:
            'https://assets.coingecko.com/markets/images/698/small/bybit_spot.png?1629971794',
          trust_score: 10,
          trust_score_rank: 2,
          trade_volume_24h_btc: 50887.355620258204,
        },
      ])
    );
  });

  it('should go to next page', async () => {
    render(<CoinsList />);
    const coinBaseNamePage1 = await screen.findByText(/coinbase exchange/i);
    expect(coinBaseNamePage1).toBeInTheDocument();
    const byBitNamePage1 = screen.queryByText(/bybit/i);
    expect(byBitNamePage1).not.toBeInTheDocument();

    const nextButton = await screen.findByRole('button', {
      name: /next page/i,
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/bybit/i)).toBeInTheDocument();
    });

    const coinBaseNamePage2 = screen.queryByText(/coinbase exchange/i);
    expect(coinBaseNamePage2).not.toBeInTheDocument();
    const byBitNamePage2 = await screen.findByText(/bybit/i);
    expect(byBitNamePage2).toBeInTheDocument();
  });
});
