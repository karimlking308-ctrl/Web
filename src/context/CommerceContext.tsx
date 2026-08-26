import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Store, Product, Order, Customer, DiscountCode, AnalyticsSummary, ProductMedia, ProductVariant, ProductOption, PaymentConfig, GoogleAuthConfig, CreatePaymentIntentResponse } from '../types/commerce';

export interface CommerceContextType {
  user: User | null;
  store: Store | null;
  isAuthenticated: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onboardingStep: number | null;
  setOnboardingStep: (step: number | null) => void;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  discounts: DiscountCode[];
  analytics: AnalyticsSummary;
  aiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;

  // Google & Payment Configurations
  googleAuthConfig: GoogleAuthConfig | null;
  paymentConfig: PaymentConfig | null;

  // Full-page Product Management navigation & state
  isCreatingProduct: boolean;
  editingProduct: Product | null;
  previewProduct: Product | null;
  startCreatingProduct: () => void;
  startEditingProduct: (product: Product) => void;
  closeProductEditor: () => void;
  startPreviewingProduct: (product: Product) => void;
  closeProductPreview: () => void;

  // Authentication & Sessions
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;

  // Real CRUD & Operations
  addProduct: (product: Omit<Product, 'id' | 'salesCount' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  duplicateProduct: (id: string) => Promise<Product | null>;
  archiveProduct: (id: string) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: 'active' | 'draft' | 'archived') => void;
  bulkDeleteProducts: (ids: string[]) => void;
  importProductsFromCsv: (csvContent: string) => void;
  exportProductsToCsv: () => string;

  // Checkout & Card Payment
  createCheckoutPaymentIntent: (data: {
    items: Array<{ productId: string; variantId?: string; quantity: number }>;
    customerEmail: string;
    customerName: string;
    shippingAddress?: any;
    discountCode?: string;
  }) => Promise<CreatePaymentIntentResponse>;
  verifyCheckoutPayment: (paymentIntentId: string, orderId: string) => Promise<{ success: boolean; paid: boolean; order?: any }>;

  // AI Assistant and Generators
  generateAiProductData: (prompt: string, category?: string) => Promise<any>;
  generateAiSeoData: (title: string, description?: string, category?: string) => Promise<any>;

  updateOrderStatus: (id: string, status: Order['status']) => void;
  addDiscount: (discount: Omit<DiscountCode, 'id' | 'usageCount'>) => void;
  runAiPrompt: (prompt: string) => Promise<string>;
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

const initialProducts: Product[] = [
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
];

const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: '#1001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    items: [
      { productId: 'prod-1', title: 'Leather Travel Backpack', quantity: 1, price: 129.00 }
    ],
    total: 129.00,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2026-08-24T06:14:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: '#1002',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@company.co',
    items: [
      { productId: 'prod-2', title: 'Minimalist Chronograph Watch', quantity: 1, price: 189.00 },
      { productId: 'prod-5', title: 'Slim RFID Minimalist Wallet', quantity: 1, price: 49.00 }
    ],
    total: 238.00,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: '2026-08-24T05:30:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: '#1003',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@design.io',
    items: [
      { productId: 'prod-3', title: 'Classic Aviator Sunglasses', quantity: 2, price: 89.00 }
    ],
    total: 178.00,
    status: 'processing',
    paymentStatus: 'paid',
    createdAt: '2026-08-24T04:15:00Z'
  },
  {
    id: 'ord-1004',
    orderNumber: '#1004',
    customerName: 'David Kim',
    customerEmail: 'david.kim@tech.net',
    items: [
      { productId: 'prod-1', title: 'Leather Travel Backpack', quantity: 1, price: 129.00 }
    ],
    total: 129.00,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2026-08-24T02:40:00Z'
  },
  {
    id: 'ord-1005',
    orderNumber: '#1005',
    customerName: 'Amara Okafor',
    customerEmail: 'amara.o@global.org',
    items: [
      { productId: 'prod-5', title: 'Slim RFID Minimalist Wallet', quantity: 3, price: 49.00 }
    ],
    total: 147.00,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2026-08-23T22:10:00Z'
  }
];

const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    ordersCount: 4,
    totalSpent: 512.00,
    tags: ['VIP', 'Repeat Buyer'],
    createdAt: '2026-07-10T10:00:00Z'
  },
  {
    id: 'cust-2',
    name: 'Marcus Vance',
    email: 'm.vance@company.co',
    ordersCount: 2,
    totalSpent: 427.00,
    tags: ['High Value'],
    createdAt: '2026-07-15T14:30:00Z'
  },
  {
    id: 'cust-3',
    name: 'Elena Rostova',
    email: 'elena.r@design.io',
    ordersCount: 3,
    totalSpent: 356.00,
    tags: ['VIP'],
    createdAt: '2026-07-22T09:15:00Z'
  },
  {
    id: 'cust-4',
    name: 'David Kim',
    email: 'david.kim@tech.net',
    ordersCount: 1,
    totalSpent: 129.00,
    tags: ['New Customer'],
    createdAt: '2026-08-01T11:00:00Z'
  },
  {
    id: 'cust-5',
    name: 'Amara Okafor',
    email: 'amara.o@global.org',
    ordersCount: 5,
    totalSpent: 735.00,
    tags: ['VIP', 'Wholesale'],
    createdAt: '2026-06-18T16:45:00Z'
  }
];

const initialDiscounts: DiscountCode[] = [
  {
    id: 'disc-1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minimumPurchase: 30,
    usageCount: 84,
    status: 'active',
    createdAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'disc-2',
    code: 'SUMMER25',
    type: 'percentage',
    value: 25,
    minimumPurchase: 100,
    usageCount: 142,
    status: 'active',
    createdAt: '2026-08-10T00:00:00Z'
  },
  {
    id: 'disc-3',
    code: 'FREESHIP',
    type: 'shipping',
    value: 0,
    minimumPurchase: 75,
    usageCount: 61,
    status: 'active',
    createdAt: '2026-08-15T00:00:00Z'
  }
];

const initialAnalytics: AnalyticsSummary = {
  totalSales: 128645.60,
  salesChange: 12.5,
  ordersCount: 1248,
  ordersChange: -0.3,
  conversionRate: 3.68,
  conversionChange: 1.2,
  avgOrderValue: 103.55,
  aovChange: -1.4,
  visitorsCount: 25456
};

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return localStorage.getItem('solpump_session_token');
  });

  const [googleAuthConfig, setGoogleAuthConfig] = useState<GoogleAuthConfig | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);

  const [activeTab, setActiveTab] = useState('products');
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('solpump_products_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return initialProducts;
  });

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [discounts, setDiscounts] = useState<DiscountCode[]>(initialDiscounts);
  const [analytics] = useState<AnalyticsSummary>(initialAnalytics);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Full-screen Product Editor & Preview State
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // Fetch Public Auth & Payment Configs on load
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const [authRes, payRes] = await Promise.all([
          fetch('/api/auth/config'),
          fetch('/api/checkout/config')
        ]);
        if (authRes.ok) {
          const authJson = await authRes.json();
          setGoogleAuthConfig(authJson);
        }
        if (payRes.ok) {
          const payJson = await payRes.json();
          setPaymentConfig(payJson);
        }
      } catch (err) {
        console.warn('[Config] Failed to load auth/payment configs:', err);
      }
    };
    loadConfigs();
  }, []);

  // Validate & Restore Session on Mount
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('solpump_session_token');
      if (savedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${savedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              setUser(data.user);
              setStore(data.store || {
                id: data.user.storeId || 'store-1',
                name: `${data.user.name}'s Store`,
                domain: 'sol-pump.store',
                currency: 'USD',
                plan: 'growth',
                country: 'US',
                setupProgress: 100
              });
              setIsAuthenticated(true);
              setSessionToken(savedToken);
              return;
            }
          }
        } catch (e) {
          console.warn('[Auth] Session validation failed, initializing guest state:', e);
        }
      }

      // Default demo initial user if no session
      setUser({
        id: 'usr-1',
        name: 'Alexander Sterling',
        email: 'alexander@sol-pump.store',
        role: 'owner',
        storeId: 'store-1',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'
      });
      setStore({
        id: 'store-1',
        name: 'SOL-PUMP Flagship Store',
        domain: 'sol-pump.store',
        currency: 'USD',
        plan: 'growth',
        country: 'US',
        setupProgress: 100
      });
      setIsAuthenticated(true);
    };

    restoreSession();
  }, []);

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('solpump_products_v2', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Sync products and orders with backend on mount & store change
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const storeId = store?.id || 'store-1';
        const headers: Record<string, string> = { 'X-Store-Id': storeId };
        if (sessionToken) {
          headers['Authorization'] = `Bearer ${sessionToken}`;
        }

        const [prodRes, orderRes] = await Promise.all([
          fetch('/api/products', { headers }),
          fetch('/api/orders', { headers })
        ]);

        if (prodRes.ok) {
          const json = await prodRes.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setProducts(json.data);
          }
        }

        if (orderRes.ok) {
          const ordJson = await orderRes.json();
          if (ordJson.success && Array.isArray(ordJson.data) && ordJson.data.length > 0) {
            setOrders(ordJson.data);
          }
        }
      } catch (e) {
        // Dev fallback
      }
    };
    fetchBackendData();
  }, [store?.id, sessionToken]);

  // 1. Google Authentication
  const loginWithGoogle = async (credential: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.message || data.error || 'Google authentication failed' };
      }

      // Save token and state
      if (data.token) {
        localStorage.setItem('solpump_session_token', data.token);
        setSessionToken(data.token);
      }
      setUser(data.user);
      setStore(data.store);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err: any) {
      console.error('[Google Auth] Request failed:', err);
      return { success: false, error: err.message || 'Network error during Google Sign-In' };
    }
  };

  // 2. Standard Login
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'password123' })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }

      if (data.token) {
        localStorage.setItem('solpump_session_token', data.token);
        setSessionToken(data.token);
      }
      setUser(data.user);
      if (data.store) setStore(data.store);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  // 3. Standard Signup
  const signup = async (name: string, email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: password || 'password123' })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Sign-up failed' };
      }

      if (data.token) {
        localStorage.setItem('solpump_session_token', data.token);
        setSessionToken(data.token);
      }
      setUser(data.user);
      if (data.store) setStore(data.store);
      setIsAuthenticated(true);
      setOnboardingStep(1);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Sign-up failed' };
    }
  };

  // 4. Logout
  const logout = async () => {
    try {
      if (sessionToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${sessionToken}` }
        });
      }
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('solpump_session_token');
    setSessionToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const completeOnboarding = () => {
    setOnboardingStep(null);
    if (store) {
      setStore({ ...store, setupProgress: 100 });
    }
  };

  // 5. Card Checkout & Stripe Payment Functions
  const createCheckoutPaymentIntent = async (data: {
    items: Array<{ productId: string; variantId?: string; quantity: number }>;
    customerEmail: string;
    customerName: string;
    shippingAddress?: any;
    discountCode?: string;
  }): Promise<CreatePaymentIntentResponse> => {
    const storeId = store?.id || 'store-1';
    const res = await fetch('/api/checkout/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Store-Id': storeId
      },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    return json;
  };

  const verifyCheckoutPayment = async (paymentIntentId: string, orderId: string): Promise<{ success: boolean; paid: boolean; order?: any }> => {
    const storeId = store?.id || 'store-1';
    const res = await fetch('/api/checkout/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Store-Id': storeId
      },
      body: JSON.stringify({ paymentIntentId, orderId })
    });

    const json = await res.json();
    if (json.success && json.order) {
      // Sync local orders list
      setOrders(prev => [json.order, ...prev.filter(o => o.id !== orderId)]);
    }
    return json;
  };

  // Product Editor Navigation handlers
  const startCreatingProduct = () => {
    setEditingProduct(null);
    setIsCreatingProduct(true);
  };

  const startEditingProduct = (product: Product) => {
    setEditingProduct(product);
    setIsCreatingProduct(true);
  };

  const closeProductEditor = () => {
    setIsCreatingProduct(false);
    setEditingProduct(null);
  };

  const startPreviewingProduct = (product: Product) => {
    setPreviewProduct(product);
  };

  const closeProductPreview = () => {
    setPreviewProduct(null);
  };

  // CRUD Implementations
  const addProduct = async (newProd: Omit<Product, 'id' | 'salesCount' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const fallbackId = `prod-${Date.now()}`;
    const slug = newProd.slug || newProd.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const productPayload: Product = {
      ...newProd,
      id: fallbackId,
      storeId: store?.id || 'store-1',
      slug,
      salesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Store-Id': store?.id || 'store-1'
        },
        body: JSON.stringify(productPayload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProducts(prev => [json.data, ...prev.filter(p => p.id !== json.data.id)]);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API save product failed, using local store', e);
    }

    setProducts(prev => [productPayload, ...prev]);
    return productPayload;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    const updatedProduct = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updatedProduct } : p)));

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Store-Id': store?.id || 'store-1'
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProducts(prev => prev.map(p => (p.id === id ? json.data : p)));
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API update product failed, local updated', e);
    }

    const current = products.find(p => p.id === id);
    return current ? { ...current, ...updatedProduct } : null;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'X-Store-Id': store?.id || 'store-1' }
      });
    } catch (e) {
      console.warn('API delete product failed', e);
    }
    return true;
  };

  const duplicateProduct = async (id: string): Promise<Product | null> => {
    const original = products.find(p => p.id === id);
    if (!original) return null;

    try {
      const res = await fetch(`/api/products/${id}/duplicate`, {
        method: 'POST',
        headers: { 'X-Store-Id': store?.id || 'store-1' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProducts(prev => [json.data, ...prev]);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API duplicate failed, using local clone', e);
    }

    const duplicated: Product = {
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

    setProducts(prev => [duplicated, ...prev]);
    return duplicated;
  };

  const archiveProduct = async (id: string) => {
    await updateProduct(id, { status: 'archived' });
  };

  const bulkUpdateStatus = (ids: string[], status: 'active' | 'draft' | 'archived') => {
    setProducts(prev =>
      prev.map(p => (ids.includes(p.id) ? { ...p, status, updatedAt: new Date().toISOString() } : p))
    );
  };

  const bulkDeleteProducts = (ids: string[]) => {
    setProducts(prev => prev.filter(p => !ids.includes(p.id)));
  };

  const exportProductsToCsv = (): string => {
    const headers = ['ID', 'Title', 'SKU', 'Category', 'Price', 'CompareAtPrice', 'Cost', 'Inventory', 'Status', 'Vendor', 'Tags', 'Image'];
    const rows = products.map(p => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.sku || ''}"`,
      `"${p.category}"`,
      p.price,
      p.compareAtPrice || '',
      p.cost || '',
      p.inventory,
      `"${p.status}"`,
      `"${(p.vendor || '').replace(/"/g, '""')}"`,
      `"${(p.tags || []).join(';')}"`,
      `"${p.image || ''}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  const importProductsFromCsv = (csvContent: string) => {
    const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return;
    
    const newItems: Product[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
      if (cols.length >= 5) {
        const title = cols[1] || 'Imported Product';
        const price = parseFloat(cols[4]) || 49.00;
        newItems.push({
          id: `prod-imp-${Date.now()}-${i}`,
          storeId: store?.id || 'store-1',
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: `Imported catalog product ${title}`,
          price,
          cost: parseFloat(cols[6]) || 20.00,
          currency: 'USD',
          sku: cols[2] || `IMP-${Math.floor(1000 + Math.random() * 9000)}`,
          inventory: parseInt(cols[7]) || 25,
          status: 'active',
          category: cols[3] || 'General',
          image: cols[11] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
          trackInventory: true,
          salesChannels: ['Online Store'],
          collections: [],
          tags: cols[10] ? cols[10].split(';') : [],
          media: [],
          options: [],
          variants: [],
          requiresShipping: true,
          isDigital: false,
          salesCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    if (newItems.length > 0) {
      setProducts(prev => [...newItems, ...prev]);
    }
  };

  // AI helper hooks
  const generateAiProductData = async (prompt: string, category?: string) => {
    try {
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('AI generate failed, using heuristic fallback', e);
    }
    const clean = prompt.trim();
    return {
      title: clean.length > 3 ? clean : 'Artisan Handcrafted Travel Essential',
      shortDescription: `Artisan designed ${clean} crafted from durable full-grain materials for daily refinement.`,
      description: `<p>Discover the perfect blend of modern utility and timeless craftsmanship with our <strong>${clean}</strong>.</p><ul><li><strong>Materials:</strong> Handpicked premium components.</li><li><strong>Durability:</strong> Reinforced stress-point stitching.</li><li><strong>Warranty:</strong> 1-year SOL-PUMP merchant guarantee.</li></ul>`,
      category: category || 'Accessories',
      vendor: 'Sol Artisan Goods',
      productType: category || 'Accessories',
      tags: ['Artisan', 'Handmade', 'Premium', 'New Arrival'],
      suggestedPrice: 95.00,
      suggestedCost: 38.00,
      seoTitle: `${clean} | Premium Quality | Sol Pump Store`,
      seoDescription: `Shop our premium ${clean}. Crafted with care and backed by fast global shipping.`
    };
  };

  const generateAiSeoData = async (title: string, description?: string, category?: string) => {
    try {
      const res = await fetch('/api/ai/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      // fallback
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return {
      seoTitle: `${title} | Premium Store | Sol Pump Store`.slice(0, 65),
      seoDescription: `Explore ${title} in our official catalog. Premium materials, quick checkout, and fast shipping on sol-pump.store.`.slice(0, 155),
      slug
    };
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const addDiscount = (newDisc: Omit<DiscountCode, 'id' | 'usageCount'>) => {
    const disc: DiscountCode = {
      ...newDisc,
      id: `disc-${Date.now()}`,
      usageCount: 0
    };
    setDiscounts([disc, ...discounts]);
  };

  const runAiPrompt = async (prompt: string): Promise<string> => {
    await new Promise(r => setTimeout(r, 600));
    const lower = prompt.toLowerCase();
    if (lower.includes('sales') || lower.includes('decrease') || lower.includes('revenue')) {
      return `Based on your recent analytics, sales increased by +12.5% this week, primarily driven by high demand for the 'Leather Travel Backpack' (324 units sold). Traffic conversion peaked on Thursday due to social media referral campaigns.`;
    }
    if (lower.includes('discount') || lower.includes('campaign') || lower.includes('summer')) {
      return `I've created a new summer campaign 'SUMMER25' offering 25% off for all VIP customers. Estimated reach: 1,420 segmented subscribers. Would you like me to schedule this email blast?`;
    }
    if (lower.includes('description') || lower.includes('write')) {
      return `Here is a high-converting product description: "Elevate your daily carry with our artisanal leather backpack. Crafted from premium full-grain leather with dedicated padded storage and ergonomic shoulder support. Built for lifetime durability."`;
    }
    return `I analyzed your store metrics. Your top performing channel is Instagram Social, and inventory levels are healthy across 85% of your active catalog. How else can I optimize your store today?`;
  };

  return (
    <CommerceContext.Provider
      value={{
        user,
        store,
        isAuthenticated,
        activeTab,
        setActiveTab,
        onboardingStep,
        setOnboardingStep,
        products,
        orders,
        customers,
        discounts,
        analytics,
        aiAssistantOpen,
        setAiAssistantOpen,
        googleAuthConfig,
        paymentConfig,
        isCreatingProduct,
        editingProduct,
        previewProduct,
        startCreatingProduct,
        startEditingProduct,
        closeProductEditor,
        startPreviewingProduct,
        closeProductPreview,
        login,
        signup,
        loginWithGoogle,
        logout,
        completeOnboarding,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        archiveProduct,
        bulkUpdateStatus,
        bulkDeleteProducts,
        importProductsFromCsv,
        exportProductsToCsv,
        createCheckoutPaymentIntent,
        verifyCheckoutPayment,
        generateAiProductData,
        generateAiSeoData,
        updateOrderStatus,
        addDiscount,
        runAiPrompt
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }
  return context;
};
