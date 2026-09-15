/**
 * TinDry // Stealth Luxury Atelier
 * Vercel Serverless Function: GET /api/products
 * 
 * Proxies requests server-to-server to the Printify API.
 * - Protects PRINTIFY_API_KEY from exposure on the client browser.
 * - Resolves CORS restrictions transparently.
 * - Validates Shop ID against user's actual shops to avoid invalid IDs (e.g. placeholder PRINTIFY_SHOP_ID=1).
 * - Gracefully serves curated high-end foundation garments if Printify returns no items.
 */

const FALLBACK_ATELIER_PRODUCTS = [
  {
    id: "tindry-heavyweight-tee",
    title: "TinDry Heavyweight Boxy Tee (280 GSM)",
    description: "Architectural boxy cut crafted from combed ring-spun Aegean cotton. Double-needle collar binding and anti-curl structure.",
    images: [{ src: "/images/lifestyle-tshirt.jpg" }],
    variants: [{ price: 4800 }]
  },
  {
    id: "tindry-structured-hoodie",
    title: "TinDry Structured Thermal Hoodie (480 GSM)",
    description: "Ultra-dense French terry with brushed micro-fleece interior. Raglan sleeve architecture and reinforced rib cuffs.",
    images: [{ src: "/images/lifestyle-hoodie.jpg" }],
    variants: [{ price: 9200 }]
  },
  {
    id: "tindry-capsule-suite",
    title: "TinDry Atelier Capsule Suite 01",
    description: "Curated collection package including the 480 GSM hoodie, twin boxy tees, and structured industrial packaging.",
    images: [{ src: "/images/collection-group.jpg" }],
    variants: [{ price: 14900 }]
  },
  {
    id: "tindry-raw-cut-crewneck",
    title: "TinDry Raw-Edge Obsidian Crewneck",
    description: "Minimalist raw-hem silhouette with drop shoulders and silicone-washed matte finish. Stealth branding at nape.",
    images: [{ src: "/images/packaging-box.jpg" }],
    variants: [{ price: 7800 }]
  }
];

export default async function handler(req, res) {
  // 1. Set CORS headers for browser clients and preflight requests
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
  let configuredShopId = process.env.PRINTIFY_SHOP_ID;

  // 4. If no API key is provided, return curated fallback catalog gracefully
  if (!apiKey) {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({
      data: FALLBACK_ATELIER_PRODUCTS,
      status: 'demo_catalog',
      note: 'Configure PRINTIFY_API_KEY in Vercel to fetch live shop inventory.'
    });
  }

  try {
    let resolvedShopId = null;

    // 5. Always fetch the list of authorized shops to verify shop access & discover real shop IDs
    const shopsResponse = await fetch('https://api.printify.com/v1/shops.json', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'TinDry-Stealth-Luxury/1.0.0 (Vercel Serverless)'
      }
    });

    if (shopsResponse.ok) {
      const shops = await shopsResponse.json();
      if (Array.isArray(shops) && shops.length > 0) {
        // If configuredShopId matches one of the user's shops, use it; otherwise use the primary valid shop
        const matched = configuredShopId
          ? shops.find(s => String(s.id) === String(configuredShopId))
          : null;
        
        resolvedShopId = matched ? matched.id : shops[0].id;
      }
    } else {
      // If shops endpoint returned an error, fallback to configuredShopId if valid integer > 100
      if (configuredShopId && Number(configuredShopId) > 100) {
        resolvedShopId = configuredShopId;
      }
    }

    // If no valid shop could be resolved, serve fallback catalog cleanly without throwing
    if (!resolvedShopId) {
      return res.status(200).json({
        data: FALLBACK_ATELIER_PRODUCTS,
        status: 'fallback_active',
        notice: 'No accessible Printify shop found for provided credentials.'
      });
    }

    // 6. Fetch published products for the confirmed valid Shop ID
    const targetUrl = `https://api.printify.com/v1/shops/${resolvedShopId}/products.json`;

    const productsResponse = await fetch(targetUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'TinDry-Stealth-Luxury/1.0.0 (Vercel Serverless)'
      }
    });

    if (!productsResponse.ok) {
      // Serve fallback products safely if shop has no published permissions
      return res.status(200).json({
        data: FALLBACK_ATELIER_PRODUCTS,
        status: 'fallback_active'
      });
    }

    const productsData = await productsResponse.json();
    const liveProducts = Array.isArray(productsData) ? productsData : (productsData?.data || []);

    // If shop has 0 published products, display curated pieces
    if (!Array.isArray(liveProducts) || liveProducts.length === 0) {
      return res.status(200).json({
        data: FALLBACK_ATELIER_PRODUCTS,
        status: 'fallback_empty_shop'
      });
    }

    // 7. Edge caching headers: 60s shared cache, 120s stale-while-revalidate
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

    // Return the clean live JSON payload to the frontend
    return res.status(200).json(productsData);

  } catch (error) {
    // Return curated atelier products without crashing
    return res.status(200).json({
      data: FALLBACK_ATELIER_PRODUCTS,
      status: 'fallback_error',
      message: error.message
    });
  }
}
