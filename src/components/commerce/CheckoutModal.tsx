import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../../types/commerce';
import { useCommerce } from '../../context/CommerceContext';
import {
  X,
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Loader2,
  Tag,
  ShoppingBag,
  ExternalLink,
  ChevronRight
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
  const { createCheckoutPaymentIntent, verifyCheckoutPayment, paymentConfig, discounts } = useCommerce();

  // Form State
  const [email, setEmail] = useState('customer@example.com');
  const [firstName, setFirstName] = useState('Elena');
  const [lastName, setLastName] = useState('Rostova');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Springfield');
  const [state, setState] = useState('OR');
  const [postalCode, setPostalCode] = useState('97477');
  const [country, setCountry] = useState('US');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<string | null>(null);

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState('Elena Rostova');

  // Checkout flow state
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [orderSummary, setOrderSummary] = useState<any>(null);
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

  // Step 1: Proceed to Payment - calls backend to calculate totals server-side
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await createCheckoutPaymentIntent({
        items: [
          {
            productId: product.id,
            variantId: selectedVariant?.id,
            quantity
          }
        ],
        customerEmail: email,
        customerName: `${firstName} ${lastName}`.trim(),
        shippingAddress: {
          address,
          city,
          state,
          postalCode,
          country
        },
        discountCode: discountApplied || discountCode || undefined
      });

      if (!res.success) {
        setError(res.error || res.message || 'Failed to initialize payment');
        setLoading(false);
        return;
      }

      setOrderSummary(res);
      setPaymentIntentId(res.paymentIntentId || null);
      setStep('payment');
    } catch (err: any) {
      setError(err.message || 'Network error during checkout initialization');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm Card Payment
  const handleConfirmCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // If Stripe client secret exists and Stripe.js is loaded, we can verify with backend
      const intentId = paymentIntentId || orderSummary?.paymentIntentId || 'pi_mock_' + Date.now();
      const orderId = orderSummary?.orderId || 'ord-' + Date.now();

      const verifyRes = await verifyCheckoutPayment(intentId, orderId);

      if (!verifyRes.success || !verifyRes.paid) {
        setError('Card authorization failed. Please check your card information.');
        setLoading(false);
        return;
      }

      setCompletedOrder(
        verifyRes.order || {
          orderNumber: orderSummary?.orderNumber || '#1029',
          total: orderSummary?.amount || rawSubtotal,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          createdAt: new Date().toISOString()
        }
      );
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to process card payment');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f1422] border border-slate-800 shadow-2xl shadow-indigo-500/10 overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Logo size="sm" light={true} />
            <span className="text-xs font-mono text-slate-400">|</span>
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              Secure 256-Bit SSL Checkout
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
              <div className="text-[11px] text-emerald-400 font-medium">Free Express Shipping</div>
            </div>
          </div>

          {/* STEP 1: CUSTOMER & SHIPPING DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <span>1. Customer & Delivery Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="name@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
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

              {/* Discount Code Input */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Coupon / Promo Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white text-xs uppercase font-mono focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. SUMMER25, WELCOME10"
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
                  <div className="mt-1 text-[11px] text-emerald-400 font-bold">
                    ✓ Promo code {discountApplied} applied!
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: CARD PAYMENT */}
          {step === 'payment' && (
            <form onSubmit={handleConfirmCardPayment} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black uppercase tracking-wider text-indigo-400">
                  2. Card Payment & Authorization
                </div>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer underline"
                >
                  Edit details
                </button>
              </div>

              {/* Server-verified breakdown */}
              {orderSummary && (
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  {orderSummary.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>-${orderSummary.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span>{orderSummary.shipping === 0 ? 'FREE' : `$${orderSummary.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 flex justify-between font-black text-white text-sm">
                    <span>Total Amount Charged</span>
                    <span>${orderSummary.amount.toFixed(2)} USD</span>
                  </div>
                </div>
              )}

              {/* Card Form */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-300">Credit / Debit Card</span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-mono">Visa, Mastercard, Amex</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="12/28"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Name on Card</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Elena Rostova"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Pay ${(orderSummary?.amount || rawSubtotal).toFixed(2)}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: PAYMENT SUCCESS & ORDER RECEIPT */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Payment Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Order {completedOrder?.orderNumber || '#1029'} has been placed successfully on sol-pump.store.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="text-white font-bold">{completedOrder?.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email Receipt:</span>
                  <span className="text-white font-bold">{completedOrder?.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Paid:</span>
                  <span className="text-emerald-400 font-bold">${Number(completedOrder?.total || 0).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold">PAID • PROCESSING</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
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
