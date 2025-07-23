
export interface MarketData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  volatility: number;
  performance: number; 
  technicalIndicators: TechnicalIndicators;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: number;
  sma20: number;
  sma50: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export interface FilterState {
  timePeriod: '1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y';
  dataOverlay: 'heatmap' | 'bars' | 'dots' | 'performance' | 'liquidity' | 'volatility';
  calendarView: 'daily' | 'weekly' | 'monthly';
  instrument: string;
}

export interface CalendarDayData {
  date: Date;
  marketData?: MarketData;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
}

export type ThemeMode = 'light' | 'dark';
