import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Store, Product, Order, Customer, DiscountCode, AnalyticsSummary } from '../types/commerce';

interface CommerceContextType {
  user: User | null;
  store: Store | null;
  isAuthenticated: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onboardingStep: number | null; // null if onboarding completed
  setOnboardingStep: (step: number | null) => void;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  discounts: DiscountCode[];
  analytics: AnalyticsSummary;
  aiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;
  login: (email: string, pass: string) => void;
  signup: (name: string, email: string, pass: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
  addProduct: (product: Omit<Product, 'id' | 'salesCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addDiscount: (discount: Omit<DiscountCode, 'id' | 'usageCount'>) => void;
  runAiPrompt: (prompt: string) => Promise<string>;
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Leather Travel Backpack',
    description: 'Handcrafted full-grain Moroccan leather backpack with padded laptop compartment.',
    price: 129.00,
    compareAtPrice: 179.00,
    cost: 45.00,
    sku: 'LB-001',
    barcode: '880123456789',
    inventory: 120,
    status: 'active',
    category: 'Bags & Leather',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    weight: 1.2,
    salesCount: 324
  },
  {
    id: 'prod-2',
    title: 'Minimalist Chronograph Watch',
    description: 'Sleek stainless steel case with sapphire crystal glass and genuine leather strap.',
    price: 189.00,
    compareAtPrice: 220.00,
    cost: 60.00,
    sku: 'VW-002',
    barcode: '880123456790',
    inventory: 85,
    status: 'active',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    weight: 0.3,
    salesCount: 256
  },
  {
    id: 'prod-3',
    title: 'Classic Aviator Sunglasses',
    description: 'Polarized UV400 lenses with lightweight titanium alloy frame.',
    price: 89.00,
    compareAtPrice: 110.00,
    cost: 22.00,
    sku: 'CS-003',
    barcode: '880123456791',
    inventory: 210,
    status: 'active',
    category: 'Eyewear',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
    weight: 0.1,
    salesCount: 412
  },
  {
    id: 'prod-4',
    title: 'Ergonomic Running Shoes',
    description: 'Breathable mesh upper with responsive carbon-plate cushioning for peak performance.',
    price: 149.00,
    compareAtPrice: 180.00,
    cost: 55.00,
    sku: 'RS-004',
    barcode: '880123456792',
    inventory: 0,
    status: 'draft',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    weight: 0.8,
    salesCount: 189
  },
  {
    id: 'prod-5',
    title: 'Slim RFID Minimalist Wallet',
    description: 'Blocked card security with aerospace-grade aluminum and cash strap.',
    price: 49.00,
    compareAtPrice: 65.00,
    cost: 12.00,
    sku: 'LW-005',
    barcode: '880123456793',
    inventory: 98,
    status: 'active',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
    weight: 0.15,
    salesCount: 301
  }
];

const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: '#1001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    date: '2026-08-24 14:32',
    total: 129.00,
    status: 'paid',
    itemsCount: 1,
    paymentMethod: 'Stripe (Credit Card)',
    shippingAddress: '742 Evergreen Terrace, Springfield'
  },
  {
    id: 'ord-1002',
    orderNumber: '#1002',
    customerName: 'Michael Chen',
    customerEmail: 'm.chen@example.com',
    date: '2026-08-24 12:15',
    total: 189.00,
    status: 'processing',
    itemsCount: 1,
    paymentMethod: 'Apple Pay',
    shippingAddress: '1288 Mission St, San Francisco, CA'
  },
  {
    id: 'ord-1003',
    orderNumber: '#1003',
    customerName: 'Emma Davis',
    customerEmail: 'emma.d@example.com',
    date: '2026-08-23 18:45',
    total: 338.00,
    status: 'shipped',
    itemsCount: 3,
    paymentMethod: 'Stripe (Credit Card)',
    shippingAddress: '45 Park Avenue, New York, NY'
  },
  {
    id: 'ord-1004',
    orderNumber: '#1004',
    customerName: 'James Wilson',
    customerEmail: 'jwilson@example.com',
    date: '2026-08-23 09:20',
    total: 89.00,
    status: 'delivered',
    itemsCount: 1,
    paymentMethod: 'PayPal',
    shippingAddress: '102 Lakeside Dr, Austin, TX'
  },
  {
    id: 'ord-1005',
    orderNumber: '#1005',
    customerName: 'Olivia Brown',
    customerEmail: 'olivia.b@example.com',
    date: '2026-08-22 21:10',
    total: 149.00,
    status: 'pending',
    itemsCount: 1,
    paymentMethod: 'Stripe (Credit Card)',
    shippingAddress: '88 King St W, Toronto, ON'
  }
];

const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    ordersCount: 5,
    totalSpent: 645.00,
    lastOrderDate: '2026-08-24',
    segment: 'VIP',
    tags: ['Wholesale', 'Repeat Buyer']
  },
  {
    id: 'cust-2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    ordersCount: 2,
    totalSpent: 378.00,
    lastOrderDate: '2026-08-24',
    segment: 'High Spender',
    tags: ['Tech Enthusiast']
  },
  {
    id: 'cust-3',
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    ordersCount: 4,
    totalSpent: 892.00,
    lastOrderDate: '2026-08-23',
    segment: 'VIP',
    tags: ['Loyal Customer', 'US West']
  },
  {
    id: 'cust-4',
    name: 'James Wilson',
    email: 'jwilson@example.com',
    ordersCount: 1,
    totalSpent: 89.00,
    lastOrderDate: '2026-08-23',
    segment: 'New',
    tags: ['First Time']
  },
  {
    id: 'cust-5',
    name: 'Olivia Brown',
    email: 'olivia.b@example.com',
    ordersCount: 1,
    totalSpent: 149.00,
    lastOrderDate: '2026-08-22',
    segment: 'New',
    tags: ['Campaign Organic']
  }
];

const initialDiscounts: DiscountCode[] = [
  { id: 'disc-1', code: 'SUMMER20', type: 'percentage', value: 20, usageCount: 48, status: 'active', minPurchase: 50 },
  { id: 'disc-2', code: 'WELCOME10', type: 'percentage', value: 10, usageCount: 142, status: 'active' },
  { id: 'disc-3', code: 'FREESHIP', type: 'shipping', value: 0, usageCount: 89, status: 'active' }
];

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr-1',
    name: 'John Doe',
    email: 'admin@sol-pump.store',
    role: 'owner',
    storeId: 'store-1'
  });

  const [store, setStore] = useState<Store | null>({
    id: 'store-1',
    name: 'Sol Pump Store',
    domain: 'sol-pump.store',
    currency: 'USD',
    plan: 'growth',
    country: 'United States',
    setupProgress: 85
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null); // null means normal dashboard view

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [discounts, setDiscounts] = useState<DiscountCode[]>(initialDiscounts);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);

  const analytics: AnalyticsSummary = {
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

  const login = (email: string) => {
    setUser({
      id: 'usr-1',
      name: email.split('@')[0] || 'Merchant User',
      email,
      role: 'owner',
      storeId: 'store-1'
    });
    setIsAuthenticated(true);
  };

  const signup = (name: string, email: string) => {
    setUser({
      id: 'usr-new',
      name,
      email,
      role: 'owner',
      storeId: 'store-1'
    });
    setIsAuthenticated(true);
    setOnboardingStep(1); // launch onboarding wizard after signup
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const completeOnboarding = () => {
    setOnboardingStep(null);
    if (store) {
      setStore({ ...store, setupProgress: 100 });
    }
  };

  const addProduct = (newProd: Omit<Product, 'id' | 'salesCount'>) => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      salesCount: 0
    };
    setProducts([product, ...products]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
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
    await new Promise(r => setTimeout(r, 800));
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
        login,
        signup,
        logout,
        completeOnboarding,
        addProduct,
        updateProduct,
        deleteProduct,
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
