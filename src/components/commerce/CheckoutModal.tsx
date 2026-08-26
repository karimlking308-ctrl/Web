import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../../types/commerce';
import { useCommerce } from '../../context/CommerceContext';
import {
  X,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Loader2,
  Tag,
  Phone,
  MapPin,
  User as UserIcon,
  Mail,
  Banknote
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedVariant?: ProductVariant | null;
  quantity?: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedVariant,
  quantity = 1
}) => {
  const { discounts } = useCommerce();

  // Form State
  const [email, setEmail] = useState('customer@example.com');
  const [firstName, setFirstName] = useState('Elena');
  const [lastName, setLastName] = useState('Rostova');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Springfield');
  const [state, setState] = useState('OR');
  const [postalCode, setPostalCode] = useState('97477');
  const [country, setCountry] = useState('United States');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Checkout flow state
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setError(null);
      setCompletedOrder(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const itemPrice = selectedVariant?.price || product.price;
  const rawSubtotal = itemPrice * quantity;

  // Calculate discount
  let discountAmount = 0;
  if (discountApplied) {
    const percent = discountApplied === 'WELCOME10' ? 10 : 25;
    discountAmount = (rawSubtotal * percent) / 100;
  }
  const shipping = rawSubtotal >= 100 ? 0 : 10.00;
  const total = Math.max(1, rawSubtotal - discountAmount + shipping);

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    const found = discounts.find(d => d.code.toUpperCase() === discountCode.trim().toUpperCase());
    if (found) {
      setDiscountApplied(found.code);
      setError(null);
    } else {
      setError(`Discount code "${discountCode}" is invalid or expired.`);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!phone || phone.trim().length < 7) {
      setError('A valid phone number is required for Cash on Delivery verification.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/checkout/place-cod-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Store-Id': product.storeId || 'store-1'
        },
        body: JSON.stringify({
          items: [
            {
              productId: product.id,
              variantId: selectedVariant?.id,
              quantity,
              variantTitle: selectedVariant?.title
            }
          ],
          customerEmail: email,
          customerName: `${firstName} ${lastName}`.trim(),
          customerPhone: phone,
          shippingAddress: {
            street: address,
            city,
            state,
            zip: postalCode,
            country
          },
          discountCode: discountApplied || discountCode || undefined,
          notes
        })
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'Failed to place Cash on Delivery order');
        setLoading(false);
        return;
      }

      setCompletedOrder({
        orderNumber: json.orderNumber || '#1045',
        total: json.amount || total,
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: `${address}, ${city}, ${state} ${postalCode}`,
        createdAt: new Date().toISOString()
      });
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Network error while placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f1422] border border-slate-800 shadow-2xl shadow-indigo-500/10 overflow-hidden text-left flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Logo size="sm" light={true} />
            <span className="text-xs font-mono text-slate-400">|</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              Cash on Delivery (COD) Secure Checkout
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Summary Row */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
              />
              <div className="truncate">
                <div className="text-sm font-bold text-white truncate">{product.title}</div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  {selectedVariant && <span>Variant: {selectedVariant.title}</span>}
                  <span>Qty: {quantity}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-base font-black text-white">${(itemPrice * quantity).toFixed(2)}</div>
              <div className="text-[11px] text-emerald-400 font-medium">Pay on Delivery</div>
            </div>
          </div>

          {step === 'details' ? (
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Customer Info */}
              <div className="space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>1. Contact & Verification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone Number (Required for COD)</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="Elena"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="Rostova"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>2. Delivery Address</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="742 Evergreen Terrace"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="Springfield"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">State / Prov</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="OR"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="97477"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-700/60 text-emerald-400 flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Cash on Delivery (COD)</div>
                  <div className="text-[11px] text-emerald-300">Inspect your package and pay cash directly to the courier upon arrival. No advance online payment required.</div>
                </div>
              </div>

              {/* Promo Code & Totals */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white text-xs uppercase font-mono focus:outline-none focus:border-indigo-500"
                      placeholder="Promo Code (e.g. WELCOME10)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {discountApplied && (
                  <div className="text-[11px] text-emerald-400 font-bold">
                    ✓ Promo code {discountApplied} applied!
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>${rawSubtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 flex justify-between font-black text-white text-sm">
                    <span>Total Due on Delivery</span>
                    <span>${total.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    <span>Place Cash on Delivery Order • ${total.toFixed(2)}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Order Placed Successfully!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Order <span className="text-white font-mono font-bold">{completedOrder?.orderNumber}</span> has been confirmed. Our delivery courier will call <span className="text-white font-mono">{completedOrder?.customerPhone}</span> before dispatch.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="text-white font-bold">{completedOrder?.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Address:</span>
                  <span className="text-white font-bold">{completedOrder?.shippingAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Mode:</span>
                  <span className="text-emerald-400 font-bold">Cash on Delivery (COD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Cash Due:</span>
                  <span className="text-emerald-400 font-bold">${Number(completedOrder?.total || 0).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-amber-400 font-bold">PENDING MERCHANT CONFIRMATION</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
