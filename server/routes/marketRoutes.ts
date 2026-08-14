import { Router } from 'express';
import { getMarketData, getMarketChartData, getMarketOHLCData } from '../services/marketData';

export const marketRouter = Router();

/**
 * GET /api/markets
 * Fetches real-time CoinGecko crypto market data quotes (or cached data if within TTL).
 * Never exposes server API keys or private credentials.
 */
marketRouter.get('/', async (req, res) => {
  try {
    const data = await getMarketData();
    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=60');
    return res.json(data);
  } catch (error: any) {
    console.error('[Market Routes Error]:', error?.message || error);
    return res.status(500).json({ error: 'Failed to retrieve CoinGecko market data' });
  }
});

/**
 * GET /api/markets/quote/:symbol
 * Fetches real-time quote for a specific symbol
 */
marketRouter.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await getMarketData();
    const asset = data.allAssets.find(
      (a) => a.symbol.toLowerCase() === symbol.toLowerCase()
    );

    if (!asset) {
      return res.status(404).json({ error: `Asset with symbol '${symbol}' not found` });
    }

    return res.json(asset);
  } catch (error: any) {
    console.error('[Market Route Symbol Error]:', error?.message || error);
    return res.status(500).json({ error: 'Failed to retrieve asset quote' });
  }
});

/**
 * GET /api/markets/chart/:symbol
 * Fetches historical market chart data from CoinGecko
 */
marketRouter.get('/chart/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const days = parseInt(req.query.days as string) || 7;
    const chartData = await getMarketChartData(symbol, days);

    if (!chartData) {
      return res.status(404).json({ error: `Chart data for symbol '${symbol}' unavailable` });
    }

    res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=300');
    return res.json(chartData);
  } catch (error: any) {
    console.error('[Market Route Chart Error]:', error?.message || error);
    return res.status(500).json({ error: 'Failed to retrieve market chart data' });
  }
});

/**
 * GET /api/markets/ohlc/:symbol
 * Fetches OHLC candlestick market data from CoinGecko
 */
marketRouter.get('/ohlc/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const days = parseInt(req.query.days as string) || 7;
    const ohlcData = await getMarketOHLCData(symbol, days);

    if (!ohlcData) {
      return res.status(404).json({ error: `OHLC data for symbol '${symbol}' unavailable` });
    }

    res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=300');
    return res.json(ohlcData);
  } catch (error: any) {
    console.error('[Market Route OHLC Error]:', error?.message || error);
    return res.status(500).json({ error: 'Failed to retrieve OHLC market data' });
  }
});
