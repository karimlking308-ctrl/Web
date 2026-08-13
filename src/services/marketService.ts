import { MarketAsset, MarketMoversData } from '../types';

/**
 * Service interface for Market Data Feeds.
 * Prepared for Phase 3 integration (Real Market Data APIs: CoinGecko, Yahoo Finance, Finnhub, AlphaVantage, etc.).
 * Phase 1 provides structural mock models clearly labeled as placeholders.
 */
export interface MarketService {
  getTickerAssets(): Promise<MarketAsset[]>;
  getMarketMovers(): Promise<MarketMoversData>;
  getAssetBySymbol(symbol: string): Promise<MarketAsset | null>;
}

export const placeholderTickerAssets: MarketAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Phase 1 Skeleton' },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Phase 1 Skeleton' },
  { symbol: 'SOL', name: 'Solana', type: 'crypto', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Phase 1 Skeleton' },
  { symbol: 'S&P 500', name: 'S&P 500 Index', type: 'index', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Phase 1 Skeleton' },
  { symbol: 'NASDAQ', name: 'Nasdaq Composite', type: 'index', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Phase 1 Skeleton' },
  { symbol: 'GOLD', name: 'Gold Futures', type: 'commodity', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Phase 1 Skeleton' },
  { symbol: 'OIL', name: 'Crude Oil WTI', type: 'commodity', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Phase 1 Skeleton' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'forex', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Phase 1 Skeleton' },
];

export const placeholderMarketMovers: MarketMoversData = {
  gainers: [
    { symbol: 'NVDA', name: 'NVIDIA Corp', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
    { symbol: 'SOL', name: 'Solana', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
    { symbol: 'TSLA', name: 'Tesla Inc', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
    { symbol: 'AVAX', name: 'Avalanche', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
  ],
  losers: [
    { symbol: 'INTC', name: 'Intel Corp', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
    { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
    { symbol: 'BABA', name: 'Alibaba Group', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
    { symbol: 'XRP', name: 'Ripple', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
  ],
  mostActive: [
    { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
    { symbol: 'ETH', name: 'Ethereum', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
    { symbol: 'AAPL', name: 'Apple Inc', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Phase 1' },
  ],
};

export const marketService: MarketService = {
  async getTickerAssets(): Promise<MarketAsset[]> {
    return placeholderTickerAssets;
  },

  async getMarketMovers(): Promise<MarketMoversData> {
    return placeholderMarketMovers;
  },

  async getAssetBySymbol(symbol: string): Promise<MarketAsset | null> {
    const all = [...placeholderTickerAssets, ...placeholderMarketMovers.gainers, ...placeholderMarketMovers.losers, ...placeholderMarketMovers.mostActive];
    return all.find(a => a.symbol.toLowerCase() === symbol.toLowerCase()) || null;
  }
};
