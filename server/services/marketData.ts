import { MarketAsset, MarketMoversData, MarketAssetType } from '../../src/types';

interface AssetSpec {
  symbol: string;
  tdSymbol: string;
  name: string;
  type: MarketAssetType;
}

// Master list of assets configured in PULSE
export const CONFIGURED_ASSETS: AssetSpec[] = [
  // Ticker Assets
  { symbol: 'BTC', tdSymbol: 'BTC/USD', name: 'Bitcoin', type: 'crypto' },
  { symbol: 'ETH', tdSymbol: 'ETH/USD', name: 'Ethereum', type: 'crypto' },
  { symbol: 'SOL', tdSymbol: 'SOL/USD', name: 'Solana', type: 'crypto' },
  { symbol: 'S&P 500', tdSymbol: 'SPX', name: 'S&P 500 Index', type: 'index' },
  { symbol: 'NASDAQ', tdSymbol: 'IXIC', name: 'Nasdaq Composite', type: 'index' },
  { symbol: 'Dow Jones', tdSymbol: 'DJI', name: 'Dow Jones Industrial', type: 'index' },
  { symbol: 'GOLD', tdSymbol: 'XAU/USD', name: 'Gold Futures', type: 'commodity' },
  { symbol: 'OIL', tdSymbol: 'WTI', name: 'Crude Oil WTI', type: 'commodity' },
  { symbol: 'EUR/USD', tdSymbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'forex' },
  { symbol: 'GBP/USD', tdSymbol: 'GBP/USD', name: 'British Pound / US Dollar', type: 'forex' },
  { symbol: 'USD/JPY', tdSymbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', type: 'forex' },

  // Equity & Mover Assets
  { symbol: 'AAPL', tdSymbol: 'AAPL', name: 'Apple Inc', type: 'stock' },
  { symbol: 'NVDA', tdSymbol: 'NVDA', name: 'NVIDIA Corp', type: 'stock' },
  { symbol: 'MSFT', tdSymbol: 'MSFT', name: 'Microsoft Corp', type: 'stock' },
  { symbol: 'AMZN', tdSymbol: 'AMZN', name: 'Amazon.com Inc', type: 'stock' },
  { symbol: 'TSLA', tdSymbol: 'TSLA', name: 'Tesla Inc', type: 'stock' },
  { symbol: 'AVAX', tdSymbol: 'AVAX/USD', name: 'Avalanche', type: 'crypto' },
  { symbol: 'INTC', tdSymbol: 'INTC', name: 'Intel Corp', type: 'stock' },
  { symbol: 'DOGE', tdSymbol: 'DOGE/USD', name: 'Dogecoin', type: 'crypto' },
  { symbol: 'BABA', tdSymbol: 'BABA', name: 'Alibaba Group', type: 'stock' },
  { symbol: 'XRP', tdSymbol: 'XRP/USD', name: 'Ripple', type: 'crypto' },
  { symbol: 'SPY', tdSymbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'stock' },
];

export interface MarketDataResponse {
  tickers: MarketAsset[];
  movers: MarketMoversData;
  allAssets: MarketAsset[];
  timestamp: string;
  source: 'twelvedata' | 'unavailable';
}

// In-Memory Cache (60 seconds TTL)
let cache: { data: MarketDataResponse; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

function formatVolume(rawVol: string | number | undefined): string {
  if (!rawVol) return '—';
  const vol = typeof rawVol === 'string' ? parseFloat(rawVol) : rawVol;
  if (isNaN(vol) || vol <= 0) return '—';

  if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}K`;
  return vol.toLocaleString();
}

/**
  Fetch market quotes from Twelve Data API using batch symbol request
 */
export async function getMarketData(): Promise<MarketDataResponse> {
  const now = Date.now();

  // Return cached data if valid
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  const apiKey = process.env.TWELVEDATA_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.warn('[Market Data Service] TWELVEDATA_API_KEY environment variable is not set or empty. Returning default unavailable assets.');
    return buildFallbackResponse('unavailable');
  }

  try {
    // Unique Twelve Data symbols to query
    const tdSymbols = Array.from(new Set(CONFIGURED_ASSETS.map((a) => a.tdSymbol)));
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(tdSymbols.join(','))}&apikey=${apiKey.trim()}`;

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      console.error(`[Market Data Service] Twelve Data HTTP Error: ${res.status} ${res.statusText}`);
      if (cache) return cache.data;
      return buildFallbackResponse('unavailable');
    }

    const json = await res.json();

    if (json.status === 'error' || json.code === 400 || json.code === 401 || json.code === 429) {
      console.error('[Market Data Service] Twelve Data API Error:', json.message || json);
      if (cache) return cache.data;
      return buildFallbackResponse('unavailable');
    }

    // Map Twelve Data responses back to MarketAsset specs
    const timestampStr = new Date().toISOString();
    const resultMap = new Map<string, MarketAsset>();

    for (const spec of CONFIGURED_ASSETS) {
      const tdQuote = json[spec.tdSymbol] || (json.symbol === spec.tdSymbol ? json : null);

      if (tdQuote && !tdQuote.code && tdQuote.status !== 'error') {
        const rawPrice = tdQuote.close || tdQuote.price;
        const price = rawPrice !== undefined && rawPrice !== null ? parseFloat(rawPrice) : null;
        const change = tdQuote.change !== undefined && tdQuote.change !== null ? parseFloat(tdQuote.change) : null;
        const changePercent = tdQuote.percent_change !== undefined && tdQuote.percent_change !== null ? parseFloat(tdQuote.percent_change) : null;

        const isValidPrice = price !== null && !isNaN(price) && price > 0;

        const asset: MarketAsset = {
          symbol: spec.symbol,
          name: tdQuote.name || spec.name,
          type: spec.type,
          price: isValidPrice ? Math.round(price * 10000) / 10000 : null,
          change: isValidPrice && change !== null && !isNaN(change) ? Math.round(change * 10000) / 10000 : null,
          changePercent: isValidPrice && changePercent !== null && !isNaN(changePercent) ? Math.round(changePercent * 100) / 100 : null,
          volume: formatVolume(tdQuote.volume),
          status: isValidPrice ? 'active' : 'placeholder',
          updatedAt: timestampStr,
        };

        resultMap.set(spec.symbol, asset);
      } else {
        // Asset not available or unsupported by provider plan
        resultMap.set(spec.symbol, {
          symbol: spec.symbol,
          name: spec.name,
          type: spec.type,
          price: null,
          change: null,
          changePercent: null,
          volume: '—',
          status: 'placeholder',
          updatedAt: timestampStr,
        });
      }
    }

    const allAssets = Array.from(resultMap.values());

    // Ticker list (first 8 configured ticker assets)
    const tickerSymbols = ['BTC', 'ETH', 'SOL', 'S&P 500', 'NASDAQ', 'GOLD', 'OIL', 'EUR/USD'];
    const tickers = tickerSymbols.map((sym) => resultMap.get(sym)!).filter(Boolean);

    // Movers lists
    const gainersSymbols = ['NVDA', 'SOL', 'TSLA', 'AVAX'];
    const losersSymbols = ['INTC', 'DOGE', 'BABA', 'XRP'];
    const activeSymbols = ['BTC', 'SPY', 'ETH', 'AAPL'];

    // Dynamically sort gainers and losers if real market data exists, otherwise keep defined groups
    const activeAssetsWithPrices = allAssets.filter((a) => a.price !== null);

    let gainers = gainersSymbols.map((sym) => resultMap.get(sym)!).filter(Boolean);
    let losers = losersSymbols.map((sym) => resultMap.get(sym)!).filter(Boolean);
    let mostActive = activeSymbols.map((sym) => resultMap.get(sym)!).filter(Boolean);

    if (activeAssetsWithPrices.length >= 4) {
      const sortedByChange = [...activeAssetsWithPrices].sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));
      gainers = sortedByChange.slice(0, 4);
      losers = [...sortedByChange].reverse().slice(0, 4);
    }

    const response: MarketDataResponse = {
      tickers,
      movers: {
        gainers,
        losers,
        mostActive,
      },
      allAssets,
      timestamp: timestampStr,
      source: 'twelvedata',
    };

    cache = { data: response, timestamp: now };
    return response;
  } catch (err: any) {
    console.error('[Market Data Service] Error fetching market quotes:', err?.message || err);
    if (cache) return cache.data;
    return buildFallbackResponse('unavailable');
  }
}

function buildFallbackResponse(source: 'unavailable'): MarketDataResponse {
  const timestampStr = new Date().toISOString();

  const allAssets: MarketAsset[] = CONFIGURED_ASSETS.map((spec) => ({
    symbol: spec.symbol,
    name: spec.name,
    type: spec.type,
    price: null,
    change: null,
    changePercent: null,
    volume: '—',
    status: 'placeholder',
    updatedAt: timestampStr,
  }));

  const resultMap = new Map(allAssets.map((a) => [a.symbol, a]));

  const tickerSymbols = ['BTC', 'ETH', 'SOL', 'S&P 500', 'NASDAQ', 'GOLD', 'OIL', 'EUR/USD'];
  const tickers = tickerSymbols.map((sym) => resultMap.get(sym)!).filter(Boolean);

  const movers: MarketMoversData = {
    gainers: ['NVDA', 'SOL', 'TSLA', 'AVAX'].map((sym) => resultMap.get(sym)!).filter(Boolean),
    losers: ['INTC', 'DOGE', 'BABA', 'XRP'].map((sym) => resultMap.get(sym)!).filter(Boolean),
    mostActive: ['BTC', 'SPY', 'ETH', 'AAPL'].map((sym) => resultMap.get(sym)!).filter(Boolean),
  };

  return {
    tickers,
    movers,
    allAssets,
    timestamp: timestampStr,
    source,
  };
}
