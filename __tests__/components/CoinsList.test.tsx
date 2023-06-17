import CoinsList from '@/pages/components/CoinsList';

import { fireEvent, getByText, waitFor, within } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { render, screen } from '@/helpers/test-utils';

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
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponses(
      [
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
        {
          headers: [
            ['per-page', '1'],
            ['total', '2'],
          ],
        },
      ],
      [
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
        ]),
        {
          headers: [
            ['per-page', '1'],
            ['total', '2'],
          ],
        },
      ]
    );
  });

  async function validateFirstPage() {
    const coinBaseName = await screen.findByText(/coinbase exchange/i);
    expect(coinBaseName).toBeInTheDocument();
    const byBitName = screen.queryByText(/bybit/i);
    expect(byBitName).not.toBeInTheDocument();
  }

  async function validateSecondPage() {
    const coinBaseName = screen.queryByText(/coinbase exchange/i);
    expect(coinBaseName).not.toBeInTheDocument();
    const byBitName = await screen.findByText(/bybit/i);
    expect(byBitName).toBeInTheDocument();
  }

  it('should go to next page', async () => {
    render(<CoinsList />);

    await validateFirstPage();
    const nextButton = await screen.findByRole('button', {
      name: /next page/i,
    });

    fireEvent.click(nextButton);

    await validateSecondPage();
  });

  it('should have previous button disable only on first page', async () => {
    render(<CoinsList />);

    const prevButton = await screen.findByRole('button', {
      name: /previous page/i,
    });
    expect(prevButton).toBeDisabled();

    const nextButton = await screen.findByRole('button', {
      name: /next page/i,
    });
    fireEvent.click(nextButton);

    const prevButtonPage2 = await screen.findByRole('button', {
      name: /previous page/i,
    });
    expect(prevButtonPage2).toBeEnabled();
  });

  it('should be able to back to first page', async () => {
    render(<CoinsList />);

    const prevButton = await screen.findByRole('button', {
      name: /previous page/i,
    });

    const nextButton = await screen.findByRole('button', {
      name: /next page/i,
    });

    await validateFirstPage();

    fireEvent.click(nextButton);
    await validateSecondPage();

    fireEvent.click(prevButton);
    await validateFirstPage();
  });

  it('should disable next page when on last page', async () => {
    render(<CoinsList />);

    const prevButton = await screen.findByRole('button', {
      name: /previous page/i,
    });

    const nextButton = await screen.findByRole('button', {
      name: /next page/i,
    });

    await validateFirstPage();
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
    await validateSecondPage();
    expect(nextButton).toBeDisabled();

    fireEvent.click(prevButton);
    await validateFirstPage();
    expect(nextButton).toBeEnabled();
  });
});

describe('Filter coins', () => {
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

  it('should filter correctly', async () => {
    render(<CoinsList />);

    await screen.findByText(/coinbase/i);
    await screen.findByText(/bybit/i);

    const filter = screen.getByLabelText(/filter/i);
    fireEvent.change(filter, { target: { value: 'coinbase' } });

    const coinBaseItem = await screen.findByText(/coinbase/i);
    expect(coinBaseItem).toBeInTheDocument();

    const byBitItem = screen.queryByText(/bybit/i);
    expect(byBitItem).not.toBeInTheDocument();
  });
});
