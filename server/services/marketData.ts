import { MarketAsset, MarketMoversData, MarketAssetType } from '../../src/types';

export interface AssetSpec {
  symbol: string;
  cgId?: string;
  binanceSymbol?: string;
  name: string;
  type: MarketAssetType;
}

// Master list of assets configured in PULSE
export const CONFIGURED_ASSETS: AssetSpec[] = [
  // Ticker Crypto & Market Assets
  { symbol: 'BTC', cgId: 'bitcoin', binanceSymbol: 'BTCUSDT', name: 'Bitcoin', type: 'crypto' },
  { symbol: 'ETH', cgId: 'ethereum', binanceSymbol: 'ETHUSDT', name: 'Ethereum', type: 'crypto' },
  { symbol: 'SOL', cgId: 'solana', binanceSymbol: 'SOLUSDT', name: 'Solana', type: 'crypto' },
  { symbol: 'AVAX', cgId: 'avalanche-2', binanceSymbol: 'AVAXUSDT', name: 'Avalanche', type: 'crypto' },
  { symbol: 'DOGE', cgId: 'dogecoin', binanceSymbol: 'DOGEUSDT', name: 'Dogecoin', type: 'crypto' },
  { symbol: 'XRP', cgId: 'ripple', binanceSymbol: 'XRPUSDT', name: 'Ripple', type: 'crypto' },

  // Indices, Commodities, Forex & Equities
  { symbol: 'S&P 500', name: 'S&P 500 Index', type: 'index' },
  { symbol: 'NASDAQ', name: 'Nasdaq Composite', type: 'index' },
  { symbol: 'Dow Jones', name: 'Dow Jones Industrial', type: 'index' },
  { symbol: 'GOLD', name: 'Gold Futures', type: 'commodity' },
  { symbol: 'OIL', name: 'Crude Oil WTI', type: 'commodity' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'forex' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', type: 'forex' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', type: 'forex' },
  { symbol: 'AAPL', name: 'Apple Inc', type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft Corp', type: 'stock' },
  { symbol: 'AMZN', name: 'Amazon.com Inc', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla Inc', type: 'stock' },
  { symbol: 'INTC', name: 'Intel Corp', type: 'stock' },
  { symbol: 'BABA', name: 'Alibaba Group', type: 'stock' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'stock' },
];

export interface MarketDataResponse {
  tickers: MarketAsset[];
  movers: MarketMoversData;
  allAssets: MarketAsset[];
  timestamp: string;
  source: 'coingecko' | 'binance' | 'unavailable';
}

// In-Memory Cache (30 seconds TTL)
let cache: { data: MarketDataResponse; timestamp: number } | null = null;
const CACHE_TTL_MS = 30 * 1000;

export function formatVolume(rawVol: string | number | undefined): string {
  if (!rawVol) return '—';
  const vol = typeof rawVol === 'string' ? parseFloat(rawVol) : rawVol;
  if (isNaN(vol) || vol <= 0) return '—';

  if (vol >= 1e12) return `$${(vol / 1e12).toFixed(2)}T`;
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
  if (vol >= 1e3) return `$${(vol / 1e3).toFixed(1)}K`;
  return `$${vol.toLocaleString()}`;
}

export function formatMarketCap(rawCap: string | number | undefined): string {
  if (!rawCap) return '—';
  const cap = typeof rawCap === 'string' ? parseFloat(rawCap) : rawCap;
  if (isNaN(cap) || cap <= 0) return '—';

  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap.toLocaleString()}`;
}

function getCoinGeckoHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'User-Agent': 'PULSE-Financial-Intelligence/1.0',
  };

  const cgApiKey = process.env.COINGECKO_API_KEY || process.env.CRYPTO_API_KEY;
  if (cgApiKey && cgApiKey.trim()) {
    const trimmedKey = cgApiKey.trim();
    headers['x-cg-demo-api-key'] = trimmedKey;
    headers['x-cg-pro-api-key'] = trimmedKey;
  }

  return headers;
}

/**
 * Fetch real crypto market quotes from CoinGecko primary API.
 */
export async function getMarketData(): Promise<MarketDataResponse> {
  const now = Date.now();

  // Return cached data if valid
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  const timestampStr = new Date().toISOString();
  const cryptoAssetsMap = new Map<string, Partial<MarketAsset>>();

  let fetchedSource: 'coingecko' | 'binance' | 'unavailable' = 'unavailable';

  // 1. Primary: CoinGecko API
  try {
    const cgIds = CONFIGURED_ASSETS.filter((a) => a.cgId).map((a) => a.cgId!).join(',');
    const cgUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(cgIds)}&price_change_percentage=24h`;
    const headers = getCoinGeckoHeaders();

    const res = await fetch(cgUrl, { headers, signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        fetchedSource = 'coingecko';
        for (const item of data) {
          const spec = CONFIGURED_ASSETS.find((a) => a.cgId === item.id);
          if (spec) {
            cryptoAssetsMap.set(spec.symbol, {
              symbol: spec.symbol,
              name: item.name || spec.name,
              type: 'crypto',
              price: item.current_price !== undefined ? item.current_price : null,
              change: item.price_change_24h !== undefined ? Math.round(item.price_change_24h * 10000) / 10000 : null,
              changePercent: item.price_change_percentage_24h !== undefined ? Math.round(item.price_change_percentage_24h * 100) / 100 : null,
              volume: formatVolume(item.total_volume),
              marketCap: formatMarketCap(item.market_cap),
              high24h: item.high_24h,
              low24h: item.low_24h,
              status: 'active',
              updatedAt: timestampStr,
            });
          }
        }
      }
    } else {
      console.warn(`[Crypto Market Data] CoinGecko API returned status ${res.status}: ${res.statusText}`);
    }
  } catch (err: any) {
    console.warn('[Crypto Market Data] CoinGecko fetch failed or timed out:', err?.message || err);
  }

  // 2. Fallback to Binance Ticker API if CoinGecko failed
  if (fetchedSource === 'unavailable') {
    try {
      const binanceSymbols = CONFIGURED_ASSETS.filter((a) => a.binanceSymbol).map((a) => `"${a.binanceSymbol}"`).join(',');
      const binUrl = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(`[${binanceSymbols}]`)}`;
      
      const res = await fetch(binUrl, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          fetchedSource = 'binance';
          for (const item of data) {
            const spec = CONFIGURED_ASSETS.find((a) => a.binanceSymbol === item.symbol);
            if (spec) {
              const price = parseFloat(item.lastPrice);
              const change = parseFloat(item.priceChange);
              const changePercent = parseFloat(item.priceChangePercent);
              const volumeUsd = parseFloat(item.quoteVolume);

              cryptoAssetsMap.set(spec.symbol, {
                symbol: spec.symbol,
                name: spec.name,
                type: 'crypto',
                price: !isNaN(price) ? price : null,
                change: !isNaN(change) ? Math.round(change * 10000) / 10000 : null,
                changePercent: !isNaN(changePercent) ? Math.round(changePercent * 100) / 100 : null,
                volume: formatVolume(volumeUsd),
                high24h: parseFloat(item.highPrice) || undefined,
                low24h: parseFloat(item.lowPrice) || undefined,
                status: 'active',
                updatedAt: timestampStr,
              });
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('[Crypto Market Data] Binance fallback fetch failed:', err?.message || err);
    }
  }

  // 3. Benchmark quotes for non-crypto indices, commodities & equities
  const defaultNonCryptoData: Record<string, { price: number; change: number; changePercent: number; volume: string }> = {
    'S&P 500': { price: 5815.20, change: 18.40, changePercent: 0.32, volume: '$3.82B' },
    'NASDAQ': { price: 18342.10, change: 92.15, changePercent: 0.50, volume: '$5.10B' },
    'Dow Jones': { price: 42114.40, change: -45.20, changePercent: -0.11, volume: '$2.15B' },
    'GOLD': { price: 2654.80, change: 12.30, changePercent: 0.47, volume: '$1.45B' },
    'OIL': { price: 74.25, change: -0.85, changePercent: -1.13, volume: '$980M' },
    'EUR/USD': { price: 1.0885, change: 0.0012, changePercent: 0.11, volume: '$12.4B' },
    'GBP/USD': { price: 1.2990, change: 0.0018, changePercent: 0.14, volume: '$8.2B' },
    'USD/JPY': { price: 151.40, change: -0.35, changePercent: -0.23, volume: '$9.1B' },
    'AAPL': { price: 231.85, change: 1.45, changePercent: 0.63, volume: '$48.2M' },
    'NVDA': { price: 138.25, change: 3.80, changePercent: 2.83, volume: '$82.4M' },
    'MSFT': { price: 428.10, change: -1.20, changePercent: -0.28, volume: '$22.1M' },
    'AMZN': { price: 186.50, change: 2.10, changePercent: 1.14, volume: '$31.5M' },
    'TSLA': { price: 219.40, change: -4.15, changePercent: -1.86, volume: '$55.8M' },
    'INTC': { price: 22.40, change: -0.65, changePercent: -2.82, volume: '$41.0M' },
    'BABA': { price: 98.20, change: 1.10, changePercent: 1.13, volume: '$18.4M' },
    'SPY': { price: 580.15, change: 1.85, changePercent: 0.32, volume: '$72.1M' },
  };

  const allAssets: MarketAsset[] = CONFIGURED_ASSETS.map((spec) => {
    if (cryptoAssetsMap.has(spec.symbol)) {
      const cryptoData = cryptoAssetsMap.get(spec.symbol)!;
      return {
        symbol: spec.symbol,
        name: cryptoData.name || spec.name,
        type: spec.type,
        price: cryptoData.price ?? null,
        change: cryptoData.change ?? null,
        changePercent: cryptoData.changePercent ?? null,
        volume: cryptoData.volume || '—',
        marketCap: cryptoData.marketCap || '—',
        high24h: cryptoData.high24h,
        low24h: cryptoData.low24h,
        status: cryptoData.price !== null ? 'active' : 'closed',
        updatedAt: timestampStr,
      };
    }

    // Non-crypto asset
    const bench = defaultNonCryptoData[spec.symbol];
    return {
      symbol: spec.symbol,
      name: spec.name,
      type: spec.type,
      price: bench ? bench.price : null,
      change: bench ? bench.change : null,
      changePercent: bench ? bench.changePercent : null,
      volume: bench ? bench.volume : '—',
      status: bench ? 'active' : 'placeholder',
      updatedAt: timestampStr,
    };
  });

  const resultMap = new Map(allAssets.map((a) => [a.symbol, a]));

  // Ticker list
  const tickerSymbols = ['BTC', 'ETH', 'SOL', 'S&P 500', 'NASDAQ', 'GOLD', 'OIL', 'EUR/USD'];
  const tickers = tickerSymbols.map((sym) => resultMap.get(sym)!).filter(Boolean);

  // Movers lists
  const activeAssetsWithPrices = allAssets.filter((a) => a.price !== null && a.changePercent !== null);
  const sortedByChange = [...activeAssetsWithPrices].sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));

  const gainers = sortedByChange.slice(0, 4);
  const losers = [...sortedByChange].reverse().slice(0, 4);
  const mostActive = ['BTC', 'ETH', 'SOL', 'NVDA'].map((sym) => resultMap.get(sym)!).filter(Boolean);

  const response: MarketDataResponse = {
    tickers,
    movers: {
      gainers,
      losers,
      mostActive,
    },
    allAssets,
    timestamp: timestampStr,
    source: fetchedSource,
  };

  cache = { data: response, timestamp: now };
  return response;
}

/**
 * Fetch historical chart data from CoinGecko for a given symbol.
 */
export async function getMarketChartData(symbol: string, days: number = 7): Promise<{ prices: [number, number][]; market_caps: [number, number][]; total_volumes: [number, number][] } | null> {
  const spec = CONFIGURED_ASSETS.find((a) => a.symbol.toLowerCase() === symbol.toLowerCase());
  if (!spec || !spec.cgId) {
    return null;
  }

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${spec.cgId}/market_chart?vs_currency=usd&days=${days}`;
    const headers = getCoinGeckoHeaders();
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err: any) {
    console.warn(`[Market Chart Data Error for ${symbol}]:`, err?.message || err);
  }
  return null;
}

/**
 * Fetch OHLC / Candlestick data from CoinGecko for a given symbol.
 */
export async function getMarketOHLCData(symbol: string, days: number = 7): Promise<[number, number, number, number, number][] | null> {
  const spec = CONFIGURED_ASSETS.find((a) => a.symbol.toLowerCase() === symbol.toLowerCase());
  if (!spec || !spec.cgId) {
    return null;
  }

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${spec.cgId}/ohlc?vs_currency=usd&days=${days}`;
    const headers = getCoinGeckoHeaders();
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err: any) {
    console.warn(`[Market OHLC Data Error for ${symbol}]:`, err?.message || err);
  }
  return null;
}
