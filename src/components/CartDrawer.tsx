import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  Tag,
  Check,
  MapPin,
  Clock,
  Printer,
  Monitor,
  ShieldCheck,
  QrCode,
  CreditCard,
  Banknote,
  ArrowRight,
  Copy,
  Receipt
} from 'lucide-react';
import { CartItem, FulfillmentType, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderCreated: (order: Order) => void;
  storeName: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
  storeName,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash-on-pickup' | 'upi-qr' | 'card'>('cash-on-pickup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'PRINTGROCERY') {
      setDiscountAmount(1.50);
      setAppliedPromo('PRINTGROCERY ($1.50 OFF)');
    } else if (code === 'STUDENT15') {
      const discount = subtotal * 0.15;
      setDiscountAmount(discount);
      setAppliedPromo('STUDENT15 (15% OFF)');
    } else if (code === 'EXPRESSPICKUP') {
      setDiscountAmount(2.50);
      setAppliedPromo('EXPRESSPICKUP ($2.50 OFF)');
    } else {
      alert('Invalid promo code. Try PRINTGROCERY, STUDENT15, or EXPRESSPICKUP');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please provide your name and phone number for pickup token notification.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          subtotal,
          deliveryFee: 0,
          discount: discountAmount,
          total,
          fulfillmentType: 'store-pickup',
          customerName,
          customerPhone,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCreatedOrder(data.order);
        onOrderCreated(data.order);
        onClearCart();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard?.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F172A] border-l border-slate-800 text-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#1E293B] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold tracking-tight">Your Order Basket</h2>
              <span className="text-xs text-slate-400 font-mono">({cartItems.length} items)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {createdOrder ? (
              /* ORDER SUCCESS TOKEN RECEIPT */
              <div className="bg-[#1E293B] border border-emerald-500/40 rounded-2xl p-6 text-center shadow-xl space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Check className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">
                    Order Placed Successfully
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">Pickup Token Number</h3>
                </div>

                {/* Token Box */}
                <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Show Token at Counter</div>
                    <div className="text-2xl font-mono font-black text-amber-300 tracking-wider">
                      {createdOrder.tokenNumber}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyToken(createdOrder.tokenNumber)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-500/30 flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="text-left text-xs space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-400">
                    <span>Customer:</span>
                    <span className="text-white font-medium">{createdOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Fulfillment:</span>
                    <span className="text-emerald-400 font-bold capitalize">{createdOrder.fulfillmentType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Total Amount:</span>
                    <span className="text-cyan-400 font-mono font-bold">${createdOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Payment Method:</span>
                    <span className="text-slate-200 capitalize">{createdOrder.paymentMethod.replace('-', ' ')}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => window.print()}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <Receipt className="w-4 h-4 text-cyan-400" />
                    <span>Print Token Receipt</span>
                  </button>
                  <button
                    onClick={() => {
                      setCreatedOrder(null);
                      onClose();
                    }}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider"
                  >
                    Done & Return to Store
                  </button>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">Your basket is currently empty</p>
                <p className="text-xs text-slate-500 mt-1">
                  Add groceries, document printing jobs, or PC slots to get started.
                </p>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                    Selected Items
                  </h3>

                  {cartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-3 flex items-center gap-3"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg bg-slate-900"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          {item.itemType === 'print-job' ? (
                            <Printer className="w-6 h-6" />
                          ) : (
                            <Monitor className="w-6 h-6" />
                          )}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{item.unitOrSummary}</p>
                        <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-1.5 bg-slate-900 rounded-lg p-1 border border-slate-800">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Fulfillment Selection */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    Fulfillment Method
                  </label>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-300">Direct In-Store Counter Pickup</div>
                      <div className="text-[10px] text-slate-300">FREE • Fast 10-Minute Instant Order Token Pickup</div>
                    </div>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (e.g. STUDENT15)"
                      className="flex-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700 uppercase focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-semibold border border-slate-700"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Applied {appliedPromo}
                    </div>
                  )}
                </div>

                {/* Customer Checkout Form */}
                <form onSubmit={handleCheckout} className="pt-3 border-t border-slate-800 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                    Customer Details
                  </h3>

                  <div>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Full Name *"
                      className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone / Mobile Number *"
                      className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase mb-1.5 block">
                      Payment Mode
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash-on-pickup')}
                        className={`p-2 rounded-lg border flex flex-col items-center gap-1 ${
                          paymentMethod === 'cash-on-pickup'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <Banknote className="w-4 h-4" />
                        <span>Cash/COD</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi-qr')}
                        className={`p-2 rounded-lg border flex flex-col items-center gap-1 ${
                          paymentMethod === 'upi-qr'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>UPI QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2 rounded-lg border flex flex-col items-center gap-1 ${
                          paymentMethod === 'card'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Card</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Items Subtotal:</span>
                      <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount:</span>
                        <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                      <span className="text-white">Total Payable:</span>
                      <span className="font-mono text-cyan-400">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
                  >
                    <span>Confirm Order & Generate Pickup Token</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
