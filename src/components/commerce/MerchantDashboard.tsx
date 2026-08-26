import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Percent,
  BarChart3,
  Globe,
  Sparkles,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Plus,
  TrendingUp,
  TrendingDown,
  Sliders,
  ExternalLink,
  Eye,
  Layers,
  ArrowUpRight,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Check,
  AlertCircle,
  Clock,
  CreditCard,
  Truck,
  X,
  ChevronDown,
  Boxes,
  LogOut,
  ChevronRight,
  DollarSign,
  ShieldCheck,
  Zap,
  Tag,
  Store as StoreIcon,
  RefreshCw,
  FileText
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { StoreBuilder } from './StoreBuilder';
import { AiAssistantModal } from './AiAssistantModal';
import { ProductEditor } from './ProductEditor';
import { ProductPreviewModal } from './ProductPreviewModal';
import { ProductsCatalog } from './ProductsCatalog';
import { CommandPalette } from '../ui/CommandPalette';
import { ToastContainer, ToastMessage } from '../ui/Toast';
import { Product, Order, DiscountCode } from '../../types/commerce';

export const MerchantDashboard: React.FC = () => {
  const {
    user,
    store,
    products,
    orders,
    customers,
    discounts,
    analytics,
    activeTab,
    setActiveTab,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    addDiscount,
    aiAssistantOpen,
    setAiAssistantOpen,
    isCreatingProduct,
    startCreatingProduct,
    previewProduct,
    closeProductPreview
  } = useCommerce();

  // Modals & local state
  const [showStoreBuilder, setShowStoreBuilder] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [productFilter, setProductFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'ytd'>('today');

  // New Product Form State
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Bags & Leather');
  const [newProdPrice, setNewProdPrice] = useState('89.00');
  const [newProdCost, setNewProdCost] = useState('25.00');
  const [newProdSku, setNewProdSku] = useState('SP-001');
  const [newProdInventory, setNewProdInventory] = useState('50');
  const [newProdImage, setNewProdImage] = useState(
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80'
  );
  const [newProdDesc, setNewProdDesc] = useState('');

  // New Discount Form State
  const [newDiscCode, setNewDiscCode] = useState('');
  const [newDiscType, setNewDiscType] = useState<'percentage' | 'fixed' | 'shipping'>('percentage');
  const [newDiscValue, setNewDiscValue] = useState('20');
  const [newDiscMin, setNewDiscMin] = useState('50');

  const addNotificationToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now() + Math.random(),
      type,
      title,
      message,
      duration: 4000
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // If user is creating/editing a product, render the full-screen Product Editor
  if (isCreatingProduct) {
    return (
      <>
        <ProductEditor />
        {previewProduct && <ProductPreviewModal product={previewProduct} onClose={closeProductPreview} />}
      </>
    );
  }

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle) return;
    addProduct({
      title: newProdTitle,
      description: newProdDesc || 'Premium artisan crafted goods with high quality material.',
      price: parseFloat(newProdPrice) || 0,
      cost: parseFloat(newProdCost) || 0,
      sku: newProdSku || `SKU-${Math.floor(Math.random() * 9000 + 1000)}`,
      inventory: parseInt(newProdInventory) || 0,
      status: 'active',
      category: newProdCategory,
      image: newProdImage
    });
    setNewProdTitle('');
    setNewProdDesc('');
    setShowAddProductModal(false);
    addNotificationToast('success', 'Product Created', `${newProdTitle} was added to your active catalog.`);
  };

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscCode) return;
    addDiscount({
      code: newDiscCode.toUpperCase(),
      type: newDiscType,
      value: parseFloat(newDiscValue) || 0,
      status: 'active',
      minPurchase: parseFloat(newDiscMin) || 0
    });
    setNewDiscCode('');
    setShowAddDiscountModal(false);
    addNotificationToast('success', 'Discount Activated', `Code ${newDiscCode.toUpperCase()} is now live.`);
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (
      orderSearch &&
      !o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) &&
      !o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* 1. SOPHISTICATED NEUTRAL SIDEBAR */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-30 select-none">
        {/* Sidebar Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <Logo size="md" light={false} showTagline={true} />
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs font-semibold">
          {/* Main Group */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  activeTab === 'orders' ? 'bg-white/25 text-white' : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  activeTab === 'products' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Boxes className="w-4 h-4" />
                <span>Inventory</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('discounts')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'discounts'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Percent className="w-4 h-4" />
                <span>Discounts</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </div>
            </button>
          </div>

          {/* Commerce Intelligence Group */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Intelligence & Channels
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setAiAssistantOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-900 hover:bg-indigo-100 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3 font-bold">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Business Copilot</span>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-indigo-600 text-white font-extrabold">
                  Live
                </span>
              </button>

              <button
                onClick={() => setShowStoreBuilder(true)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
                  <span>Online Storefront</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Settings Group */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Settings</div>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Store Settings</span>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="truncate">
                <div className="font-bold text-xs text-slate-900 truncate">{user?.name || 'Alexander Sterling'}</div>
                <div className="text-[10px] text-slate-500 truncate">{store?.domain || 'sol-pump.store'}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. REFINED MAIN CONTENT WORKSPACE */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
          {/* Global Search Input */}
          <div className="flex items-center gap-2 max-w-md w-full">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between bg-slate-100 hover:bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search products, orders, customers...</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                ⌘K
              </div>
            </button>
          </div>

          {/* Right Action Icons & Quick Tools */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStoreBuilder(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => setAiAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Copilot</span>
            </button>

            <div className="h-5 w-px bg-slate-200" />

            <button
              onClick={() => addNotificationToast('info', 'System Status', 'All edge checkout nodes operational.')}
              title="Notifications"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Alexander'}</div>
                <div className="text-[10px] text-slate-500 font-medium">{store?.name || 'Main Boutique'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* DASHBOARD TAB CONTENTS */}
        {/* ------------------------------------------------------------- */}
        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* ========================================================= */}
          {/* A. OVERVIEW TAB */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Sales Overview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sales overview</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time revenue metrics, store visitors, and fulfillment stats
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs text-xs font-bold text-slate-600">
                    <button
                      onClick={() => setTimeRange('today')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        timeRange === 'today' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setTimeRange('7d')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        timeRange === '7d' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
                      }`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => setTimeRange('30d')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        timeRange === '30d' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
                      }`}
                    >
                      30 Days
                    </button>
                  </div>

                  <button
                    onClick={startCreatingProduct}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add product
                  </button>
                </div>
              </div>

              {/* 4 TOP METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Sales */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                    <span>Total Sales</span>
                    <span className="flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200/60">
                      <TrendingUp className="w-3 h-3" /> +12.5%
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
                    ${analytics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Synced with Stripe & card transactions</div>
                </div>

                {/* 2. Orders */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                    <span>Total Orders</span>
                    <span className="flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200/60">
                      <TrendingUp className="w-3 h-3" /> +8.2%
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
                    {analytics.ordersCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">{orders.length} active shipments</div>
                </div>

                {/* 3. Conversion Rate */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                    <span>Conversion Rate</span>
                    <span className="flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200/60">
                      <TrendingUp className="w-3 h-3" /> +1.2%
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
                    {analytics.conversionRate}%
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Industry average: 2.80%</div>
                </div>

                {/* 4. Avg. Order Value */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                    <span>Avg. Order Value</span>
                    <span className="flex items-center gap-0.5 text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                      Stable
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
                    ${analytics.avgOrderValue.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Per completed transaction</div>
                </div>
              </div>

              {/* MAIN CHART ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Sales Over Time Area Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Sales over time</div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-extrabold text-slate-900">
                          ${analytics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">+12.5%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                    >
                      View detailed report &rarr;
                    </button>
                  </div>

                  {/* Clean SVG Area Chart */}
                  <div className="h-64 w-full relative pt-4">
                    <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                      <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="160" x2="500" y2="160" stroke="#f1f5f9" strokeWidth="1" />

                      <text x="-5" y="44" textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="600">
                        8K
                      </text>
                      <text x="-5" y="84" textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="600">
                        6K
                      </text>
                      <text x="-5" y="124" textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="600">
                        4K
                      </text>
                      <text x="-5" y="164" textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="600">
                        2K
                      </text>

                      <defs>
                        <linearGradient id="main-area-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      <path
                        d="M 0 170 C 50 160, 100 130, 150 140 C 200 150, 250 90, 300 70 C 350 50, 400 65, 450 30 C 475 15, 500 20, 500 20 L 500 190 L 0 190 Z"
                        fill="url(#main-area-grad)"
                      />
                      <path
                        d="M 0 170 C 50 160, 100 130, 150 140 C 200 150, 250 90, 300 70 C 350 50, 400 65, 450 30 C 475 15, 500 20, 500 20"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="450" cy="30" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                    </svg>

                    <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-3 border-t border-slate-100">
                      <span>00:00</span>
                      <span>04:00</span>
                      <span>08:00</span>
                      <span>12:00</span>
                      <span>16:00</span>
                      <span>20:00</span>
                      <span>24:00</span>
                    </div>
                  </div>
                </div>

                {/* Right: Total Visitors & Top Products */}
                <div className="space-y-6">
                  {/* Total Visitors Bar Chart */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-500">Total visitors</div>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xl font-extrabold text-slate-900">
                            {analytics.visitorsCount.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-emerald-600">+15.5%</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-20 flex items-end gap-1.5 pt-2">
                      {[35, 45, 25, 60, 80, 55, 70, 95, 65, 85, 90, 100, 75, 88].map((val, idx) => (
                        <div key={idx} className="flex-1 bg-slate-100 rounded-t h-full flex items-end">
                          <div
                            className="w-full bg-indigo-600 rounded-t transition-all duration-300 hover:bg-indigo-500 cursor-pointer"
                            style={{ height: `${val}%` }}
                            title={`Day ${idx + 1}: ${val * 12} unique sessions`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900">Top products</h3>
                      <button
                        onClick={() => setActiveTab('products')}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-3">
                      {products.slice(0, 4).map((p) => (
                        <div key={p.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="truncate font-semibold text-slate-800">{p.title}</div>
                          </div>
                          <div className="font-bold text-slate-900 shrink-0">
                            ${(p.price * (p.salesCount || 10)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Quick actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <button
                    onClick={startCreatingProduct}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition text-left cursor-pointer group flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">Add product</span>
                  </button>

                  <button
                    onClick={() => setShowAddDiscountModal(true)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition text-left cursor-pointer group flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Percent className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">Create discount</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition text-left cursor-pointer group flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">View orders</span>
                  </button>

                  <button
                    onClick={() => setShowStoreBuilder(true)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition text-left cursor-pointer group flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">Customize store</span>
                  </button>

                  <button
                    onClick={() => setAiAssistantOpen(true)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition text-left cursor-pointer group flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">AI copilot</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition text-left cursor-pointer group flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">View analytics</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* B. PRODUCTS TAB */}
          {/* ========================================================= */}
          {activeTab === 'products' && <ProductsCatalog />}

          {/* ========================================================= */}
          {/* C. INVENTORY TAB */}
          {/* ========================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Inventory</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Multi-location warehouse inventory control & stock alerts
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={startCreatingProduct}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add stock
                  </button>
                </div>
              </div>

              {/* 4 Inventory Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Total products</div>
                  <div className="text-2xl font-extrabold text-slate-900">{products.length}</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Total stock in warehouse</div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {products.reduce((acc, p) => acc + p.inventory, 0)} units
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Low stock items</div>
                  <div className="text-2xl font-extrabold text-amber-600">
                    {products.filter((p) => p.inventory > 0 && p.inventory < 50).length}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Out of stock</div>
                  <div className="text-2xl font-extrabold text-rose-600">
                    {products.filter((p) => p.inventory === 0).length}
                  </div>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Product</th>
                        <th className="py-3.5 px-4">SKU</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">On Hand</th>
                        <th className="py-3.5 px-4">Stock Status</th>
                        <th className="py-3.5 px-4 text-right">Quick Adjust</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <span className="font-bold text-slate-900">{p.title}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-500">{p.sku}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">Main Hub - US West</td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">{p.inventory}</td>
                          <td className="py-3.5 px-4">
                            {p.inventory > 50 ? (
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                In stock
                              </span>
                            ) : p.inventory > 0 ? (
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                                Low stock ({p.inventory})
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                                Out of stock
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => {
                                  updateProduct(p.id, { inventory: Math.max(0, p.inventory - 10) });
                                  addNotificationToast('info', 'Stock Adjusted', `${p.title} reduced by 10 units.`);
                                }}
                                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                              >
                                -10
                              </button>
                              <button
                                onClick={() => {
                                  updateProduct(p.id, { inventory: p.inventory + 25 });
                                  addNotificationToast('success', 'Stock Adjusted', `${p.title} increased by 25 units.`);
                                }}
                                className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 cursor-pointer"
                              >
                                +25
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* D. ORDERS TAB */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Orders</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage order fulfillments, tracking numbers, and payments
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addNotificationToast('info', 'Export Started', 'Orders CSV export downloaded.')}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export orders
                  </button>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold overflow-x-auto no-scrollbar">
                {['all', 'paid', 'processing', 'shipped', 'delivered', 'pending', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`py-3 px-4 border-b-2 capitalize transition cursor-pointer whitespace-nowrap ${
                      orderFilter === st
                        ? 'border-indigo-600 text-indigo-600 font-extrabold'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Order</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Payment</th>
                        <th className="py-3.5 px-4">Total</th>
                        <th className="py-3.5 px-4">Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{o.orderNumber}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{o.customerName}</div>
                            <div className="text-[11px] text-slate-400">{o.customerEmail}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">{o.date}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{o.paymentMethod}</td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-900">${o.total.toFixed(2)}</td>
                          <td className="py-3.5 px-4">
                            <select
                              value={o.status}
                              onChange={(e) => {
                                updateOrderStatus(o.id, e.target.value as any);
                                addNotificationToast(
                                  'success',
                                  'Order Updated',
                                  `${o.orderNumber} status changed to ${e.target.value}.`
                                );
                              }}
                              className="text-[11px] font-bold rounded-lg border border-slate-200 py-1 px-2.5 bg-white text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
                            >
                              <option value="paid">Paid</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="pending">Pending</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* E. CUSTOMERS TAB */}
          {/* ========================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customers</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    CRM audience segments, lifetime value, and order history
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Customer Name</th>
                      <th className="py-3.5 px-4">Segment</th>
                      <th className="py-3.5 px-4">Orders</th>
                      <th className="py-3.5 px-4">Total Spent</th>
                      <th className="py-3.5 px-4">Last Order</th>
                      <th className="py-3.5 px-4">Tags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <div className="text-[11px] text-slate-400">{c.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200/60">
                            {c.segment}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{c.ordersCount} orders</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">${c.totalSpent.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-slate-500">{c.lastOrderDate}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex gap-1">
                            {c.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* F. DISCOUNTS TAB */}
          {/* ========================================================= */}
          {activeTab === 'discounts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Discounts & Promotions</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Coupon codes, automatic cart promotions, and flash sales
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDiscountModal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create discount code
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Promo Code</th>
                      <th className="py-3.5 px-4">Discount Value</th>
                      <th className="py-3.5 px-4">Usage Count</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Min. Purchase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {discounts.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 text-sm">{d.code}</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          {d.type === 'percentage'
                            ? `${d.value}% OFF`
                            : d.type === 'shipping'
                            ? 'Free Shipping'
                            : `$${d.value} OFF`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-semibold">{d.usageCount} times used</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200/60">
                            Active
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {d.minPurchase ? `Min. $${d.minPurchase}` : 'No minimum'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* G. ANALYTICS TAB */}
          {/* ========================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analytics & Reports</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Deep financial intelligence, gross margins, conversion funnels
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500 mb-2">Total Gross Sales</div>
                  <div className="text-3xl font-extrabold text-slate-900 mb-2">
                    ${analytics.totalSales.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-600 font-bold">+12.5% vs previous 30 days</div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500 mb-2">Online Store Sessions</div>
                  <div className="text-3xl font-extrabold text-slate-900 mb-2">
                    {analytics.visitorsCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-600 font-bold">+15.5% organic growth</div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500 mb-2">Checkout Funnel Completion</div>
                  <div className="text-3xl font-extrabold text-slate-900 mb-2">{analytics.conversionRate}%</div>
                  <div className="text-xs text-emerald-600 font-bold">+1.2% checkout conversion</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* H. SETTINGS TAB */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Store Settings</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-tenant production domain, currencies, tax, and payout credentials
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                <div className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                  General Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Store Name</label>
                    <input
                      type="text"
                      defaultValue={store?.name || 'Sol Pump Store'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Production Domain</label>
                    <input
                      type="text"
                      disabled
                      value="sol-pump.store"
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Store Currency</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold">
                      <option value="USD">USD ($ United States Dollar)</option>
                      <option value="EUR">EUR (€ Euro)</option>
                      <option value="GBP">GBP (£ British Pound)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Current Plan</label>
                    <div className="p-3 bg-indigo-50 border border-indigo-200/60 rounded-xl font-bold text-indigo-700">
                      SOLPUMP Growth Plan ($29/mo)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MODALS & DRAWERS */}
      {/* ------------------------------------------------------------- */}

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(tab) => setActiveTab(tab as any)}
        onAddProduct={startCreatingProduct}
      />

      {/* Store Builder Fullscreen Modal */}
      {showStoreBuilder && <StoreBuilder onClose={() => setShowStoreBuilder(false)} />}

      {/* AI Assistant Modal */}
      {aiAssistantOpen && <AiAssistantModal onClose={() => setAiAssistantOpen(false)} />}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Add new product</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  placeholder="e.g. Handmade Leather Travel Duffel"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inventory Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProdInventory}
                    onChange={(e) => setNewProdInventory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-semibold"
                >
                  <option value="Bags & Leather">Bags & Leather</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Eyewear">Eyewear</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Apparel">Apparel</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Discount Modal */}
      {showAddDiscountModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Create discount code</h3>
              <button
                onClick={() => setShowAddDiscountModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscount} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Discount Code</label>
                <input
                  type="text"
                  required
                  value={newDiscCode}
                  onChange={(e) => setNewDiscCode(e.target.value)}
                  placeholder="e.g. FLASH30"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={newDiscType}
                    onChange={(e) => setNewDiscType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Value ({newDiscType === 'percentage' ? '%' : '$'})
                  </label>
                  <input
                    type="number"
                    required
                    value={newDiscValue}
                    onChange={(e) => setNewDiscValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDiscountModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Activate Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
