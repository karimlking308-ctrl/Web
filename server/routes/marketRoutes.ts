import { Router } from 'express';
import { getMarketData } from '../services/marketData';

export const marketRouter = Router();

/**
 * GET /api/markets
 * Fetches real-time market data quotes from Twelve Data (or cached data if within TTL).
 * Never exposes server API keys or private credentials.
 */
marketRouter.get('/', async (req, res) => {
  try {
    const data = await getMarketData();
    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=60');
    return res.json(data);
  } catch (error: any) {
    console.error('[Market Routes Error]:', error?.message || error);
    return res.status(500).json({ error: 'Failed to retrieve market data' });
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
