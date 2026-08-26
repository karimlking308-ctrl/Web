import React, { useState, useRef } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { Product } from '../../types/commerce';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Archive,
  AlertTriangle,
  Boxes,
  Check,
  ArrowUpDown,
  ExternalLink,
  Sparkles,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export const ProductsCatalog: React.FC = () => {
  const {
    products,
    startCreatingProduct,
    startEditingProduct,
    startPreviewingProduct,
    deleteProduct,
    duplicateProduct,
    archiveProduct,
    bulkUpdateStatus,
    bulkDeleteProducts,
    exportProductsToCsv,
    importProductsFromCsv
  } = useCommerce();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  // Hidden file input for CSV import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract dynamic categories & vendors
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const vendors = Array.from(new Set(products.map(p => p.vendor).filter(Boolean)));

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      searchTerm === '' ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.vendor && p.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesVendor = vendorFilter === 'all' || p.vendor === vendorFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesVendor;
  });

  // Bulk actions selection
  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // CSV Export handler
  const handleExportCsv = () => {
    const csvData = exportProductsToCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sol-pump-products-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (content) {
        importProductsFromCsv(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Stats computation
  const activeCount = products.filter(p => p.status === 'active').length;
  const draftCount = products.filter(p => p.status === 'draft').length;
  const lowStockCount = products.filter(p => p.trackInventory && p.inventory > 0 && p.inventory <= (p.lowStockThreshold || 10)).length;
  const outOfStockCount = products.filter(p => p.trackInventory && p.inventory <= 0).length;

  return (
    <div className="space-y-6">
      {/* Hidden CSV file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />

      {/* Top Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-950 tracking-tight">Products</h1>
            <span className="bg-slate-200 text-slate-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {products.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store catalog, pricing matrices, inventory sync, and multi-channel publishing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={startCreatingProduct}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add product</span>
          </button>
        </div>
      </div>

      {/* Metric Quick Filter Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'all'
              ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">All Catalog</div>
          <div className="text-xl font-black text-slate-950 mt-0.5">{products.length}</div>
        </button>

        <button
          onClick={() => setStatusFilter('active')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'active'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Active Live</div>
          <div className="text-xl font-black text-emerald-700 mt-0.5">{activeCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('draft')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === 'draft'
              ? 'border-amber-600 bg-amber-50/50 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Drafts</div>
          <div className="text-xl font-black text-amber-700 mt-0.5">{draftCount}</div>
        </button>

        <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
          <div className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Inventory Alerts</div>
          <div className="text-xl font-black text-rose-600 mt-0.5 flex items-center gap-2">
            <span>{lowStockCount + outOfStockCount}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              ({lowStockCount} low, {outOfStockCount} out)
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex-1 flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search products by title, SKU, vendor, tags..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Vendor Filter */}
            {vendors.length > 0 && (
              <select
                value={vendorFilter}
                onChange={e => setVendorFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
              >
                <option value="all">All Vendors</option>
                {vendors.map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Bulk Selection Bar */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl">
              <span className="text-xs font-extrabold text-indigo-900">{selectedIds.length} selected</span>
              <div className="h-4 w-px bg-indigo-200" />
              <button
                onClick={() => bulkUpdateStatus(selectedIds, 'active')}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 px-2 py-0.5 rounded bg-emerald-100/50"
              >
                Set Active
              </button>
              <button
                onClick={() => bulkUpdateStatus(selectedIds, 'draft')}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900 px-2 py-0.5 rounded bg-amber-100/50"
              >
                Set Draft
              </button>
              <button
                onClick={() => {
                  bulkDeleteProducts(selectedIds);
                  setSelectedIds([]);
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 px-2 py-0.5 rounded bg-rose-100/50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Products Table (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                    onChange={handleSelectAll}
                    className="rounded accent-indigo-600 cursor-pointer"
                  />
                </th>
                <th className="p-4">Product</th>
                <th className="p-4">Status</th>
                <th className="p-4">Inventory</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <Boxes className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div className="text-sm font-bold text-slate-800">No products found</div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try adjusting your search filters or click "Add product" to create your first item.
                    </p>
                    <button
                      onClick={startCreatingProduct}
                      className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-500 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(prod => {
                  const isSelected = selectedIds.includes(prod.id);

                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-slate-50/80 transition group ${isSelected ? 'bg-indigo-50/30' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(prod.id)}
                          className="rounded accent-indigo-600 cursor-pointer"
                        />
                      </td>

                      {/* Product Thumbnail & Details */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                            {prod.image ? (
                              <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                #
                              </div>
                            )}
                          </div>
                          <div>
                            <button
                              onClick={() => startEditingProduct(prod)}
                              className="font-bold text-slate-950 hover:text-indigo-600 transition text-left cursor-pointer line-clamp-1"
                            >
                              {prod.title}
                            </button>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                              <span>SKU: {prod.sku || 'N/A'}</span>
                              {prod.variants && prod.variants.length > 0 && (
                                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-sans text-[10px]">
                                  {prod.variants.length} variants
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status Pill */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                            prod.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : prod.status === 'draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              prod.status === 'active'
                                ? 'bg-emerald-500'
                                : prod.status === 'draft'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          {prod.status}
                        </span>
                      </td>

                      {/* Inventory */}
                      <td className="p-4">
                        {prod.trackInventory ? (
                          prod.inventory <= 0 ? (
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Out of stock
                            </span>
                          ) : prod.inventory <= (prod.lowStockThreshold || 10) ? (
                            <span className="text-amber-600 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {prod.inventory} in stock (Low)
                            </span>
                          ) : (
                            <span className="text-slate-800 font-bold font-mono">
                              {prod.inventory} in stock
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400">Not tracked</span>
                        )}
                      </td>

                      {/* Category & Vendor */}
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{prod.category}</div>
                        <div className="text-[10px] text-slate-400">{prod.vendor || 'SOL'}</div>
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        <div className="font-black text-slate-950 font-mono">${prod.price.toFixed(2)}</div>
                        {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                          <div className="text-[10px] text-slate-400 line-through font-mono">
                            ${prod.compareAtPrice.toFixed(2)}
                          </div>
                        )}
                      </td>

                      {/* Row Action Menu */}
                      <td className="p-4 text-right relative">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startPreviewingProduct(prod)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                            title="Preview storefront page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => startEditingProduct(prod)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                            title="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => duplicateProduct(prod.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                            title="Duplicate product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Products Card List (Mobile) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Boxes className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-800">No products found</div>
              <button
                onClick={startCreatingProduct}
                className="mt-4 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Add Product
              </button>
            </div>
          ) : (
            filteredProducts.map(prod => (
              <div key={prod.id} className="p-4 bg-white flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{prod.title}</h4>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">${prod.price.toFixed(2)} USD</div>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      prod.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {prod.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div className="text-slate-600 font-mono">
                    {prod.trackInventory ? `${prod.inventory} in stock` : 'Inventory not tracked'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startPreviewingProduct(prod)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer min-h-[40px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => startEditingProduct(prod)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer min-h-[40px] shadow-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
