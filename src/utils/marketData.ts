
import axios from 'axios';
import { MarketData } from '../types/market';
import { format } from 'date-fns';

const mapTimePeriodToDays = (timePeriod: string): number => {
  switch (timePeriod) {
    case '1M': return 30;
    case '3M': return 90;
    case '6M': return 180;
    case '1Y': return 365;
    case '2Y': return 730;
    case '5Y': return 1825;
    default: return 365;
  }
};

const computeSMA = (data: number[], period: number, index: number): number => {
  if (index < period - 1) return data[index];
  const slice = data.slice(index - period + 1, index + 1);
  const sum = slice.reduce((a, b) => a + b, 0);
  return sum / period;
};

/**
 * Fetches and transforms market data from CoinGecko
 */
export const fetchMarketDataFromAPI = async (
  instrument: string,
  timePeriod: string
): Promise<MarketData[]> => {
  try {
    const days = mapTimePeriodToDays(timePeriod);

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${instrument}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days,
        },
      }
    );

    const { prices, total_volumes } = response.data;

    const closePrices: number[] = prices.map(([_, price]: [number, number]) => price);

    const marketData: MarketData[] = prices.map(
      ([timestamp, close]: [number, number], index: number): MarketData => {
        const date = format(new Date(timestamp), 'yyyy-MM-dd');

        const prevClose = index > 0 ? closePrices[index - 1] : close;
        const performance = index > 0 ? ((close - prevClose) / prevClose) * 100 : 0;
        const volatility = Math.abs(performance); // crude estimate

        const sma20 = computeSMA(closePrices, 20, index);
        const sma50 = computeSMA(closePrices, 50, index);

        return {
          date,
          open: prevClose,
          close,
          high: Math.max(close, prevClose),
          low: Math.min(close, prevClose),
          volume: total_volumes?.[index]?.[1] || 0,
          performance,
          volatility,
          technicalIndicators: {
            rsi: 50, // placeholder – you'd need historical data for proper RSI
            macd: 0, // optional
            sma20,
            sma50,
            bollinger: {
              upper: sma20 * 1.05,
              middle: sma20,
              lower: sma20 * 0.95,
            },
          },
        };
      }
    );

    return marketData;
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    throw error;
  }
};
