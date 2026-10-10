import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file if available
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Canonical HTTPS & www.tindry.com 301 Permanent Redirect Middleware
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase().split(':')[0];
  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = forwardedProto 
    ? (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto.split(',')[0].trim())
    : (req.secure ? 'https' : req.protocol);

  // 1. Redirect non-www tindry.com to preferred canonical https://www.tindry.com/
  if (host === 'tindry.com') {
    return res.redirect(301, `https://www.tindry.com${req.originalUrl}`);
  }

  // 2. Redirect http://www.tindry.com to https://www.tindry.com
  if (host === 'www.tindry.com' && proto === 'http') {
    return res.redirect(301, `https://www.tindry.com${req.originalUrl}`);
  }

  next();
});

// Enable CORS for client-to-server calls
app.use(cors());
app.use(express.json());

// Serve static assets (HTML, CSS, images, client scripts)
app.use(express.static(__dirname));

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TinDry Printify Gateway',
    timestamp: new Date().toISOString()
  });
});

/**
 * Secure Backend Proxy Endpoint: /api/products
 * Proxies requests to Printify API to protect your API token from client-side exposure.
 */
app.get('/api/products', async (req, res) => {
  const apiKey = process.env.PRINTIFY_API_KEY;
  let shopId = process.env.PRINTIFY_SHOP_ID;

  // Validate API key presence
  if (!apiKey) {
    console.error('[SECURITY ERROR] PRINTIFY_API_KEY environment variable is not defined.');
    return res.status(500).json({
      error: 'Server misconfiguration: PRINTIFY_API_KEY is missing.',
      hint: 'Please define PRINTIFY_API_KEY in your server environment variables.'
    });
  }

  try {
    // If shopId is not explicitly set, auto-discover the primary shop ID
    if (!shopId) {
      console.log('[PRINTIFY PROXY] PRINTIFY_SHOP_ID not configured. Querying shops.json to discover active shop ID...');
      const shopsResponse = await fetch('https://api.printify.com/v1/shops.json', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'User-Agent': 'TinDry-Stealth-Luxury/1.0.0'
        }
      });

      if (!shopsResponse.ok) {
        const errorText = await shopsResponse.text();
        console.error(`[PRINTIFY ERROR] Failed to fetch shops (${shopsResponse.status}): ${errorText}`);
        return res.status(shopsResponse.status).json({
          error: 'Failed to authenticate with Printify API.',
          statusCode: shopsResponse.status,
          details: errorText
        });
      }

      const shops = await shopsResponse.json();
      if (!Array.isArray(shops) || shops.length === 0) {
        console.warn('[PRINTIFY WARN] No active shops found for the provided API key.');
        return res.status(404).json({
          error: 'No shops found under the configured Printify account.',
          data: []
        });
      }

      shopId = shops[0].id;
      console.log(`[PRINTIFY PROXY] Discovered Primary Shop ID: ${shopId} (${shops[0].title || 'Untitled Shop'})`);
    }

    // Query published products for the designated shop
    console.log(`[PRINTIFY PROXY] Fetching products for Shop ID: ${shopId}...`);
    const printifyUrl = `https://api.printify.com/v1/shops/${shopId}/products.json`;
    const productsResponse = await fetch(printifyUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'TinDry-Stealth-Luxury/1.0.0'
      }
    });

    if (!productsResponse.ok) {
      const errorText = await productsResponse.text();
      console.error(`[PRINTIFY ERROR] Failed to fetch products (${productsResponse.status}): ${errorText}`);
      return res.status(productsResponse.status).json({
        error: 'Failed to retrieve products from Printify.',
        statusCode: productsResponse.status,
        details: errorText
      });
    }

    const data = await productsResponse.json();
    console.log(`[PRINTIFY PROXY] Successfully retrieved ${(data.data || []).length} products.`);

    // Return the safe JSON payload to the frontend
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.json(data);

  } catch (error) {
    console.error('[PRINTIFY SERVER ERROR] Unexpected connection failure:', error);
    return res.status(500).json({
      error: 'Internal server error communicating with Printify API.',
      message: error.message
    });
  }
});

// Fallback route to serve index.html for single-page routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`
======================================================
  TINDRY // STEALTH LUXURY BACKEND PROXY ONLINE
  Port: ${PORT}
  Endpoint: http://localhost:${PORT}/api/products
  Client: http://localhost:${PORT}
======================================================
  `);
});
