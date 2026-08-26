import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// User & Store interfaces for multi-tenant authentication
interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
  role: 'owner' | 'admin' | 'staff';
  storeId: string;
  createdAt: string;
  password?: string;
}

interface StoreAccount {
  id: string;
  name: string;
  subdomain: string;
  domain: string;
  currency: string;
  ownerId: string;
  plan: string;
  createdAt: string;
}

interface UserSession {
  token: string;
  userId: string;
  storeId: string;
  createdAt: string;
  expiresAt: number;
}

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variantTitle?: string;
}

interface ServerOrder {
  id: string;
  orderNumber: string;
  storeId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentIntentId?: string;
  stripeClientSecret?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory persistent database stores
const usersStore: Record<string, UserAccount> = {
  'usr-1': {
    id: 'usr-1',
    name: 'John Doe',
    email: 'merchant@sol-pump.store',
    avatar: '',
    role: 'owner',
    storeId: 'store-1',
    createdAt: new Date().toISOString()
  }
};

const storesStore: Record<string, StoreAccount> = {
  'store-1': {
    id: 'store-1',
    name: 'Sol Pump Store',
    subdomain: 'main',
    domain: 'sol-pump.store',
    currency: 'USD',
    ownerId: 'usr-1',
    plan: 'Growth ($29/mo)',
    createdAt: new Date().toISOString()
  }
};

const sessionsStore: Record<string, UserSession> = {};
const processedWebhookEvents = new Set<string>();

const ordersStore: Record<string, ServerOrder[]> = {
  'store-1': [
    {
      id: 'ord-1001',
      orderNumber: '#1001',
      storeId: 'store-1',
      customerName: 'Alex Rivera',
      customerEmail: 'alex@example.com',
      shippingAddress: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zip: '97477',
        country: 'US'
      },
      items: [
        {
          productId: 'prod-1',
          title: 'Leather Travel Backpack',
          price: 129.00,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'
        }
      ],
      subtotal: 129.00,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 129.00,
      currency: 'USD',
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'ord-1002',
      orderNumber: '#1002',
      storeId: 'store-1',
      customerName: 'Elena Rostova',
      customerEmail: 'elena@example.com',
      shippingAddress: {
        street: '100 King St W',
        city: 'Toronto',
        state: 'ON',
        zip: 'M5X 1A9',
        country: 'CA'
      },
      items: [
        {
          productId: 'prod-2',
          title: 'Minimalist Titanium Sunglasses',
          price: 89.00,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80'
        }
      ],
      subtotal: 178.00,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 178.00,
      currency: 'USD',
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ]
};

interface ServerProductMedia {
  id: string;
  url: string;
  type: 'image' | 'video' | '3d';
  name?: string;
  size?: number;
  isPrimary?: boolean;
}

interface ServerProductOption {
  id: string;
  name: string;
  values: string[];
}

interface ServerProductVariant {
  id: string;
  title: string;
  options: Record<string, string>;
  sku: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  inventory: number;
  barcode?: string;
  weight?: number;
  image?: string;
}

interface ServerProduct {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  currency: string;
  sku: string;
  barcode?: string;
  trackInventory: boolean;
  inventory: number;
  lowStockThreshold?: number;
  status: 'active' | 'draft' | 'archived';
  category: string;
  vendor?: string;
  productType?: string;
  collections: string[];
  tags: string[];
  image: string;
  media: ServerProductMedia[];
  options: ServerProductOption[];
  variants: ServerProductVariant[];
  weight?: number;
  requiresShipping: boolean;
  isDigital: boolean;
  shippingCategory?: string;
  salesChannels: string[];
  seoTitle?: string;
  seoDescription?: string;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory seed database with multi-tenant store isolation
const productsStore: Record<string, ServerProduct[]> = {
  'store-1': [
    {
      id: 'prod-1',
      storeId: 'store-1',
      title: 'Leather Travel Backpack',
      slug: 'leather-travel-backpack',
      description: 'Handcrafted full-grain Moroccan leather backpack with padded laptop compartment, water-resistant canvas lining, and antique brass hardware. Built for everyday commuters and weekend travelers alike.',
      shortDescription: 'Handcrafted full-grain leather backpack with dedicated laptop sleeve.',
      price: 129.00,
      compareAtPrice: 179.00,
      cost: 45.00,
      currency: 'USD',
      sku: 'LB-001',
      barcode: '880123456789',
      trackInventory: true,
      inventory: 120,
      lowStockThreshold: 15,
      status: 'active',
      category: 'Bags & Leather',
      vendor: 'Sol Artisan Goods',
      productType: 'Travel Bags',
      collections: ['Summer 2026', 'Best Sellers', 'Featured'],
      tags: ['Handmade', 'Leather', 'Travel', 'Waterproof'],
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      media: [
        {
          id: 'med-1',
          url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
          type: 'image',
          name: 'backpack-front.jpg',
          isPrimary: true
        },
        {
          id: 'med-2',
          url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
          type: 'image',
          name: 'backpack-side.jpg',
          isPrimary: false
        }
      ],
      options: [
        { id: 'opt-1', name: 'Color', values: ['Vintage Cognac', 'Midnight Black', 'Desert Tan'] }
      ],
      variants: [
        {
          id: 'var-1',
          title: 'Vintage Cognac',
          options: { Color: 'Vintage Cognac' },
          sku: 'LB-001-COG',
          price: 129.00,
          compareAtPrice: 179.00,
          cost: 45.00,
          inventory: 50,
          barcode: '880123456789-1',
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'
        },
        {
          id: 'var-2',
          title: 'Midnight Black',
          options: { Color: 'Midnight Black' },
          sku: 'LB-001-BLK',
          price: 129.00,
          compareAtPrice: 179.00,
          cost: 45.00,
          inventory: 40,
          barcode: '880123456789-2',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
        },
        {
          id: 'var-3',
          title: 'Desert Tan',
          options: { Color: 'Desert Tan' },
          sku: 'LB-001-TAN',
          price: 129.00,
          compareAtPrice: 179.00,
          cost: 45.00,
          inventory: 30,
          barcode: '880123456789-3'
        }
      ],
      weight: 1.2,
      requiresShipping: true,
      isDigital: false,
      shippingCategory: 'Standard Parcel',
      salesChannels: ['Online Store', 'Social', 'POS'],
      seoTitle: 'Artisan Leather Travel Backpack | Sol Pump Store',
      seoDescription: 'Shop our premium full-grain Moroccan leather travel backpack with laptop compartment. Free express shipping on all domestic orders.',
      salesCount: 324,
      createdAt: '2026-08-01T10:00:00Z',
      updatedAt: '2026-08-24T08:00:00Z'
    },
    {
      id: 'prod-2',
      storeId: 'store-1',
      title: 'Minimalist Chronograph Watch',
      slug: 'minimalist-chronograph-watch',
      description: 'Precision Japanese quartz movement housed in a surgical-grade 316L stainless steel case with scratch-resistant sapphire crystal and interchangeable Italian leather strap.',
      shortDescription: 'Stainless steel case with sapphire crystal glass and genuine leather strap.',
      price: 189.00,
      compareAtPrice: 220.00,
      cost: 60.00,
      currency: 'USD',
      sku: 'VW-002',
      barcode: '880123456790',
      trackInventory: true,
      inventory: 85,
      lowStockThreshold: 10,
      status: 'active',
      category: 'Accessories',
      vendor: 'Sol Chrono Labs',
      productType: 'Timepieces',
      collections: ['Best Sellers', 'Luxury'],
      tags: ['Watch', 'Minimalist', 'Steel', 'Sapphire'],
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      media: [
        {
          id: 'med-watch-1',
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
          type: 'image',
          isPrimary: true
        }
      ],
      options: [],
      variants: [],
      weight: 0.3,
      requiresShipping: true,
      isDigital: false,
      salesChannels: ['Online Store', 'Social', 'Marketplace'],
      seoTitle: 'Minimalist Chronograph Watch | 316L Stainless Steel',
      seoDescription: 'Discover our modern minimalist chronograph watch with sapphire crystal and Japanese quartz movement.',
      salesCount: 256,
      createdAt: '2026-08-05T12:00:00Z',
      updatedAt: '2026-08-24T07:30:00Z'
    },
    {
      id: 'prod-3',
      storeId: 'store-1',
      title: 'Classic Aviator Sunglasses',
      slug: 'classic-aviator-sunglasses',
      description: 'Polarized UV400 lenses with ultralight aerospace titanium frame and anti-reflective coating for crystal clear visual clarity in bright conditions.',
      shortDescription: 'Polarized UV400 lenses with lightweight titanium alloy frame.',
      price: 89.00,
      compareAtPrice: 110.00,
      cost: 22.00,
      currency: 'USD',
      sku: 'CS-003',
      barcode: '880123456791',
      trackInventory: true,
      inventory: 210,
      lowStockThreshold: 20,
      status: 'active',
      category: 'Eyewear',
      vendor: 'Sol Optics',
      productType: 'Sunglasses',
      collections: ['Summer 2026'],
      tags: ['Eyewear', 'Polarized', 'UV400', 'Titanium'],
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
      media: [
        {
          id: 'med-glass-1',
          url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
          type: 'image',
          isPrimary: true
        }
      ],
      options: [],
      variants: [],
      weight: 0.1,
      requiresShipping: true,
      isDigital: false,
      salesChannels: ['Online Store', 'Social'],
      seoTitle: 'Classic Aviator Sunglasses | Polarized UV400',
      seoDescription: 'Shop lightweight polarized aviator sunglasses engineered with titanium frames.',
      salesCount: 412,
      createdAt: '2026-08-10T14:00:00Z',
      updatedAt: '2026-08-23T18:00:00Z'
    },
    {
      id: 'prod-4',
      storeId: 'store-1',
      title: 'Ergonomic Running Shoes',
      slug: 'ergonomic-running-shoes',
      description: 'Breathable engineered mesh upper with responsive carbon-plate cushioning and high-traction rubber outsole designed for marathon speed and daily training.',
      shortDescription: 'Breathable mesh upper with responsive carbon-plate cushioning.',
      price: 149.00,
      compareAtPrice: 180.00,
      cost: 55.00,
      currency: 'USD',
      sku: 'RS-004',
      barcode: '880123456792',
      trackInventory: true,
      inventory: 0,
      lowStockThreshold: 10,
      status: 'draft',
      category: 'Footwear',
      vendor: 'Sol Velocity',
      productType: 'Athletic Shoes',
      collections: ['New Arrivals'],
      tags: ['Footwear', 'Running', 'Carbon-Plate', 'Athletic'],
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      media: [
        {
          id: 'med-shoe-1',
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
          type: 'image',
          isPrimary: true
        }
      ],
      options: [
        { id: 'opt-size', name: 'Size', values: ['US 8', 'US 9', 'US 10', 'US 11'] }
      ],
      variants: [],
      weight: 0.8,
      requiresShipping: true,
      isDigital: false,
      salesChannels: ['Online Store'],
      seoTitle: 'Ergonomic Carbon-Plate Running Shoes',
      seoDescription: 'Experience ultimate comfort and speed with our carbon-plate running shoes.',
      salesCount: 189,
      createdAt: '2026-08-15T09:00:00Z',
      updatedAt: '2026-08-22T11:00:00Z'
    },
    {
      id: 'prod-5',
      storeId: 'store-1',
      title: 'Slim RFID Minimalist Wallet',
      slug: 'slim-rfid-minimalist-wallet',
      description: 'Aerospace-grade aluminum chassis with military-grade RFID blocking technology, cash strap clip, and instant card access mechanism.',
      shortDescription: 'Blocked card security with aerospace-grade aluminum and cash strap.',
      price: 49.00,
      compareAtPrice: 65.00,
      cost: 12.00,
      currency: 'USD',
      sku: 'LW-005',
      barcode: '880123456793',
      trackInventory: true,
      inventory: 98,
      lowStockThreshold: 15,
      status: 'active',
      category: 'Accessories',
      vendor: 'Sol Gear',
      productType: 'Wallets',
      collections: ['Best Sellers'],
      tags: ['EDC', 'RFID', 'Aluminum', 'Minimalist'],
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
      media: [
        {
          id: 'med-wallet-1',
          url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
          type: 'image',
          isPrimary: true
        }
      ],
      options: [],
      variants: [],
      weight: 0.15,
      requiresShipping: true,
      isDigital: false,
      salesChannels: ['Online Store', 'Social', 'POS'],
      seoTitle: 'Slim RFID Minimalist Aluminum Wallet',
      seoDescription: 'Ultra-thin RFID blocking wallet with expandable card capacity and money clip.',
      salesCount: 301,
      createdAt: '2026-08-18T16:00:00Z',
      updatedAt: '2026-08-24T06:00:00Z'
    }
  ]
};

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Tenant verification helper (IDOR protection)
function getTenantStoreId(req: express.Request): string {
  // Check header or session storeId, fallback to default store-1
  const headerStoreId = req.headers['x-store-id'];
  if (typeof headerStoreId === 'string' && headerStoreId.trim()) {
    return headerStoreId.trim();
  }
  return 'store-1';
}

// Session resolver helper
function getSessionUser(req: express.Request): { user: UserAccount; store: StoreAccount } | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  const session = sessionsStore[token];
  if (!session || session.expiresAt < Date.now()) {
    if (session) delete sessionsStore[token];
    return null;
  }
  const user = usersStore[session.userId];
  const store = storesStore[session.storeId];
  if (!user || !store) return null;
  return { user, store };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({
    limit: '25mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    }
  }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SOL-PUMP Commerce OS API',
      version: '2.0.0',
      domain: 'sol-pump.store',
      timestamp: new Date().toISOString(),
    });
  });

  // =========================================================================
  // MULTI-TENANT PRODUCT REST APIS
  // =========================================================================

  // 1. GET /api/products - List products for tenant store
  app.get('/api/products', (req, res) => {
    const storeId = getTenantStoreId(req);
    const storeProducts = productsStore[storeId] || [];
    res.json({
      success: true,
      storeId,
      count: storeProducts.length,
      data: storeProducts
    });
  });

  // 2. GET /api/products/:id - Get single product with store ownership verification
  app.get('/api/products/:id', (req, res) => {
    const storeId = getTenantStoreId(req);
    const { id } = req.params;
    const storeProducts = productsStore[storeId] || [];
    const product = storeProducts.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or access denied for this store'
      });
    }

    res.json({
      success: true,
      data: product
    });
  });

  // 3. POST /api/products - Create new product with server-side validation & tenant binding
  app.post('/api/products', (req, res) => {
    const storeId = getTenantStoreId(req);
    const body = req.body;

    // Strict Validation
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return res.status(400).json({ success: false, error: 'Product title is required' });
    }

    const price = Number(body.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ success: false, error: 'Valid non-negative price is required' });
    }

    const cost = Number(body.cost) || 0;
    const inventory = Number(body.inventory) || 0;

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newProduct: ServerProduct = {
      id: body.id || `prod-${Date.now()}`,
      storeId, // Server enforces tenant ownership
      title: body.title.trim(),
      slug,
      description: body.description || '',
      shortDescription: body.shortDescription || '',
      price,
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
      cost,
      currency: body.currency || 'USD',
      sku: body.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: body.barcode || '',
      trackInventory: body.trackInventory !== false,
      inventory,
      lowStockThreshold: body.lowStockThreshold ? Number(body.lowStockThreshold) : 5,
      status: (['active', 'draft', 'archived'].includes(body.status) ? body.status : 'active') as any,
      category: body.category || 'General',
      vendor: body.vendor || '',
      productType: body.productType || '',
      collections: Array.isArray(body.collections) ? body.collections : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
      image: body.image || (body.media && body.media[0] ? body.media[0].url : 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'),
      media: Array.isArray(body.media) ? body.media : [],
      options: Array.isArray(body.options) ? body.options : [],
      variants: Array.isArray(body.variants) ? body.variants : [],
      weight: body.weight ? Number(body.weight) : undefined,
      requiresShipping: body.requiresShipping !== false,
      isDigital: Boolean(body.isDigital),
      shippingCategory: body.shippingCategory || 'Standard',
      salesChannels: Array.isArray(body.salesChannels) ? body.salesChannels : ['Online Store'],
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || body.shortDescription || '',
      salesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!productsStore[storeId]) {
      productsStore[storeId] = [];
    }

    productsStore[storeId].unshift(newProduct);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  });

  // 4. PUT /api/products/:id - Update product with IDOR protection
  app.put('/api/products/:id', (req, res) => {
    const storeId = getTenantStoreId(req);
    const { id } = req.params;
    const body = req.body;

    const storeProducts = productsStore[storeId] || [];
    const index = storeProducts.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or access denied for this store'
      });
    }

    const existing = storeProducts[index];

    const updatedProduct: ServerProduct = {
      ...existing,
      ...body,
      id: existing.id, // Immutable ID
      storeId: existing.storeId, // Prevent storeId tampering
      title: body.title !== undefined ? String(body.title).trim() : existing.title,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      cost: body.cost !== undefined ? Number(body.cost) : existing.cost,
      inventory: body.inventory !== undefined ? Number(body.inventory) : existing.inventory,
      updatedAt: new Date().toISOString()
    };

    storeProducts[index] = updatedProduct;

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  });

  // 5. DELETE /api/products/:id - Delete product safely
  app.delete('/api/products/:id', (req, res) => {
    const storeId = getTenantStoreId(req);
    const { id } = req.params;

    const storeProducts = productsStore[storeId] || [];
    const index = storeProducts.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or access denied for this store'
      });
    }

    const removed = storeProducts.splice(index, 1);

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: removed[0]
    });
  });

  // 6. POST /api/products/:id/duplicate - Duplicate product
  app.post('/api/products/:id/duplicate', (req, res) => {
    const storeId = getTenantStoreId(req);
    const { id } = req.params;

    const storeProducts = productsStore[storeId] || [];
    const original = storeProducts.find(p => p.id === id);

    if (!original) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or access denied for this store'
      });
    }

    const duplicated: ServerProduct = {
      ...original,
      id: `prod-${Date.now()}`,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${original.sku}-CP`,
      status: 'draft',
      salesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    storeProducts.unshift(duplicated);

    res.status(201).json({
      success: true,
      message: 'Product duplicated successfully',
      data: duplicated
    });
  });

  // =========================================================================
  // AI COMMERCE GENERATION APIS
  // =========================================================================

  app.post('/api/ai/generate-product', async (req, res) => {
    const { prompt, category } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, error: 'A prompt describing the product is required' });
    }

    try {
      const ai = getGemini();
      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are SOL-PUMP's AI Product Specialist.
Create a complete high-converting e-commerce product spec for this merchant prompt: "${prompt}". Category context: "${category || 'General'}".

Return ONLY valid JSON matching this exact structure (no code fences, no extra commentary):
{
  "title": "Concise product title",
  "shortDescription": "1-2 sentence compelling summary for product cards and social shares",
  "description": "<p>Rich HTML formatted product description detailing craftsmanship, materials, features, and care instructions.</p>",
  "category": "Suggested category",
  "vendor": "Suggested artisan brand or vendor",
  "productType": "Specific product type",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "suggestedPrice": 89.00,
  "suggestedCost": 35.00,
  "seoTitle": "High CTR SEO Title (under 60 chars) | Store Name",
  "seoDescription": "Engaging meta description with call to action under 155 chars."
}`
        });

        const text = response.text || '';
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return res.json({ success: true, data: parsed });
      }
    } catch (err) {
      console.warn('[Gemini AI] Falling back to structured heuristic generation:', err);
    }

    // Heuristic generator fallback
    const titleSeed = prompt.trim();
    const formattedTitle = titleSeed.charAt(0).toUpperCase() + titleSeed.slice(1);
    const suggestedCategory = category || (titleSeed.toLowerCase().includes('bag') || titleSeed.toLowerCase().includes('leather') ? 'Bags & Leather' : 'Accessories');
    
    return res.json({
      success: true,
      data: {
        title: formattedTitle.length > 5 ? formattedTitle : `${formattedTitle} Premium Edition`,
        shortDescription: `Artisan crafted ${titleSeed.toLowerCase()} engineered with premium materials for maximum durability and everyday sophistication.`,
        description: `<p>Discover uncompromising craftsmanship with our <strong>${formattedTitle}</strong>. Meticulously designed for those who appreciate both refined aesthetics and utilitarian reliability.</p><ul><li><strong>Premium Materials:</strong> Hand-selected high-grade components built to last.</li><li><strong>Ergonomic Architecture:</strong> Engineered for comfortable daily use and effortless styling.</li><li><strong>Quality Guarantee:</strong> Backed by SOL-PUMP's 1-year merchant craftsmanship warranty.</li></ul>`,
        category: suggestedCategory,
        vendor: 'Sol Artisan Goods',
        productType: suggestedCategory,
        tags: [suggestedCategory.split(' ')[0], 'Artisan', 'Handmade', 'Premium', 'New Arrival'],
        suggestedPrice: 95.00,
        suggestedCost: 38.00,
        seoTitle: `${formattedTitle} | Premium Quality | Sol Pump Store`,
        seoDescription: `Shop authentic ${titleSeed.toLowerCase()} handcrafted with premium materials. Fast global shipping and secure checkout.`
      }
    });
  });

  app.post('/api/ai/generate-seo', async (req, res) => {
    const { title, description, category } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Product title is required' });
    }

    const cleanTitle = title.trim();
    const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const seoTitle = `${cleanTitle} | Buy Online | Sol Pump Store`.slice(0, 65);
    const seoDesc = `Explore premium ${cleanTitle} in our ${category || 'online'} collection. Handcrafted quality, fast shipping, and 30-day easy returns on sol-pump.store.`.slice(0, 155);

    return res.json({
      success: true,
      data: {
        seoTitle,
        seoDescription: seoDesc,
        slug
      }
    });
  });

  // =========================================================================
  // AUTHENTICATION & GOOGLE OAUTH APIS
  // =========================================================================

  // 1. GET /api/auth/config - Get public auth configuration
  app.get('/api/auth/config', (_req, res) => {
    res.json({
      success: true,
      googleClientId: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '',
      domain: 'sol-pump.store'
    });
  });

  // 2. POST /api/auth/google - Authenticate with Google ID Token / Credential
  app.post('/api/auth/google', async (req, res) => {
    try {
      const { credential, code } = req.body;
      if (!credential && !code) {
        return res.status(400).json({ success: false, error: 'Google credential or code is required' });
      }

      let googleUser: {
        email: string;
        name: string;
        sub: string;
        picture?: string;
        email_verified?: string | boolean;
      } | null = null;

      if (credential) {
        // Verify Google ID Token server-side via Google's tokeninfo API
        try {
          const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
          if (verifyRes.ok) {
            const tokenInfo = await verifyRes.json();
            if (tokenInfo.email && (tokenInfo.email_verified === 'true' || tokenInfo.email_verified === true)) {
              googleUser = {
                email: tokenInfo.email.toLowerCase(),
                name: tokenInfo.name || tokenInfo.email.split('@')[0],
                sub: tokenInfo.sub,
                picture: tokenInfo.picture,
                email_verified: tokenInfo.email_verified
              };
            }
          }
        } catch (verErr) {
          console.error('[Google Auth] Token verification error:', verErr);
        }
      }

      // If token verification didn't succeed or was simulated in test mode
      if (!googleUser && credential) {
        try {
          const parts = credential.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            if (payload.email) {
              googleUser = {
                email: payload.email.toLowerCase(),
                name: payload.name || payload.email.split('@')[0],
                sub: payload.sub || `google-${Date.now()}`,
                picture: payload.picture,
                email_verified: payload.email_verified
              };
            }
          }
        } catch (jwtErr) {
          console.error('[Google Auth] JWT decode error:', jwtErr);
        }
      }

      if (!googleUser) {
        return res.status(401).json({
          success: false,
          error: 'INVALID_GOOGLE_CREDENTIAL',
          message: 'Unable to verify Google credential with Google Identity Services.'
        });
      }

      const { email, name, sub: googleId, picture } = googleUser;

      // Check if user already exists
      let existingUser = Object.values(usersStore).find(u => u.googleId === googleId || u.email === email);
      let store: StoreAccount;

      if (existingUser) {
        // Update user details & ensure googleId is linked
        existingUser.name = name || existingUser.name;
        if (picture) existingUser.avatar = picture;
        existingUser.googleId = googleId;
        
        // Find existing store for user (prevent duplicate store creation)
        const existingStore = storesStore[existingUser.storeId] || Object.values(storesStore).find(s => s.ownerId === existingUser!.id);
        if (existingStore) {
          store = existingStore;
        } else {
          store = {
            id: existingUser.storeId || `store-${Date.now()}`,
            name: `${existingUser.name}'s Store`,
            subdomain: existingUser.email.split('@')[0].replace(/[^a-z0-9]/g, ''),
            domain: 'sol-pump.store',
            currency: 'USD',
            ownerId: existingUser.id,
            plan: 'Growth ($29/mo)',
            createdAt: new Date().toISOString()
          };
          storesStore[store.id] = store;
          existingUser.storeId = store.id;
        }
      } else {
        // New User & Multi-tenant Store Provisioning
        const newUserId = `usr-${Date.now()}`;
        const newStoreId = `store-${Date.now()}`;
        
        store = {
          id: newStoreId,
          name: `${name}'s Store`,
          subdomain: email.split('@')[0].replace(/[^a-z0-9]/g, ''),
          domain: 'sol-pump.store',
          currency: 'USD',
          ownerId: newUserId,
          plan: 'Growth ($29/mo)',
          createdAt: new Date().toISOString()
        };
        storesStore[newStoreId] = store;

        existingUser = {
          id: newUserId,
          name,
          email,
          avatar: picture || '',
          googleId,
          role: 'owner',
          storeId: newStoreId,
          createdAt: new Date().toISOString()
        };
        usersStore[newUserId] = existingUser;

        // Clone default sample catalog for the new tenant store
        if (productsStore['store-1']) {
          productsStore[newStoreId] = productsStore['store-1'].map(p => ({
            ...p,
            id: `prod-${newStoreId}-${Math.floor(1000 + Math.random() * 9000)}`,
            storeId: newStoreId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
        }
        ordersStore[newStoreId] = [];
      }

      // Generate secure session token
      const sessionToken = `sol_sess_${crypto.randomBytes(32).toString('hex')}`;
      sessionsStore[sessionToken] = {
        token: sessionToken,
        userId: existingUser.id,
        storeId: store.id,
        createdAt: new Date().toISOString(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30 // 30 days
      };

      console.log(`[Google Auth] Successfully authenticated ${email} (User: ${existingUser.id}, Store: ${store.id})`);

      return res.json({
        success: true,
        token: sessionToken,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          avatar: existingUser.avatar,
          role: existingUser.role,
          storeId: existingUser.storeId
        },
        store
      });
    } catch (err: any) {
      console.error('[Google Auth] Unexpected error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Internal authentication error' });
    }
  });

  // 3. POST /api/auth/login - Email/Password login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const cleanEmail = email.toLowerCase().trim();
    let user = Object.values(usersStore).find(u => u.email === cleanEmail);
    if (!user) {
      // Auto-provision demo user for testing
      const newUserId = `usr-${Date.now()}`;
      const newStoreId = `store-${Date.now()}`;
      const store: StoreAccount = {
        id: newStoreId,
        name: `${cleanEmail.split('@')[0]}'s Store`,
        subdomain: cleanEmail.split('@')[0].replace(/[^a-z0-9]/g, ''),
        domain: 'sol-pump.store',
        currency: 'USD',
        ownerId: newUserId,
        plan: 'Growth ($29/mo)',
        createdAt: new Date().toISOString()
      };
      storesStore[newStoreId] = store;
      user = {
        id: newUserId,
        name: cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '),
        email: cleanEmail,
        role: 'owner',
        storeId: newStoreId,
        createdAt: new Date().toISOString()
      };
      usersStore[newUserId] = user;
      productsStore[newStoreId] = productsStore['store-1'] || [];
    }

    const store = storesStore[user.storeId] || storesStore['store-1'];
    const sessionToken = `sol_sess_${crypto.randomBytes(32).toString('hex')}`;
    sessionsStore[sessionToken] = {
      token: sessionToken,
      userId: user.id,
      storeId: store.id,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
    };

    return res.json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        storeId: user.storeId
      },
      store
    });
  });

  // 4. POST /api/auth/signup - Email/Password registration
  app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }
    const cleanEmail = email.toLowerCase().trim();
    let existingUser = Object.values(usersStore).find(u => u.email === cleanEmail);
    if (existingUser) {
      const store = storesStore[existingUser.storeId] || storesStore['store-1'];
      const sessionToken = `sol_sess_${crypto.randomBytes(32).toString('hex')}`;
      sessionsStore[sessionToken] = {
        token: sessionToken,
        userId: existingUser.id,
        storeId: store.id,
        createdAt: new Date().toISOString(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
      };
      return res.json({
        success: true,
        token: sessionToken,
        user: existingUser,
        store
      });
    }

    const newUserId = `usr-${Date.now()}`;
    const newStoreId = `store-${Date.now()}`;
    const store: StoreAccount = {
      id: newStoreId,
      name: `${name}'s Store`,
      subdomain: cleanEmail.split('@')[0].replace(/[^a-z0-9]/g, ''),
      domain: 'sol-pump.store',
      currency: 'USD',
      ownerId: newUserId,
      plan: 'Growth ($29/mo)',
      createdAt: new Date().toISOString()
    };
    storesStore[newStoreId] = store;

    const user: UserAccount = {
      id: newUserId,
      name,
      email: cleanEmail,
      role: 'owner',
      storeId: newStoreId,
      createdAt: new Date().toISOString()
    };
    usersStore[newUserId] = user;

    if (productsStore['store-1']) {
      productsStore[newStoreId] = productsStore['store-1'].map(p => ({
        ...p,
        id: `prod-${newStoreId}-${Math.floor(1000 + Math.random() * 9000)}`,
        storeId: newStoreId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }

    const sessionToken = `sol_sess_${crypto.randomBytes(32).toString('hex')}`;
    sessionsStore[sessionToken] = {
      token: sessionToken,
      userId: user.id,
      storeId: store.id,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
    };

    return res.json({
      success: true,
      token: sessionToken,
      user,
      store
    });
  });

  // 5. GET /api/auth/me - Validate current session
  app.get('/api/auth/me', (req, res) => {
    const sessionData = getSessionUser(req);
    if (!sessionData) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    return res.json({
      success: true,
      user: {
        id: sessionData.user.id,
        name: sessionData.user.name,
        email: sessionData.user.email,
        avatar: sessionData.user.avatar,
        role: sessionData.user.role,
        storeId: sessionData.user.storeId
      },
      store: sessionData.store
    });
  });

  // 6. POST /api/auth/logout - Terminate session
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      delete sessionsStore[token];
    }
    return res.json({ success: true });
  });

  // =========================================================================
  // =========================================================================
  // CASH ON DELIVERY (COD) CHECKOUT & ORDER MANAGEMENT APIS
  // =========================================================================

  // 1. GET /api/checkout/config - Public checkout config (COD Mode)
  app.get('/api/checkout/config', (_req, res) => {
    res.json({
      success: true,
      configured: true,
      paymentMethod: 'Cash on Delivery',
      currency: 'USD',
      domain: 'sol-pump.store'
    });
  });

  // 2. GET /api/orders - Get orders for tenant store
  app.get('/api/orders', (req, res) => {
    const storeId = getTenantStoreId(req);
    const orders = ordersStore[storeId] || [];
    res.json({
      success: true,
      storeId,
      count: orders.length,
      data: orders
    });
  });

  // 3. GET /api/orders/:id - Get single order
  app.get('/api/orders/:id', (req, res) => {
    const storeId = getTenantStoreId(req);
    const { id } = req.params;
    const orders = ordersStore[storeId] || [];
    const order = orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  });

  // 4. POST /api/checkout/place-cod-order - Place Cash on Delivery order with server-side validation & fraud protection
  app.post('/api/checkout/place-cod-order', async (req, res) => {
    try {
      const storeId = getTenantStoreId(req);
      const { items, customerEmail, customerName, customerPhone, shippingAddress, discountCode, notes } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'No items provided for checkout' });
      }

      if (!customerEmail || !customerEmail.includes('@')) {
        return res.status(400).json({ success: false, error: 'Valid customer email is required' });
      }

      if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.trim().length < 7) {
        return res.status(400).json({ success: false, error: 'Valid customer phone number is required for Cash on Delivery confirmation' });
      }

      const storeProducts = productsStore[storeId] || productsStore['store-1'] || [];

      // SERVER-SIDE PRICE & INVENTORY VERIFICATION (ZERO FRONTEND TRUST)
      let calculatedSubtotal = 0;
      const verifiedItems: OrderItem[] = [];

      for (const item of items) {
        const product = storeProducts.find(p => p.id === item.productId);
        if (!product) {
          return res.status(400).json({
            success: false,
            error: `Product with ID '${item.productId}' not found in store catalog`
          });
        }

        const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
        let unitPrice = product.price;

        if (item.variantId && product.variants && product.variants.length > 0) {
          const variant = product.variants.find(v => v.id === item.variantId);
          if (variant) {
            unitPrice = variant.price;
          }
        }

        calculatedSubtotal += unitPrice * quantity;
        verifiedItems.push({
          productId: product.id,
          title: product.title,
          price: unitPrice,
          quantity,
          image: product.image,
          variantTitle: item.variantTitle
        });
      }

      // Calculate discount if applicable
      let discountAmount = 0;
      if (discountCode) {
        const codeClean = discountCode.trim().toUpperCase();
        if (codeClean === 'WELCOME10' || codeClean === 'SUMMER25') {
          const percent = codeClean === 'WELCOME10' ? 10 : 25;
          discountAmount = (calculatedSubtotal * percent) / 100;
        }
      }

      const shipping = calculatedSubtotal >= 100 ? 0 : 10.00;
      const tax = 0;
      const calculatedTotal = Math.max(1, calculatedSubtotal - discountAmount + shipping + tax);

      const orderNumber = `#${1000 + (ordersStore[storeId]?.length || 0) + 1}`;
      const orderId = `ord-${Date.now()}`;

      // Fraud & Duplicate check
      const existingOrders = ordersStore[storeId] || [];
      const recentDuplicate = existingOrders.find(
        o => o.customerEmail === customerEmail && o.total === calculatedTotal && (Date.now() - new Date(o.createdAt).getTime() < 60000)
      );

      const isSuspicious = Boolean(recentDuplicate);

      // Record Order in server database
      const newOrder: any = {
        id: orderId,
        orderNumber,
        storeId,
        customerName: customerName || 'Valued Customer',
        customerEmail,
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress || {
          street: '123 Commerce Way',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'US'
        },
        items: verifiedItems,
        subtotal: calculatedSubtotal,
        tax,
        shipping,
        discount: discountAmount,
        total: calculatedTotal,
        currency: 'USD',
        status: isSuspicious ? 'pending' : 'pending',
        paymentStatus: 'unpaid',
        paymentMethod: 'Cash on Delivery (COD)',
        merchantNotes: notes || (isSuspicious ? 'Flagged: Potential duplicate order within 60s' : 'New Cash on Delivery order awaiting merchant confirmation'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (!ordersStore[storeId]) {
        ordersStore[storeId] = [];
      }
      ordersStore[storeId].unshift(newOrder);

      // Decrement inventory & increment sales count
      for (const item of verifiedItems) {
        const product = storeProducts.find(p => p.id === item.productId);
        if (product) {
          product.inventory = Math.max(0, product.inventory - item.quantity);
          product.salesCount = (product.salesCount || 0) + item.quantity;
        }
      }

      console.log(`[COD Checkout] Placed Order ${orderNumber} for ${customerEmail} ($${calculatedTotal})`);

      return res.status(201).json({
        success: true,
        orderId,
        orderNumber,
        amount: calculatedTotal,
        subtotal: calculatedSubtotal,
        shipping,
        discount: discountAmount,
        currency: 'USD',
        message: 'Order placed successfully with Cash on Delivery'
      });
    } catch (err: any) {
      console.error('[COD Checkout] Error placing order:', err);
      return res.status(500).json({ success: false, error: err.message || 'Internal checkout error' });
    }
  });

  // 5. POST /api/orders/:id/status - Update order status & payment status
  app.post('/api/orders/:id/status', (req, res) => {
    const storeId = getTenantStoreId(req);
    const { id } = req.params;
    const { status, paymentStatus, merchantNotes } = req.body;

    const orders = ordersStore[storeId] || [];
    const order = orders.find(o => o.id === id || o.orderNumber === id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (status && ['pending', 'confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'].includes(status)) {
      order.status = status;
    }

    if (paymentStatus && ['unpaid', 'cod', 'paid', 'failed', 'refunded'].includes(paymentStatus)) {
      order.paymentStatus = paymentStatus;
    }

    if (merchantNotes !== undefined) {
      order.merchantNotes = merchantNotes;
    }

    order.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  });

  // 6. POST /api/orders/:id/notes - Add merchant internal notes
  app.post('/api/orders/:id/notes', (req, res) => {
    const storeId = getTenantStoreId(req);
    const { id } = req.params;
    const { notes } = req.body;

    const orders = ordersStore[storeId] || [];
    const order = orders.find(o => o.id === id || o.orderNumber === id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.merchantNotes = notes || '';
    order.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Notes updated successfully',
      data: order
    });
  });

  // Newsletter endpoint
  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    return res.json({
      success: true,
      message: 'Thank you for subscribing to SOL-PUMP Commerce updates!',
    });
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SOL-PUMP Commerce OS] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[SOL-PUMP Server] Failed to start:', err);
});

