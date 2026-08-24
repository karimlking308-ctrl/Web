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
  Megaphone,
  Palette,
  FileText,
  Boxes,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { StoreBuilder } from './StoreBuilder';
import { AiAssistantModal } from './AiAssistantModal';
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
    setAiAssistantOpen
  } = useCommerce();

  // Modals & local state
  const [showStoreBuilder, setShowStoreBuilder] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
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
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80');
  const [newProdDesc, setNewProdDesc] = useState('');

  // New Discount Form State
  const [newDiscCode, setNewDiscCode] = useState('');
  const [newDiscType, setNewDiscType] = useState<'percentage' | 'fixed' | 'shipping'>('percentage');
  const [newDiscValue, setNewDiscValue] = useState('20');
  const [newDiscMin, setNewDiscMin] = useState('50');

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
  };

  // Filtered lists
  const filteredProducts = products.filter(p => {
    if (productFilter !== 'all' && p.status !== productFilter) return false;
    if (productSearch && !p.title.toLowerCase().includes(productSearch.toLowerCase()) && !p.sku.toLowerCase().includes(productSearch.toLowerCase())) return false;
    return true;
  });

  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (orderSearch && !o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) && !o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex font-sans antialiased overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* 1. DARK SIDEBAR (Directly matching the visual reference) */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-64 bg-[#0c101d] border-r border-[#1a2236] flex flex-col shrink-0 z-30 select-none">
        {/* Sidebar Header */}
        <div className="h-16 px-5 border-b border-[#1a2236] flex items-center justify-between">
          <Logo size="md" light={true} />
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs font-semibold">
          {/* Main Group */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#141b2d]'
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
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#141b2d]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400'
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#141b2d]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#141b2d]'
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
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#141b2d]'
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
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#141b2d]'
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
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#141b2d]'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </div>
            </button>
          </div>

          {/* Sales Channels Group */}
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Sales Channels
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setShowStoreBuilder(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#141b2d] transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                  <span>Online Store</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
              </button>

              <button
                onClick={() => setAiAssistantOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-900/30 to-purple-900/20 border border-indigo-500/20 text-indigo-300 hover:text-white hover:border-indigo-500/40 transition cursor-pointer group mt-1"
              >
                <div className="flex items-center gap-3 font-bold">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span>AI Assistant</span>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 font-extrabold">
                  Copilot
                </span>
              </button>
            </div>
          </div>

          {/* Settings Group */}
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Settings & Admin
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#141b2d]'
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
        <div className="p-3 border-t border-[#1a2236] bg-[#090d18]">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#141b2d] transition">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
                {user?.name ? user.name.charAt(0) : 'J'}
              </div>
              <div className="truncate">
                <div className="font-bold text-xs text-white truncate">{user?.name || 'John Doe'}</div>
                <div className="text-[10px] text-slate-500 truncate">{store?.domain || 'sol-pump.store'}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. CRISP LIGHT MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col bg-[#f8fafc] text-slate-900 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
          {/* Global Search Input */}
          <div className="flex items-center gap-2 max-w-md w-full">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything (products, orders, customers)..."
                className="w-full bg-slate-100 hover:bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-12 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
              <div className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                ⌘K
              </div>
            </div>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStoreBuilder(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => setAiAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Copilot</span>
            </button>

            <div className="h-5 w-px bg-slate-200" />

            <button
              title="Notifications"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            </button>

            <button
              title="Help Center"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                {user?.name ? user.name.charAt(0) : 'J'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'John Doe'}</div>
                <div className="text-[10px] text-slate-500 font-medium">My Store ▾</div>
              </div>
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* DASHBOARD TAB CONTENTS */}
        {/* ------------------------------------------------------------- */}
        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* ========================================================= */}
          {/* A. OVERVIEW TAB (Directly matching visual reference right side) */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Sales Overview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-950 tracking-tight">Sales overview</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time revenue metrics, store visitors, and fulfillment stats</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs text-xs font-bold text-slate-600">
                    <button
                      onClick={() => setTimeRange('today')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        timeRange === 'today' ? 'bg-slate-950 text-white' : 'hover:text-slate-900'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setTimeRange('7d')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        timeRange === '7d' ? 'bg-slate-950 text-white' : 'hover:text-slate-900'
                      }`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => setTimeRange('30d')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        timeRange === '30d' ? 'bg-slate-950 text-white' : 'hover:text-slate-900'
                      }`}
                    >
                      30 Days
                    </button>
                  </div>

                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add product
                  </button>
                </div>
              </div>

              {/* 4 TOP METRIC CARDS WITH PURPLE SPARKLINE CHARTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Sales */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                    <span>Total Sales</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                      <TrendingUp className="w-3 h-3" /> +12.5%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-950 tracking-tight mb-3">
                    ${analytics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  {/* Purple Sparkline SVG */}
                  <div className="h-10 w-full">
                    <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                      <path
                        d="M0 25 Q15 28 30 18 T60 12 T80 8 T100 2"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M0 25 Q15 28 30 18 T60 12 T80 8 T100 2 V30 H0 Z"
                        fill="url(#sparkline-grad)"
                        opacity="0.2"
                      />
                      <defs>
                        <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* 2. Orders */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                    <span>Orders</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                      <TrendingUp className="w-3 h-3" /> +8.2%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-950 tracking-tight mb-3">
                    {analytics.ordersCount.toLocaleString()}
                  </div>
                  {/* Purple Sparkline SVG */}
                  <div className="h-10 w-full">
                    <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                      <path
                        d="M0 20 Q20 22 40 10 T70 14 T100 4"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M0 20 Q20 22 40 10 T70 14 T100 4 V30 H0 Z"
                        fill="url(#sparkline-grad)"
                        opacity="0.2"
                      />
                    </svg>
                  </div>
                </div>

                {/* 3. Conversion Rate */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                    <span>Conversion Rate</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                      <TrendingUp className="w-3 h-3" /> +1.2%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-950 tracking-tight mb-3">
                    {analytics.conversionRate}%
                  </div>
                  {/* Purple Sparkline SVG */}
                  <div className="h-10 w-full">
                    <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                      <path
                        d="M0 24 Q25 15 50 18 T75 8 T100 3"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M0 24 Q25 15 50 18 T75 8 T100 3 V30 H0 Z"
                        fill="url(#sparkline-grad)"
                        opacity="0.2"
                      />
                    </svg>
                  </div>
                </div>

                {/* 4. Avg. Order Value */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                    <span>Avg. Order Value</span>
                    <span className="flex items-center gap-0.5 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[11px]">
                      <TrendingDown className="w-3 h-3" /> -1.6%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-950 tracking-tight mb-3">
                    ${analytics.avgOrderValue.toFixed(2)}
                  </div>
                  {/* Purple Sparkline SVG */}
                  <div className="h-10 w-full">
                    <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                      <path
                        d="M0 10 Q25 8 50 18 T75 14 T100 20"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M0 10 Q25 8 50 18 T75 14 T100 20 V30 H0 Z"
                        fill="url(#sparkline-grad)"
                        opacity="0.2"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* MAIN CHART ROW (Left: 2/3 area chart, Right: 1/3 visitors bar chart & top products) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Sales Over Time Area Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Sales over time</div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-slate-950">${analytics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span className="text-xs font-bold text-emerald-600">+12.5%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                    >
                      View report &rarr;
                    </button>
                  </div>

                  {/* Main Gradient Smooth Area Chart */}
                  <div className="h-64 w-full relative pt-4">
                    <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="160" x2="500" y2="160" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Y Axis Labels */}
                      <text x="-5" y="44" textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="600">8K</text>
                      <text x="-5" y="84" textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="600">6K</text>
                      <text x="-5" y="124" textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="600">4K</text>
                      <text x="-5" y="164" textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="600">2K</text>

                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="main-area-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path
                        d="M 0 170 C 50 160, 100 130, 150 140 C 200 150, 250 90, 300 70 C 350 50, 400 65, 450 30 C 475 15, 500 20, 500 20 L 500 190 L 0 190 Z"
                        fill="url(#main-area-grad)"
                      />

                      {/* Smooth Stroke Line */}
                      <path
                        d="M 0 170 C 50 160, 100 130, 150 140 C 200 150, 250 90, 300 70 C 350 50, 400 65, 450 30 C 475 15, 500 20, 500 20"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Highlight Peak Dot */}
                      <circle cx="450" cy="30" r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="2.5" />
                    </svg>

                    {/* X Axis Time Labels */}
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
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-500">Total visitors</div>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xl font-black text-slate-950">{analytics.visitorsCount.toLocaleString()}</span>
                          <span className="text-xs font-bold text-emerald-600">+15.5%</span>
                        </div>
                      </div>
                    </div>

                    {/* 14 Vertical Purple Bars */}
                    <div className="h-20 flex items-end gap-1.5 pt-2">
                      {[35, 45, 25, 60, 80, 55, 70, 95, 65, 85, 90, 100, 75, 88].map((val, idx) => (
                        <div key={idx} className="flex-1 bg-slate-100 rounded-t h-full flex items-end">
                          <div
                            className="w-full bg-indigo-600 rounded-t transition-all duration-500 hover:bg-indigo-500"
                            style={{ height: `${val}%` }}
                            title={`Period ${idx + 1}: ${val * 10} visitors`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-950">Top products</h3>
                      <button
                        onClick={() => setActiveTab('products')}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-3">
                      {products.slice(0, 4).map((p, idx) => (
                        <div key={p.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <img src={p.image} alt={p.title} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                            <div className="truncate font-semibold text-slate-800">{p.title}</div>
                          </div>
                          <div className="font-bold text-slate-950 shrink-0">
                            ${(p.price * (p.salesCount || 10)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS (6 Clean cards with purple icons matching the reference) */}
              <div>
                <h3 className="text-sm font-bold text-slate-950 mb-3">Quick actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* 1. Add Product */}
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">Add product</span>
                  </button>

                  {/* 2. Create Discount */}
                  <button
                    onClick={() => setShowAddDiscountModal(true)}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Percent className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">Create discount</span>
                  </button>

                  {/* 3. View Orders */}
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">View orders</span>
                  </button>

                  {/* 4. Customize Store */}
                  <button
                    onClick={() => setShowStoreBuilder(true)}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">Customize store</span>
                  </button>

                  {/* 5. Create Campaign */}
                  <button
                    onClick={() => setAiAssistantOpen(true)}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">Create campaign</span>
                  </button>

                  {/* 6. View Analytics */}
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between h-28"
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
          {/* B. PRODUCTS TAB (Matching reference products view) */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-950 tracking-tight">Products</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Manage your catalog, stock levels, variants, and pricing</p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <button className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Import
                  </button>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add product
                  </button>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'active', label: 'Active' },
                  { key: 'draft', label: 'Draft' },
                  { key: 'archived', label: 'Archived' }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setProductFilter(t.key as any)}
                    className={`py-3 px-4 border-b-2 transition cursor-pointer ${
                      productFilter === t.key
                        ? 'border-indigo-600 text-indigo-600 font-extrabold'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Search & Filters Bar */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by title or SKU..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer">
                    <Filter className="w-3.5 h-3.5" /> Collection ▾
                  </button>
                  <button className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer">
                    More filters ▾
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4 w-12 text-center">
                          <input type="checkbox" className="rounded accent-indigo-600" />
                        </th>
                        <th className="py-3.5 px-4">Product</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Inventory</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Sales</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60 transition group">
                          <td className="py-3.5 px-4 text-center">
                            <input type="checkbox" className="rounded accent-indigo-600" />
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.title} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                              <div>
                                <div className="font-bold text-slate-900">{p.title}</div>
                                <div className="text-[11px] text-slate-400 font-mono">SKU: {p.sku}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              p.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {p.status === 'active' ? 'Active' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold">
                            {p.inventory > 0 ? (
                              <span className="text-slate-700">{p.inventory} in stock</span>
                            ) : (
                              <span className="text-rose-600 font-bold">0 in stock</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-950">
                            ${p.price.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {p.salesCount || 0}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                              title="Delete product"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Showing {filteredProducts.length} of {products.length} products</span>
                  <div className="flex items-center gap-1">
                    <button className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">&lt; Previous</button>
                    <button className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold">1</button>
                    <button className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">2</button>
                    <button className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">Next &gt;</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* C. INVENTORY TAB (Matching reference inventory view) */}
          {/* ========================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-950 tracking-tight">Inventory</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Multi-location warehouse inventory control & stock alerts</p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer">
                    View history
                  </button>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add stock
                  </button>
                </div>
              </div>

              {/* 4 Inventory Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Total products</div>
                  <div className="text-2xl font-black text-slate-950">{products.length}</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Total stock in warehouse</div>
                  <div className="text-2xl font-black text-slate-950">
                    {products.reduce((acc, p) => acc + p.inventory, 0)} units
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Low stock items</div>
                  <div className="text-2xl font-black text-amber-600">
                    {products.filter(p => p.inventory > 0 && p.inventory < 50).length}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Out of stock</div>
                  <div className="text-2xl font-black text-rose-600">
                    {products.filter(p => p.inventory === 0).length}
                  </div>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
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
                              <img src={p.image} alt={p.title} className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" />
                              <span className="font-bold text-slate-900">{p.title}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-500">{p.sku}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">Main Hub - US West</td>
                          <td className="py-3.5 px-4 font-black text-slate-950 text-sm">{p.inventory}</td>
                          <td className="py-3.5 px-4">
                            {p.inventory > 50 ? (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                In stock
                              </span>
                            ) : p.inventory > 0 ? (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                                Low stock ({p.inventory})
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                                Out of stock
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => updateProduct(p.id, { inventory: Math.max(0, p.inventory - 10) })}
                                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                              >
                                -10
                              </button>
                              <button
                                onClick={() => updateProduct(p.id, { inventory: p.inventory + 25 })}
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
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-950 tracking-tight">Orders</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Manage order fulfillments, tracking numbers, and payments</p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer">
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
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
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
                          <td className="py-3.5 px-4 font-black text-slate-950">${o.total.toFixed(2)}</td>
                          <td className="py-3.5 px-4">
                            <select
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                              className="text-[11px] font-bold rounded-lg border border-slate-200 py-1 px-2.5 bg-white text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
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
                  <h1 className="text-2xl font-black text-slate-950 tracking-tight">Customers</h1>
                  <p className="text-xs text-slate-500 mt-0.5">CRM audience segments, lifetime value, and order history</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
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
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200/60">
                            {c.segment}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{c.ordersCount} orders</td>
                        <td className="py-3.5 px-4 font-black text-slate-950">${c.totalSpent.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-slate-500">{c.lastOrderDate}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex gap-1">
                            {c.tags.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 font-medium">{t}</span>
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
                  <h1 className="text-2xl font-black text-slate-950 tracking-tight">Discounts & Promotions</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Coupon codes, automatic cart promotions, and flash sales</p>
                </div>
                <button
                  onClick={() => setShowAddDiscountModal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create discount code
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
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
                        <td className="py-3.5 px-4 font-black text-slate-900">
                          {d.type === 'percentage' ? `${d.value}% OFF` : d.type === 'shipping' ? 'Free Shipping' : `$${d.value} OFF`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-semibold">{d.usageCount} times used</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200/60">
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
                  <h1 className="text-2xl font-black text-slate-950 tracking-tight">Analytics & Reports</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Deep financial intelligence, gross margins, conversion funnels</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 mb-2">Total Gross Sales</div>
                  <div className="text-3xl font-black text-slate-950 mb-2">${analytics.totalSales.toLocaleString()}</div>
                  <div className="text-xs text-emerald-600 font-bold">+12.5% vs previous 30 days</div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 mb-2">Online Store Sessions</div>
                  <div className="text-3xl font-black text-slate-950 mb-2">{analytics.visitorsCount.toLocaleString()}</div>
                  <div className="text-xs text-emerald-600 font-bold">+15.5% organic growth</div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 mb-2">Checkout Funnel Completion</div>
                  <div className="text-3xl font-black text-slate-950 mb-2">{analytics.conversionRate}%</div>
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
                <h1 className="text-2xl font-black text-slate-950 tracking-tight">Store Settings</h1>
                <p className="text-xs text-slate-500 mt-0.5">Multi-tenant production domain, currencies, tax, and payout credentials</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                  General Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Store Name</label>
                    <input type="text" defaultValue={store?.name || 'Sol Pump Store'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Production Domain</label>
                    <input type="text" disabled value="sol-pump.store" className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-500 font-mono" />
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

      {/* Store Builder Fullscreen Modal */}
      {showStoreBuilder && (
        <StoreBuilder onClose={() => setShowStoreBuilder(false)} />
      )}

      {/* AI Assistant Modal */}
      {aiAssistantOpen && (
        <AiAssistantModal onClose={() => setAiAssistantOpen(false)} />
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-black text-slate-950">Add new product</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-600">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-semibold"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inventory Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProdInventory}
                    onChange={(e) => setNewProdInventory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-semibold"
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
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/25"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-black text-slate-950">Create discount code</h3>
              <button onClick={() => setShowAddDiscountModal(false)} className="text-slate-400 hover:text-slate-600">
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
                  <label className="block font-bold text-slate-700 mb-1">Value ({newDiscType === 'percentage' ? '%' : '$'})</label>
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
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/25"
                >
                  Activate Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
