import React, { useState } from 'react';
import { Product } from '../../types/commerce';
import { useCommerce } from '../../context/CommerceContext';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  Layers,
  Sparkles,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

interface ProductPreviewModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({ product, onClose }) => {
  const { store } = useCommerce();
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );

  const activeVariant = product.variants?.find(v => v.id === selectedVariantId);
  const currentPrice = activeVariant?.price || product.price;
  const currentCompareAt = activeVariant?.compareAtPrice || product.compareAtPrice;

  const handleAddToCart = () => {
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Store Header Bar */}
        <div className="bg-slate-900 px-6 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-xs font-black tracking-wider uppercase text-indigo-300">
                Storefront Live Preview
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                https://sol-pump.store/products/{product.slug}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Store Banner */}
        <div className="bg-indigo-600 px-4 py-1.5 text-center text-white text-[11px] font-extrabold tracking-wide uppercase">
          {store?.theme.bannerText || '✨ FREE EXPRESS WORLDWIDE SHIPPING ON ORDERS OVER $99'}
        </div>

        {/* Product Details Layout */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            {/* Thumbnail Strip */}
            {product.media && product.media.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {product.media.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedImage(m.url)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                      selectedImage === m.url ? 'border-indigo-600 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Truck className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                <div className="font-bold text-slate-800">Fast Shipping</div>
                <div className="text-[10px] text-slate-400">2-4 Business Days</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <RotateCcw className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                <div className="font-bold text-slate-800">30-Day Returns</div>
                <div className="text-[10px] text-slate-400">Hassle-free guarantee</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                <div className="font-bold text-slate-800">SOL Warranty</div>
                <div className="text-[10px] text-slate-400">1-Year merchant care</div>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Checkout Box */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Vendor & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                  {product.vendor || 'SOL ARTISAN GOODS'}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 (128 reviews)</span>
                </div>
              </div>

              {/* Title & Short Description */}
              <div>
                <h1 className="text-2xl font-black text-slate-950 tracking-tight leading-tight">
                  {product.title}
                </h1>
                {product.shortDescription && (
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{product.shortDescription}</p>
                )}
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 py-1">
                <span className="text-3xl font-black text-slate-950 tracking-tight">
                  ${currentPrice.toFixed(2)}
                </span>
                {currentCompareAt && currentCompareAt > currentPrice && (
                  <>
                    <span className="text-base text-slate-400 line-through font-bold">
                      ${currentCompareAt.toFixed(2)}
                    </span>
                    <span className="bg-rose-50 text-rose-700 font-extrabold text-xs px-2 py-0.5 rounded-md border border-rose-200">
                      Save ${(currentCompareAt - currentPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block">Select Variant / Color</label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                          selectedVariantId === v.id
                            ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>{v.title}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">${v.price.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-mono font-bold text-xs text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    ✓ In stock and ready to ship
                  </span>
                </div>
              </div>

              {/* Description Tabs */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900 mb-1.5">Product Narrative & Specs</div>
                <div
                  className="text-xs text-slate-600 leading-relaxed space-y-2 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Instant Card Checkout</span>
                </button>
              </div>

              {addedToast && (
                <div className="bg-emerald-600 text-white text-xs font-bold text-center py-2 rounded-xl animate-in fade-in">
                  ✓ Item added to bag in test preview mode!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {checkoutOpen && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          product={product}
          selectedVariant={activeVariant}
          quantity={quantity}
        />
      )}
    </div>
  );
};
