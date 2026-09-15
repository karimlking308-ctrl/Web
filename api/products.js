/**
 * TinDry // Stealth Luxury Atelier
 * Vercel Serverless Function: GET /api/products
 * 
 * Proxies requests server-to-server to the Printify API.
 * - Protects PRINTIFY_API_KEY from exposure on the client browser.
 * - Resolves CORS restrictions transparently.
 * - Auto-discovers the active Shop ID if PRINTIFY_SHOP_ID is not preset.
 */

export default async function handler(req, res) {
  // 1. Set full CORS headers for browser clients and preflight requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // 2. Handle HTTP OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Only permit GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: `HTTP method ${req.method} is not supported. Use GET.`
    });
  }

  const apiKey = process.env.PRINTIFY_API_KEY;
  let shopId = process.env.PRINTIFY_SHOP_ID;

  // 4. Validate presence of server-side API Key
  if (!apiKey) {
    console.error('[TinDry Security] Missing PRINTIFY_API_KEY environment variable.');
    return res.status(500).json({
      error: 'Server configuration error',
      message: 'PRINTIFY_API_KEY is not configured in Vercel environment variables.'
    });
  }

  try {
    // 5. If Shop ID is not explicitly configured, automatically query Printify for the primary shop
    if (!shopId) {
      console.log('[TinDry Atelier] Querying Printify /v1/shops.json to discover active shop ID...');
      const shopsResponse = await fetch('https://api.printify.com/v1/shops.json', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'User-Agent': 'TinDry-Stealth-Luxury/1.0.0 (Vercel Serverless)'
        }
      });

      if (!shopsResponse.ok) {
        const errorText = await shopsResponse.text();
        console.error(`[TinDry Atelier] Failed to resolve shops (${shopsResponse.status}): ${errorText}`);
        return res.status(shopsResponse.status).json({
          error: 'Printify Authentication Failed',
          statusCode: shopsResponse.status,
          details: errorText
        });
      }

      const shops = await shopsResponse.json();
      if (!Array.isArray(shops) || shops.length === 0) {
        return res.status(404).json({
          error: 'No active shops found',
          message: 'No Printify shop is linked to the provided API token.'
        });
      }

      shopId = shops[0].id;
      console.log(`[TinDry Atelier] Auto-discovered Shop ID: ${shopId} (${shops[0].title || 'Primary Atelier'})`);
    }

    // 6. Fetch published products for the resolved Shop ID
    const targetUrl = `https://api.printify.com/v1/shops/${shopId}/products.json`;
    console.log(`[TinDry Atelier] Fetching products from ${targetUrl}...`);

    const productsResponse = await fetch(targetUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'TinDry-Stealth-Luxury/1.0.0 (Vercel Serverless)'
      }
    });

    if (!productsResponse.ok) {
      const errorText = await productsResponse.text();
      console.error(`[TinDry Atelier] Printify API error (${productsResponse.status}): ${errorText}`);
      return res.status(productsResponse.status).json({
        error: 'Printify Product Retrieval Failed',
        statusCode: productsResponse.status,
        details: errorText
      });
    }

    const productsData = await productsResponse.json();

    // 7. Edge caching headers: 60s shared cache, 120s stale-while-revalidate
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

    // Return the clean JSON payload to the frontend
    return res.status(200).json(productsData);

  } catch (error) {
    console.error('[TinDry Atelier] Serverless execution exception:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred while communicating with Printify.'
    });
  }
}
