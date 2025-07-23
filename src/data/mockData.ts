// mock data

import { MarketData, TechnicalIndicators } from '../types/market';
import { subDays, format } from 'date-fns';


export const generateMockMarketData = (days: number = 365): MarketData[] => {
  const data: MarketData[] = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = subDays(today, i);

    const basePrice = 45000 + Math.sin(i / 30) * 5000 + Math.sin(i / 365) * 8000;
    const volatility = 0.015 + Math.random() * 0.035;
    const dailyChange = (Math.random() - 0.5) * volatility;

    const open = basePrice * (1 + (Math.random() - 0.5) * 0.01);
    const close = open * (1 + dailyChange);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);

    const technicalIndicators: TechnicalIndicators = {
      rsi: 30 + Math.random() * 40,
      macd: (Math.random() - 0.5) * 1000,
      sma20: close * (0.98 + Math.random() * 0.04),
      sma50: close * (0.95 + Math.random() * 0.1),
      bollinger: {
        upper: close * 1.02,
        middle: close,
        lower: close * 0.98,
      },
    };

    data.push({
      date: format(date, 'yyyy-MM-dd'),
      open,
      high,
      low,
      close,
      volume: Math.floor(1000000 + Math.random() * 5000000),
      volatility: volatility * 100,
      performance: dailyChange * 100,
      technicalIndicators,
    });
  }

  return data;
};

export const mockMarketData = generateMockMarketData();

export const availableInstruments = [
  // Crypto (CoinGecko IDs)
  { value: 'BTC', label: 'Bitcoin (BTC)', category: 'Crypto', apiSource: 'coingecko', apiId: 'bitcoin' },
  { value: 'ETH', label: 'Ethereum (ETH)', category: 'Crypto', apiSource: 'coingecko', apiId: 'ethereum' },

  // ETFs
  { value: 'SPY', label: 'S&P 500 ETF (SPY)', category: 'ETF', apiSource: 'mock', apiId: 'SPY' },
  { value: 'QQQ', label: 'Nasdaq 100 ETF (QQQ)', category: 'ETF', apiSource: 'mock', apiId: 'QQQ' },

  // Stocks
  { value: 'AAPL', label: 'Apple Inc. (AAPL)', category: 'Stock', apiSource: 'mock', apiId: 'AAPL' },
  { value: 'TSLA', label: 'Tesla Inc. (TSLA)', category: 'Stock', apiSource: 'mock', apiId: 'TSLA' },
  { value: 'GOOGL', label: 'Alphabet Inc. (GOOGL)', category: 'Stock', apiSource: 'mock', apiId: 'GOOGL' },

  // Forex
  { value: 'EUR/USD', label: 'Euro / US Dollar', category: 'Forex', apiSource: 'mock', apiId: 'EURUSD' },
  { value: 'GBP/USD', label: 'British Pound / US Dollar', category: 'Forex', apiSource: 'mock', apiId: 'GBPUSD' },
];



export const mockAlerts = [
  {
    date: '2024-01-15',
    type: 'high-volatility',
    message: 'Unusually high volatility detected (5.2%)',
    severity: 'warning' as const,
  },
  {
    date: '2024-01-22',
    type: 'high-volatility',
    message: 'Extreme volatility detected (8.1%)',
    severity: 'error' as const,
  },
];