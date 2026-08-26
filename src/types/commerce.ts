export type UserRole = 'owner' | 'admin' | 'manager' | 'staff' | 'support' | 'developer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  storeId: string;
}

export interface Store {
  id: string;
  name: string;
  domain: string;
  currency: string;
  plan: 'free' | 'starter' | 'growth' | 'pro' | 'enterprise';
  logo?: string;
  country: string;
  setupProgress: number; // 0 to 100
}

export interface ProductMedia {
  id: string;
  url: string;
  type: 'image' | 'video' | '3d';
  name?: string;
  size?: number;
  isPrimary?: boolean;
}

export interface ProductOption {
  id: string;
  name: string; // e.g. "Size", "Color"
  values: string[]; // e.g. ["Small", "Medium", "Large"]
}

export interface ProductVariant {
  id: string;
  title: string; // e.g. "Small / Black"
  options: Record<string, string>; // { "Size": "Small", "Color": "Black" }
  sku: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  inventory: number;
  barcode?: string;
  weight?: number;
  image?: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
  address?: string;
  quantity: number;
}

export interface Product {
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
  locations?: InventoryLocation[];
  status: 'active' | 'draft' | 'archived';
  category: string;
  vendor?: string;
  productType?: string;
  collections: string[];
  tags: string[];
  image: string; // primary cover image
  media: ProductMedia[];
  options: ProductOption[];
  variants: ProductVariant[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
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

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  sku?: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date?: string;
  createdAt?: string;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus?: string;
  items?: OrderItem[];
  itemsCount?: number;
  paymentMethod?: string;
  shippingAddress?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  segment?: 'VIP' | 'New' | 'Returning' | 'High Spender' | 'Inactive';
  tags: string[];
  createdAt?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  usageCount: number;
  status: 'active' | 'expired' | 'scheduled';
  minPurchase?: number;
  minimumPurchase?: number;
  createdAt?: string;
}

export interface AnalyticsSummary {
  totalSales: number;
  salesChange: number;
  ordersCount: number;
  ordersChange: number;
  conversionRate: number;
  conversionChange: number;
  avgOrderValue: number;
  aovChange: number;
  visitorsCount: number;
}

export interface PaymentConfig {
  configured: boolean;
  publishableKey: string;
  currency: string;
  domain: string;
}

export interface GoogleAuthConfig {
  googleClientId: string;
  domain: string;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  configured: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  currency: string;
  publishableKey?: string;
  error?: string;
  message?: string;
}

