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

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  sku: string;
  barcode?: string;
  inventory: number;
  status: 'active' | 'draft' | 'archived';
  category: string;
  image: string;
  weight?: number;
  salesCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  itemsCount: number;
  paymentMethod: string;
  shippingAddress: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  segment: 'VIP' | 'New' | 'Returning' | 'High Spender' | 'Inactive';
  tags: string[];
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  usageCount: number;
  status: 'active' | 'expired' | 'scheduled';
  minPurchase?: number;
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
