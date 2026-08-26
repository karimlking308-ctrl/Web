import React, { useState, useEffect } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { Product, ProductMedia, ProductOption, ProductVariant } from '../../types/commerce';
import {
  ArrowLeft,
  Sparkles,
  Save,
  Eye,
  Trash2,
  Plus,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  TrendingUp,
  Percent,
  DollarSign,
  HelpCircle,
  Layers,
  Globe,
  Tag,
  Package,
  Boxes,
  Truck,
  FileText,
  Search,
  ExternalLink,
  ChevronDown,
  X,
  Copy,
  FolderPlus,
  Sliders,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const ProductEditor: React.FC = () => {
  const {
    store,
    editingProduct,
    closeProductEditor,
    addProduct,
    updateProduct,
    startPreviewingProduct,
    generateAiProductData,
    generateAiSeoData
  } = useCommerce();

  const isEditMode = Boolean(editingProduct);

  // Form State
  const [title, setTitle] = useState(editingProduct?.title || '');
  const [shortDescription, setShortDescription] = useState(editingProduct?.shortDescription || '');
  const [description, setDescription] = useState(
    editingProduct?.description ||
      '<p>Handcrafted using the finest materials, designed for timeless durability and modern utility.</p><ul><li><strong>Premium Build:</strong> Built to withstand rigorous daily use.</li><li><strong>Refined Aesthetic:</strong> Complements any sophisticated ensemble.</li></ul>'
  );
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>(editingProduct?.status || 'active');
  const [category, setCategory] = useState(editingProduct?.category || 'Bags & Leather');
  const [vendor, setVendor] = useState(editingProduct?.vendor || 'Sol Artisan Goods');
  const [productType, setProductType] = useState(editingProduct?.productType || 'Travel Accessories');
  
  // Pricing
  const [price, setPrice] = useState(editingProduct ? editingProduct.price.toString() : '129.00');
  const [compareAtPrice, setCompareAtPrice] = useState(
    editingProduct?.compareAtPrice ? editingProduct.compareAtPrice.toString() : '179.00'
  );
  const [cost, setCost] = useState(editingProduct ? editingProduct.cost.toString() : '45.00');
  const [currency, setCurrency] = useState(editingProduct?.currency || 'USD');
  const [chargeTax, setChargeTax] = useState(true);

  // Inventory
  const [sku, setSku] = useState(editingProduct?.sku || 'LB-001');
  const [barcode, setBarcode] = useState(editingProduct?.barcode || '880123456789');
  const [trackInventory, setTrackInventory] = useState(editingProduct ? editingProduct.trackInventory : true);
  const [continueSellingOutOfStock, setContinueSellingOutOfStock] = useState(false);
  const [inventory, setInventory] = useState(editingProduct ? editingProduct.inventory.toString() : '120');
  const [lowStockThreshold, setLowStockThreshold] = useState(
    editingProduct?.lowStockThreshold ? editingProduct.lowStockThreshold.toString() : '10'
  );

  // Locations breakdown
  const [locationsStock, setLocationsStock] = useState([
    { id: 'loc-1', name: 'Main Fulfillment Hub (HQ)', qty: 80 },
    { id: 'loc-2', name: 'Downtown Retail Store', qty: 30 },
    { id: 'loc-3', name: 'West Coast Warehouse', qty: 10 }
  ]);

  // Media
  const [mediaList, setMediaList] = useState<ProductMedia[]>(
    editingProduct?.media && editingProduct.media.length > 0
      ? editingProduct.media
      : [
          {
            id: 'med-1',
            url: editingProduct?.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
            type: 'image',
            name: 'primary-cover.jpg',
            isPrimary: true
          },
          {
            id: 'med-2',
            url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
            type: 'image',
            name: 'side-angle.jpg',
            isPrimary: false
          }
        ]
  );
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'video' | '3d'>('image');

  // Variants & Options
  const [hasVariants, setHasVariants] = useState(
    Boolean(editingProduct?.variants && editingProduct.variants.length > 0)
  );
  const [options, setOptions] = useState<ProductOption[]>(
    editingProduct?.options && editingProduct.options.length > 0
      ? editingProduct.options
      : [
          { id: 'opt-1', name: 'Color', values: ['Vintage Cognac', 'Midnight Black', 'Desert Tan'] },
          { id: 'opt-2', name: 'Size', values: ['Standard', 'Extended'] }
        ]
  );
  const [variants, setVariants] = useState<ProductVariant[]>(
    editingProduct?.variants && editingProduct.variants.length > 0
      ? editingProduct.variants
      : [
          {
            id: 'var-1',
            title: 'Vintage Cognac / Standard',
            options: { Color: 'Vintage Cognac', Size: 'Standard' },
            sku: 'LB-001-COG-STD',
            price: 129.0,
            cost: 45.0,
            inventory: 50,
            image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'
          },
          {
            id: 'var-2',
            title: 'Midnight Black / Standard',
            options: { Color: 'Midnight Black', Size: 'Standard' },
            sku: 'LB-001-BLK-STD',
            price: 129.0,
            cost: 45.0,
            inventory: 40,
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
          },
          {
            id: 'var-3',
            title: 'Desert Tan / Extended',
            options: { Color: 'Desert Tan', Size: 'Extended' },
            sku: 'LB-001-TAN-EXT',
            price: 149.0,
            cost: 50.0,
            inventory: 30
          }
        ]
  );

  // New Option input
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [selectedOptionIdForValue, setSelectedOptionIdForValue] = useState<string | null>(null);

  // Shipping
  const [requiresShipping, setRequiresShipping] = useState(
    editingProduct ? editingProduct.requiresShipping : true
  );
  const [isDigital, setIsDigital] = useState(editingProduct ? editingProduct.isDigital : false);
  const [weight, setWeight] = useState(editingProduct?.weight ? editingProduct.weight.toString() : '1.2');
  const [length, setLength] = useState('45');
  const [width, setWidth] = useState('32');
  const [height, setHeight] = useState('18');
  const [hsCode, setHsCode] = useState('4202.92');

  // SEO
  const [slug, setSlug] = useState(
    editingProduct?.slug ||
      (editingProduct?.title ? editingProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'leather-travel-backpack')
  );
  const [seoTitle, setSeoTitle] = useState(
    editingProduct?.seoTitle || (editingProduct?.title ? `${editingProduct.title} | SOL-PUMP` : 'Artisan Leather Travel Backpack | Sol Pump Store')
  );
  const [seoDescription, setSeoDescription] = useState(
    editingProduct?.seoDescription ||
      'Shop our premium full-grain Moroccan leather travel backpack with laptop compartment. Free express shipping on all domestic orders.'
  );

  // Organization
  const [collections, setCollections] = useState<string[]>(
    editingProduct?.collections || ['Summer 2026', 'Best Sellers', 'Featured']
  );
  const [newCollectionInput, setNewCollectionInput] = useState('');
  const [tags, setTags] = useState<string[]>(
    editingProduct?.tags || ['Handmade', 'Leather', 'Travel', 'Waterproof']
  );
  const [tagInput, setTagInput] = useState('');
  const [salesChannels, setSalesChannels] = useState<string[]>(
    editingProduct?.salesChannels || ['Online Store', 'Social', 'POS']
  );

  // AI Modal / Inline Generator
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculation helpers
  const numericPrice = parseFloat(price) || 0;
  const numericComparePrice = parseFloat(compareAtPrice) || 0;
  const numericCost = parseFloat(cost) || 0;
  const profit = Math.max(0, numericPrice - numericCost);
  const margin = numericPrice > 0 ? ((profit / numericPrice) * 100).toFixed(1) : '0.0';

  // Auto-sync slug from title if not customized manually
  const handleTitleChange = (newVal: string) => {
    setTitle(newVal);
    if (!editingProduct) {
      const generatedSlug = newVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
      setSeoTitle(`${newVal} | Sol Pump Store`);
    }
  };

  // Tag helper
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Collection helper
  const handleAddCollection = () => {
    if (newCollectionInput.trim() && !collections.includes(newCollectionInput.trim())) {
      setCollections([...collections, newCollectionInput.trim()]);
      setNewCollectionInput('');
    }
  };

  const handleRemoveCollection = (cToRemove: string) => {
    setCollections(collections.filter(c => c !== cToRemove));
  };

  // Media Manager helper
  const handleAddSampleImage = (url: string) => {
    const newMedia: ProductMedia = {
      id: `med-${Date.now()}-${Math.random()}`,
      url,
      type: 'image',
      name: `product-asset-${mediaList.length + 1}.jpg`,
      isPrimary: mediaList.length === 0
    };
    setMediaList([...mediaList, newMedia]);
  };

  const handleSetPrimaryMedia = (id: string) => {
    setMediaList(mediaList.map(m => ({ ...m, isPrimary: m.id === id })));
  };

  const handleDeleteMedia = (id: string) => {
    const remaining = mediaList.filter(m => m.id !== id);
    if (remaining.length > 0 && !remaining.some(m => m.isPrimary)) {
      remaining[0].isPrimary = true;
    }
    setMediaList(remaining);
  };

  // Variant generator builder
  const handleAddOption = () => {
    if (!newOptionName.trim()) return;
    const newOpt: ProductOption = {
      id: `opt-${Date.now()}`,
      name: newOptionName.trim(),
      values: []
    };
    setOptions([...options, newOpt]);
    setNewOptionName('');
    setSelectedOptionIdForValue(newOpt.id);
  };

  const handleAddOptionValue = (optId: string) => {
    if (!newOptionValue.trim()) return;
    setOptions(
      options.map(opt => {
        if (opt.id === optId && !opt.values.includes(newOptionValue.trim())) {
          return { ...opt, values: [...opt.values, newOptionValue.trim()] };
        }
        return opt;
      })
    );
    setNewOptionValue('');
  };

  const handleRemoveOptionValue = (optId: string, val: string) => {
    setOptions(
      options.map(opt => {
        if (opt.id === optId) {
          return { ...opt, values: opt.values.filter(v => v !== val) };
        }
        return opt;
      })
    );
  };

  const handleGenerateVariantMatrix = () => {
    const validOptions = options.filter(o => o.values.length > 0);
    if (validOptions.length === 0) return;

    // Cartesian product
    const cartesian = (arr: any[][]): any[][] =>
      arr.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

    const optionValues = validOptions.map(o => o.values.map(val => ({ optionName: o.name, val })));
    const combinations = validOptions.length === 1 ? optionValues[0].map(item => [item]) : cartesian(optionValues);

    const generatedVariants: ProductVariant[] = combinations.map((combo, idx) => {
      const optsMap: Record<string, string> = {};
      combo.forEach((item: any) => {
        optsMap[item.optionName] = item.val;
      });
      const titleStr = Object.values(optsMap).join(' / ');
      const skuSuffix = Object.values(optsMap)
        .map(v => v.slice(0, 3).toUpperCase())
        .join('-');

      return {
        id: `var-gen-${idx + 1}-${Date.now()}`,
        title: titleStr,
        options: optsMap,
        sku: `${sku}-${skuSuffix}`,
        price: numericPrice,
        compareAtPrice: numericComparePrice > 0 ? numericComparePrice : undefined,
        cost: numericCost,
        inventory: Math.floor((parseInt(inventory) || 60) / Math.max(1, combinations.length)),
        image: mediaList[0]?.url
      };
    });

    setVariants(generatedVariants);
  };

  // AI Product Generation Handler
  const handleRunAiGenerator = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setErrorMsg('');
    try {
      const data = await generateAiProductData(aiPrompt, category);
      if (data) {
        if (data.title) handleTitleChange(data.title);
        if (data.shortDescription) setShortDescription(data.shortDescription);
        if (data.description) setDescription(data.description);
        if (data.category) setCategory(data.category);
        if (data.vendor) setVendor(data.vendor);
        if (data.productType) setProductType(data.productType);
        if (data.suggestedPrice) setPrice(data.suggestedPrice.toString());
        if (data.suggestedCost) setCost(data.suggestedCost.toString());
        if (Array.isArray(data.tags)) setTags(data.tags);
        if (data.seoTitle) setSeoTitle(data.seoTitle);
        if (data.seoDescription) setSeoDescription(data.seoDescription);

        setAiSuccessMsg('✨ AI product metadata generated and applied to form!');
        setTimeout(() => setAiSuccessMsg(''), 4000);
        setShowAiDrawer(false);
      }
    } catch (err) {
      setErrorMsg('Could not complete AI generation. Defaulted to structured template.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // AI SEO Generator Handler
  const handleRunAiSeo = async () => {
    if (!title.trim()) {
      setErrorMsg('Enter a product title first to generate SEO.');
      return;
    }
    setIsAiGenerating(true);
    try {
      const seoData = await generateAiSeoData(title, shortDescription || description, category);
      if (seoData) {
        if (seoData.seoTitle) setSeoTitle(seoData.seoTitle);
        if (seoData.seoDescription) setSeoDescription(seoData.seoDescription);
        if (seoData.slug) setSlug(seoData.slug);
      }
    } catch (e) {
      // fallback
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Save / Publish handler
  const handleSaveProduct = async (saveStatus: 'active' | 'draft' | 'archived') => {
    setErrorMsg('');
    if (!title.trim()) {
      setErrorMsg('Product title is required.');
      return;
    }

    setIsSaving(true);
    const primaryMedia = mediaList.find(m => m.isPrimary) || mediaList[0];
    const productPayload = {
      storeId: store?.id || 'store-1',
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      shortDescription,
      price: numericPrice,
      compareAtPrice: numericComparePrice > 0 ? numericComparePrice : undefined,
      cost: numericCost,
      currency,
      sku: sku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: barcode.trim(),
      trackInventory,
      inventory: parseInt(inventory) || 0,
      lowStockThreshold: parseInt(lowStockThreshold) || 5,
      status: saveStatus,
      category,
      vendor,
      productType,
      collections,
      tags,
      image: primaryMedia ? primaryMedia.url : 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      media: mediaList,
      options: hasVariants ? options : [],
      variants: hasVariants ? variants : [],
      weight: parseFloat(weight) || 0,
      requiresShipping,
      isDigital,
      shippingCategory: 'Standard',
      salesChannels,
      seoTitle: seoTitle.trim() || title.trim(),
      seoDescription: seoDescription.trim() || shortDescription.trim()
    };

    try {
      if (isEditMode && editingProduct) {
        await updateProduct(editingProduct.id, productPayload);
      } else {
        await addProduct(productPayload);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        closeProductEditor();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save product. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // Trigger preview in modal
  const handleOpenStorePreview = () => {
    const primaryMedia = mediaList.find(m => m.isPrimary) || mediaList[0];
    const previewObj: Product = {
      id: editingProduct?.id || 'preview-temp',
      storeId: store?.id || 'store-1',
      title: title || 'Untitled Product',
      slug: slug || 'untitled-product',
      description,
      shortDescription,
      price: numericPrice,
      compareAtPrice: numericComparePrice > 0 ? numericComparePrice : undefined,
      cost: numericCost,
      currency,
      sku: sku || 'SKU-PREVIEW',
      barcode,
      trackInventory,
      inventory: parseInt(inventory) || 0,
      status,
      category,
      vendor,
      productType,
      collections,
      tags,
      image: primaryMedia ? primaryMedia.url : 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      media: mediaList,
      options: hasVariants ? options : [],
      variants: hasVariants ? variants : [],
      weight: parseFloat(weight) || 0,
      requiresShipping,
      isDigital,
      salesChannels,
      seoTitle,
      seoDescription,
      salesCount: editingProduct?.salesCount || 0,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    startPreviewingProduct(previewObj);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-28">
      {/* ========================================================================= */}
      {/* 1. STICKY TOP HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={closeProductEditor}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Return to products catalog"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Products</span>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black text-slate-950 truncate max-w-xs sm:max-w-md">
              {isEditMode ? `Edit Product: ${title || 'Untitled'}` : 'Create Product'}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : status === 'draft'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenStorePreview}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Preview</span>
          </button>

          <button
            onClick={() => handleSaveProduct('draft')}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            Save draft
          </button>

          <button
            onClick={() => handleSaveProduct('active')}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isEditMode ? 'Save changes' : 'Publish product'}</span>
          </button>
        </div>
      </header>

      {/* Error & Feedback Banner */}
      {errorMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs font-bold text-rose-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {aiSuccessMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-xs font-bold text-indigo-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>{aiSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN TWO-COLUMN WORKSPACE */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ===================================================================== */}
          {/* LEFT 2/3 COLUMN: CONTENT & COMMERCE CARDS */}
          {/* ===================================================================== */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Product Creator Banner / Assistant */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-2xl p-5 text-white shadow-md border border-indigo-800/40 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-xs tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>SOL-PUMP AI Product Specialist</span>
                  </div>
                  <h3 className="text-base font-black mt-1 text-white tracking-tight">
                    Generate complete high-converting product spec
                  </h3>
                  <p className="text-xs text-indigo-200/80 mt-0.5 max-w-xl">
                    Describe your product in natural language. AI will generate the title, rich narrative, pricing structure, SEO tags, and inventory setup.
                  </p>
                </div>

                <button
                  onClick={() => setShowAiDrawer(!showAiDrawer)}
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showAiDrawer ? 'Hide AI Assistant' : 'Generate with AI'}</span>
                </button>
              </div>

              {/* Inline AI Prompt Drawer */}
              {showAiDrawer && (
                <div className="mt-4 pt-4 border-t border-indigo-800/50 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder="e.g. Handmade Moroccan leather travel backpack with laptop sleeve..."
                      className="flex-1 bg-indigo-950/80 border border-indigo-700/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-indigo-300/50 focus:outline-none focus:border-indigo-400"
                    />
                    <button
                      onClick={handleRunAiGenerator}
                      disabled={isAiGenerating || !aiPrompt.trim()}
                      className="px-4 py-2 rounded-xl bg-white text-indigo-950 font-black text-xs hover:bg-indigo-50 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {isAiGenerating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Create Product Spec</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-indigo-300">
                    <span className="text-indigo-400/80 font-bold">Quick prompts:</span>
                    {['Minimalist chronograph watch', 'Polarized aviator sunglasses', 'Carbon-plate running shoes'].map(
                      qp => (
                        <button
                          key={qp}
                          onClick={() => setAiPrompt(qp)}
                          className="bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-700/50 px-2 py-0.5 rounded-lg text-indigo-200 transition cursor-pointer text-[10px]"
                        >
                          {qp}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CARD 1: PRODUCT INFORMATION */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Product Information</span>
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="e.g. Handcrafted Leather Travel Backpack"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Short Description <span className="text-slate-400 font-normal">(Summary for search & cards)</span>
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={e => setShortDescription(e.target.value)}
                  placeholder="Handcrafted full-grain leather backpack with dedicated laptop sleeve."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              {/* Rich Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Detailed Description</label>
                  <span className="text-[11px] text-slate-400">HTML Supported</span>
                </div>

                {/* Toolbar */}
                <div className="bg-slate-100 border border-slate-200 rounded-t-xl px-3 py-1.5 flex flex-wrap items-center gap-1 text-slate-600 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setDescription(prev => prev + '<strong>Bold text</strong>')}
                    className="px-2 py-1 hover:bg-white rounded hover:shadow-xs transition"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription(prev => prev + '<em>Italic text</em>')}
                    className="px-2 py-1 hover:bg-white rounded hover:shadow-xs transition italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription(prev => prev + '<h3>Heading 3</h3>')}
                    className="px-2 py-1 hover:bg-white rounded hover:shadow-xs transition"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription(prev => prev + '<ul><li>Bullet item</li></ul>')}
                    className="px-2 py-1 hover:bg-white rounded hover:shadow-xs transition"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription(prev => prev + '<p>Paragraph text</p>')}
                    className="px-2 py-1 hover:bg-white rounded hover:shadow-xs transition"
                  >
                    ¶
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide rich product specs, craftsmanship details, care instructions, and materials..."
                  className="w-full bg-slate-50 border border-t-0 border-slate-200 rounded-b-xl p-3.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Vendor / Brand</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={e => setVendor(e.target.value)}
                    placeholder="e.g. Sol Artisan Goods"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Type</label>
                  <input
                    type="text"
                    value={productType}
                    onChange={e => setProductType(e.target.value)}
                    placeholder="e.g. Travel Accessories"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: PRODUCT MEDIA MANAGER */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>Media Manager</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload images, videos, or 3D models. The primary image is shown in storefront catalogs.
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {(['image', 'video', '3d'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveMediaTab(tab)}
                      className={`px-3 py-1 rounded-lg uppercase text-[10px] tracking-wider transition ${
                        activeMediaTab === tab ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/70 rounded-2xl p-6 text-center transition group">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900">Drag and drop media files here, or browse</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Supports high-res JPG, PNG, WEBP up to 25MB</div>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleAddSampleImage(
                        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700 shadow-xs cursor-pointer"
                  >
                    + Add Leather Bag
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddSampleImage(
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700 shadow-xs cursor-pointer"
                  >
                    + Add Watch
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddSampleImage(
                        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80'
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700 shadow-xs cursor-pointer"
                  >
                    + Add Sunglasses
                  </button>
                </div>
              </div>

              {/* Media Thumbnails Grid */}
              {mediaList.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {mediaList.map((m, idx) => (
                    <div
                      key={m.id}
                      className={`relative group rounded-xl overflow-hidden border-2 transition ${
                        m.isPrimary ? 'border-indigo-600 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={m.url} alt={m.name || 'Product asset'} className="w-full h-28 object-cover" />

                      {m.isPrimary && (
                        <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                          Primary Cover
                        </div>
                      )}

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        {!m.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryMedia(m.id)}
                            className="p-1.5 rounded-lg bg-white text-slate-900 text-[10px] font-bold hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                            title="Set as primary"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(m.id)}
                          className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
                          title="Delete media"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CARD 3: PRICING & MARGINS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                <span>Pricing & Margins</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Price <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Compare-at Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={compareAtPrice}
                      onChange={e => setCompareAtPrice(e.target.value)}
                      placeholder="e.g. 179.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Cost per item</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={cost}
                      onChange={e => setCost(e.target.value)}
                      placeholder="e.g. 45.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Margins Callout */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Profit per unit</span>
                    <span className="font-extrabold text-emerald-600 text-sm">${profit.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Profit margin</span>
                    <span className="font-extrabold text-indigo-600 text-sm">{margin}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chargeTax"
                    checked={chargeTax}
                    onChange={e => setChargeTax(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <label htmlFor="chargeTax" className="text-slate-700 font-semibold text-xs cursor-pointer">
                    Charge tax on this product
                  </label>
                </div>
              </div>
            </div>

            {/* CARD 4: INVENTORY & STOCK */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
                <Boxes className="w-4 h-4 text-indigo-600" />
                <span>Inventory & Locations</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">SKU (Stock Keeping Unit)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sku}
                      onChange={e => setSku(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shadow-xs"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Barcode (ISBN, UPC, GTIN)</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    placeholder="e.g. 880123456789"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="trackQty"
                    checked={trackInventory}
                    onChange={e => setTrackInventory(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <label htmlFor="trackQty" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Track quantity
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="continueSelling"
                    checked={continueSellingOutOfStock}
                    onChange={e => setContinueSellingOutOfStock(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <label htmlFor="continueSelling" className="text-xs font-semibold text-slate-600 cursor-pointer">
                    Continue selling when out of stock
                  </label>
                </div>
              </div>

              {trackInventory && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Total Quantity in Stock</label>
                    <input
                      type="number"
                      value={inventory}
                      onChange={e => setInventory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Low Stock Alert Threshold</label>
                    <input
                      type="number"
                      value={lowStockThreshold}
                      onChange={e => setLowStockThreshold(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Multi-Location Breakdown */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Location Inventory Breakdown
                </div>
                <div className="divide-y divide-slate-200/60">
                  {locationsStock.map(loc => (
                    <div key={loc.id} className="py-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{loc.name}</span>
                      <span className="font-bold font-mono text-slate-900">{loc.qty} available</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 5: VARIANTS & OPTIONS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <span>Variants & Options</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Configure sizes, colors, materials, and individual SKU pricing.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasVariantsToggle"
                    checked={hasVariants}
                    onChange={e => setHasVariants(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <label htmlFor="hasVariantsToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Enable variants
                  </label>
                </div>
              </div>

              {hasVariants && (
                <div className="space-y-4 pt-2">
                  {/* Options List */}
                  <div className="space-y-3">
                    {options.map(opt => (
                      <div key={opt.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-900">{opt.name}</span>
                          <button
                            type="button"
                            onClick={() => setOptions(options.filter(o => o.id !== opt.id))}
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Values chips */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {opt.values.map(val => (
                            <span
                              key={val}
                              className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs"
                            >
                              {val}
                              <button
                                type="button"
                                onClick={() => handleRemoveOptionValue(opt.id, val)}
                                className="text-slate-400 hover:text-rose-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}

                          {/* Add Value Input */}
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              placeholder={`+ Add ${opt.name} value...`}
                              value={selectedOptionIdForValue === opt.id ? newOptionValue : ''}
                              onFocus={() => setSelectedOptionIdForValue(opt.id)}
                              onChange={e => setNewOptionValue(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddOptionValue(opt.id);
                                }
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 w-36"
                            />
                            {selectedOptionIdForValue === opt.id && newOptionValue && (
                              <button
                                type="button"
                                onClick={() => handleAddOptionValue(opt.id)}
                                className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add New Option Header */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newOptionName}
                        onChange={e => setNewOptionName(e.target.value)}
                        placeholder="Option name (e.g. Size, Color, Material)"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                      >
                        + Add option
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateVariantMatrix}
                      className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                      Generate variant combination matrix ({variants.length} active)
                    </button>
                  </div>

                  {/* Variants Table */}
                  {variants.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Variant</th>
                            <th className="p-3">Price ($)</th>
                            <th className="p-3">SKU</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {variants.map((v, idx) => (
                            <tr key={v.id} className="hover:bg-slate-50/70">
                              <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                  {v.image ? (
                                    <img src={v.image} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                      #
                                    </div>
                                  )}
                                </div>
                                <span>{v.title}</span>
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  value={v.price}
                                  onChange={e => {
                                    const val = parseFloat(e.target.value) || 0;
                                    setVariants(variants.map(item => (item.id === v.id ? { ...item, price: val } : item)));
                                  }}
                                  className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={v.sku}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setVariants(variants.map(item => (item.id === v.id ? { ...item, sku: val } : item)));
                                  }}
                                  className="w-28 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  value={v.inventory}
                                  onChange={e => {
                                    const val = parseInt(e.target.value) || 0;
                                    setVariants(
                                      variants.map(item => (item.id === v.id ? { ...item, inventory: val } : item))
                                    );
                                  }}
                                  className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                                />
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setVariants(variants.filter(item => item.id !== v.id))}
                                  className="text-rose-500 hover:text-rose-700 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CARD 6: SHIPPING & DIMENSIONS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Shipping & Delivery</span>
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="physicalProductToggle"
                  checked={requiresShipping}
                  onChange={e => setRequiresShipping(e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                <label htmlFor="physicalProductToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                  This is a physical product (requires shipping & package fulfillment)
                </label>
              </div>

              {requiresShipping && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Length (cm)</label>
                    <input
                      type="number"
                      value={length}
                      onChange={e => setLength(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Width (cm)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={e => setWidth(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* CARD 7: SEARCH ENGINE OPTIMIZATION (SEO) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <span>Search Engine Optimization (SEO)</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Preview and customize how this product appears on Google and social search results.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRunAiSeo}
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Optimize SEO</span>
                </button>
              </div>

              {/* SERP Live Preview Box */}
              <div className="border border-slate-200 bg-slate-50/80 rounded-xl p-4 space-y-1">
                <div className="text-[11px] font-mono text-emerald-700 truncate">
                  https://sol-pump.store/products/{slug || 'product-slug'}
                </div>
                <div className="text-sm font-bold text-indigo-700 hover:underline cursor-pointer truncate">
                  {seoTitle || title || 'Product Title'}
                </div>
                <div className="text-xs text-slate-600 line-clamp-2">
                  {seoDescription || shortDescription || 'Detailed product overview and high-quality specifications available on sol-pump.store.'}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">SEO Page Title</label>
                  <span className="text-[10px] text-slate-400">{seoTitle.length} / 70 characters</span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Meta Description</label>
                  <span className="text-[10px] text-slate-400">{seoDescription.length} / 160 characters</span>
                </div>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={e => setSeoDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">URL Handle / Slug</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">/products/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-24 pr-3 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT 1/3 COLUMN: PUBLISH & ORGANIZATION PANEL */}
          {/* ===================================================================== */}
          <div className="space-y-6">
            {/* PANEL CARD 1: STATUS & PUBLISHING */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Publishing Status
              </h3>

              <div className="space-y-2">
                {[
                  { key: 'active', label: 'Active', desc: 'Product is live and purchasable in store' },
                  { key: 'draft', label: 'Draft', desc: 'Product is hidden from customer storefront' },
                  { key: 'archived', label: 'Archived', desc: 'Product is discontinued and retired' }
                ].map(st => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setStatus(st.key as any)}
                    className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                      status === st.key
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                        status === st.key ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                      }`}
                    >
                      {status === st.key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{st.label}</div>
                      <div className="text-[11px] text-slate-500">{st.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PANEL CARD 2: SALES CHANNELS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Sales Channels & Apps
              </h3>

              <div className="space-y-2 text-xs font-semibold">
                {[
                  { name: 'Online Store', desc: 'sol-pump.store' },
                  { name: 'Social Commerce', desc: 'Instagram & Facebook Shop' },
                  { name: 'TikTok Shop', desc: 'Sync catalog to TikTok' },
                  { name: 'Point of Sale (POS)', desc: 'Retail hardware registers' }
                ].map(ch => {
                  const isChecked = salesChannels.includes(ch.name);
                  return (
                    <label
                      key={ch.name}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSalesChannels(salesChannels.filter(c => c !== ch.name));
                          } else {
                            setSalesChannels([...salesChannels, ch.name]);
                          }
                        }}
                        className="rounded accent-indigo-600 mt-0.5"
                      />
                      <div>
                        <div className="text-slate-900 font-bold">{ch.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{ch.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* PANEL CARD 3: ORGANIZATION & CATEGORIES */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Product Organization
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Bags & Leather">Bags & Leather</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Eyewear">Eyewear</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Timepieces">Timepieces</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              {/* Collections */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Collections</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {collections.map(c => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-lg text-xs font-bold"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => handleRemoveCollection(c)}
                        className="text-indigo-400 hover:text-indigo-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newCollectionInput}
                    onChange={e => setNewCollectionInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCollection();
                      }
                    }}
                    placeholder="Add to collection..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCollection}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tags (Press Enter to add)</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map(t => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg text-xs font-semibold"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="e.g. Handmade, Waterproof, Summer..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* PANEL CARD 4: CATALOG HEALTH CHECKLIST */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Catalog Readiness
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${title ? 'text-emerald-500' : 'text-slate-300'}`} />
                    Product Title
                  </span>
                  <span className="text-[11px] font-bold">{title ? 'Complete' : 'Pending'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${mediaList.length > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                    Media Cover
                  </span>
                  <span className="text-[11px] font-bold">{mediaList.length} assets</span>
                </div>

                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${numericPrice > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                    Pricing & Margin
                  </span>
                  <span className="text-[11px] font-bold font-mono">{margin}% margin</span>
                </div>

                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${parseInt(inventory) > 0 ? 'text-emerald-500' : 'text-amber-500'}`} />
                    Inventory Level
                  </span>
                  <span className="text-[11px] font-bold font-mono">{inventory} in stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. MOBILE STICKY BOTTOM ACTION BAR */}
      {/* ========================================================================= */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 flex items-center justify-between gap-2">
        <button
          onClick={handleOpenStorePreview}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700"
        >
          Preview
        </button>
        <button
          onClick={() => handleSaveProduct('active')}
          disabled={isSaving}
          className="flex-1 py-2.5 rounded-xl bg-indigo-600 font-black text-xs text-white shadow-md shadow-indigo-600/30"
        >
          {isSaving ? 'Saving...' : 'Publish'}
        </button>
      </div>
    </div>
  );
};
