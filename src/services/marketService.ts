import { MarketAsset, MarketMoversData } from '../types';

/**
 * Service interface for Market Data Feeds powered by CoinGecko API.
 */
export interface MarketService {
  getTickerAssets(): Promise<MarketAsset[]>;
  getMarketMovers(): Promise<MarketMoversData>;
  getAssetBySymbol(symbol: string): Promise<MarketAsset | null>;
  getChartData(symbol: string, days?: number): Promise<{ prices: [number, number][]; market_caps: [number, number][]; total_volumes: [number, number][] } | null>;
  getOHLCData(symbol: string, days?: number): Promise<[number, number, number, number, number][] | null>;
}

export const placeholderTickerAssets: MarketAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Live Feed' },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Live Feed' },
  { symbol: 'SOL', name: 'Solana', type: 'crypto', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Live Feed' },
  { symbol: 'S&P 500', name: 'S&P 500 Index', type: 'index', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Live Feed' },
  { symbol: 'NASDAQ', name: 'Nasdaq Composite', type: 'index', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Live Feed' },
  { symbol: 'GOLD', name: 'Gold Futures', type: 'commodity', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Live Feed' },
  { symbol: 'OIL', name: 'Crude Oil WTI', type: 'commodity', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Live Feed' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'forex', price: null, change: null, changePercent: null, status: 'placeholder', updatedAt: 'Live Feed' },
];

export const placeholderMarketMovers: MarketMoversData = {
  gainers: [
    { symbol: 'NVDA', name: 'NVIDIA Corp', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
    { symbol: 'SOL', name: 'Solana', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
    { symbol: 'TSLA', name: 'Tesla Inc', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
    { symbol: 'AVAX', name: 'Avalanche', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
  ],
  losers: [
    { symbol: 'INTC', name: 'Intel Corp', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
    { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
    { symbol: 'BABA', name: 'Alibaba Group', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
    { symbol: 'XRP', name: 'Ripple', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
  ],
  mostActive: [
    { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
    { symbol: 'ETH', name: 'Ethereum', type: 'crypto', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
    { symbol: 'AAPL', name: 'Apple Inc', type: 'stock', price: null, change: null, changePercent: null, volume: '—', status: 'placeholder', updatedAt: 'Live Feed' },
  ],
};

export interface MarketDataApiResponse {
  tickers: MarketAsset[];
  movers: MarketMoversData;
  allAssets: MarketAsset[];
  timestamp: string;
  source: string;
}

// In-flight promise deduplication & client cache
let activeFetchPromise: Promise<MarketDataApiResponse> | null = null;
let clientCache: { data: MarketDataApiResponse; timestamp: number } | null = null;
const CLIENT_CACHE_TTL = 15000; // 15 seconds client cache

async function fetchMarketData(): Promise<MarketDataApiResponse> {
  const now = Date.now();
  if (clientCache && now - clientCache.timestamp < CLIENT_CACHE_TTL) {
    return clientCache.data;
  }

  if (activeFetchPromise) {
    return activeFetchPromise;
  }

  activeFetchPromise = (async () => {
    try {
      const res = await fetch('/api/markets');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data: MarketDataApiResponse = await res.json();
      clientCache = { data, timestamp: Date.now() };
      return data;
    } catch (err) {
      console.warn('[MarketService] Failed to fetch market data from /api/markets:', err);
      return {
        tickers: placeholderTickerAssets,
        movers: placeholderMarketMovers,
        allAssets: [...placeholderTickerAssets, ...placeholderMarketMovers.gainers, ...placeholderMarketMovers.losers, ...placeholderMarketMovers.mostActive],
        timestamp: new Date().toISOString(),
        source: 'unavailable',
      };
    } finally {
      activeFetchPromise = null;
    }
  })();

  return activeFetchPromise;
}

export const marketService: MarketService = {
  async getTickerAssets(): Promise<MarketAsset[]> {
    const data = await fetchMarketData();
    return data.tickers && data.tickers.length > 0 ? data.tickers : placeholderTickerAssets;
  },

  async getMarketMovers(): Promise<MarketMoversData> {
    const data = await fetchMarketData();
    return data.movers || placeholderMarketMovers;
  },

  async getAssetBySymbol(symbol: string): Promise<MarketAsset | null> {
    const data = await fetchMarketData();
    const found = data.allAssets.find(a => a.symbol.toLowerCase() === symbol.toLowerCase());
    if (found) return found;
    const fallbackAll = [...placeholderTickerAssets, ...placeholderMarketMovers.gainers, ...placeholderMarketMovers.losers, ...placeholderMarketMovers.mostActive];
    return fallbackAll.find(a => a.symbol.toLowerCase() === symbol.toLowerCase()) || null;
  },

  async getChartData(symbol: string, days = 7) {
    try {
      const res = await fetch(`/api/markets/chart/${encodeURIComponent(symbol)}?days=${days}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`[MarketService] Failed to fetch chart data for ${symbol}:`, err);
    }
    return null;
  },

  async getOHLCData(symbol: string, days = 7) {
    try {
      const res = await fetch(`/api/markets/ohlc/${encodeURIComponent(symbol)}?days=${days}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`[MarketService] Failed to fetch OHLC data for ${symbol}:`, err);
    }
    return null;
  }
};
