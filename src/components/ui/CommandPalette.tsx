import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Sparkles,
  Settings,
  Plus,
  ArrowRight,
  X,
  CreditCard,
  Layers,
  Store as StoreIcon
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onAddProduct: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onAddProduct
}) => {
  const { products, orders, customers } = useCommerce();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const quickNav = [
    { id: 'overview', title: 'Overview Dashboard', category: 'Navigation', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'products', title: 'Products & Inventory Catalog', category: 'Navigation', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', title: 'Orders & Shipments', category: 'Navigation', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'customers', title: 'Customers & CRM', category: 'Navigation', icon: <Users className="w-4 h-4" /> },
    { id: 'inventory', title: 'Inventory Levels & Reorder', category: 'Navigation', icon: <Layers className="w-4 h-4" /> },
    { id: 'analytics', title: 'Analytics & Financial Performance', category: 'Navigation', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ai', title: 'AI Commerce Business Intelligence', category: 'Navigation', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'settings', title: 'Store Settings & Payments', category: 'Navigation', icon: <Settings className="w-4 h-4" /> }
  ];

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)).slice(0, 4);
  }, [products, query]);

  const filteredOrders = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return orders
      .filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      )
      .slice(0, 3);
  }, [orders, query]);

  const filteredCustomers = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 3);
  }, [customers, query]);

  const filteredNav = useMemo(() => {
    if (!query.trim()) return quickNav;
    const q = query.toLowerCase();
    return quickNav.filter((n) => n.title.toLowerCase().includes(q));
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 bg-slate-900/40 backdrop-blur-xs font-sans">
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, customers, or actions..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <span className="text-[10px] font-mono font-semibold bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
              ESC
            </span>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Actions */}
          <div>
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Actions
            </div>
            <div className="space-y-0.5 mt-0.5">
              <button
                onClick={() => {
                  onAddProduct();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span>Create new product</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
              </button>
            </div>
          </div>

          {/* Products Results */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Products ({filteredProducts.length})
              </div>
              <div className="space-y-0.5 mt-0.5">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      onNavigate('products');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={product.image}
                        alt=""
                        className="w-6 h-6 rounded object-cover border border-slate-200 shrink-0"
                      />
                      <span className="font-semibold text-slate-900 truncate">{product.title}</span>
                      <span className="text-[11px] text-slate-400 font-mono">SKU: {product.sku}</span>
                    </div>
                    <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders Results */}
          {filteredOrders.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Orders ({filteredOrders.length})
              </div>
              <div className="space-y-0.5 mt-0.5">
                {filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      onNavigate('orders');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="font-mono font-bold text-indigo-600">{order.orderNumber}</span>
                      <span className="text-slate-900 truncate">{order.customerName}</span>
                    </div>
                    <span className="font-bold text-slate-900">${order.total.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pages & Workspaces
              </div>
              <div className="space-y-0.5 mt-0.5">
                {filteredNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-slate-500 group-hover:text-indigo-600 transition">{item.icon}</span>
                      <span className="text-slate-900">{item.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Go to view</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-600 shadow-2xs">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-600 shadow-2xs">
                ↵
              </kbd>{' '}
              Select
            </span>
          </div>
          <span>SOLPUMP Commerce Search</span>
        </div>
      </div>
    </div>
  );
};
