import React, { useState } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Order } from '../../types/ecommerce';
import { formatRupees } from '../../utils/currency';

interface OrderLookupFormProps {
  orders: Order[];
  primaryColor?: string;
  className?: string;
  initialOrderId?: string;
}

export const OrderLookupForm: React.FC<OrderLookupFormProps> = ({
  orders,
  primaryColor = '#4f46e5',
  className = '',
  initialOrderId = '',
}) => {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [searchedOrderId, setSearchedOrderId] = useState(initialOrderId);
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderId));

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderIdInput.trim();
    if (!cleanId) return;
    setSearchedOrderId(cleanId);
    setHasSearched(true);
  };

  // Find order by ID in the orders array (case-insensitive)
  const matchedOrder = orders.find(
    (order) => order.id.toLowerCase().trim() === searchedOrderId.toLowerCase().trim()
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'PENDING':
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  // Compute status step index
  const getStepProgress = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      case 'CANCELLED':
        return 0;
      default:
        return 1;
    }
  };

  const currentStep = matchedOrder ? getStepProgress(matchedOrder.status) : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. LOOKUP FORM */}
      <form onSubmit={handleLookup} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Package className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => {
                setOrderIdInput(e.target.value);
                setHasSearched(false);
              }}
              placeholder="Enter Order ID (e.g. ORD-9821 or ORD-9822)"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 hover:opacity-95"
            style={{ backgroundColor: primaryColor }}
          >
            <Search className="w-4 h-4" />
            <span>Check Status</span>
          </button>
        </div>

        {/* Quick Demo Order Chips */}
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span>Try sample orders:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setOrderIdInput(o.id);
                setSearchedOrderId(o.id);
                setHasSearched(true);
              }}
              className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition-colors"
            >
              {o.id}
            </button>
          ))}
        </div>
      </form>

      {/* 2. ORDER STATUS DISPLAY */}
      {hasSearched && (
        <div className="animate-in fade-in duration-200">
          {matchedOrder ? (
            <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
                      {matchedOrder.id}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(
                        matchedOrder.status
                      )}`}
                    >
                      {matchedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Placed on {new Date(matchedOrder.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="sm:text-right">
                  <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {formatRupees(matchedOrder.total)}
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Payment: <strong className="text-slate-600 dark:text-slate-300">{matchedOrder.paymentMethod}</strong>
                  </p>
                </div>
              </div>

              {/* Progress Stepper (if not cancelled) */}
              {matchedOrder.status !== 'CANCELLED' ? (
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold relative">
                    <div className="space-y-1.5">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                          currentStep >= 1 ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        ✓
                      </div>
                      <span className={currentStep >= 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                        Order Placed
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                          currentStep >= 2 ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {currentStep >= 2 ? '✓' : '2'}
                      </div>
                      <span className={currentStep >= 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                        Processing
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                          currentStep >= 3 ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {currentStep >= 3 ? '🚚' : '3'}
                      </div>
                      <div className="flex flex-col items-center">
                        <span className={currentStep >= 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                          In Transit
                        </span>
                        {currentStep >= 3 && matchedOrder.trackingNumber && (
                          <span className="text-[9px] font-mono text-indigo-500 mt-0.5">
                            {matchedOrder.trackingNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                          currentStep >= 4 ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {currentStep >= 4 ? '✓' : '📍'}
                      </div>
                      <span className={currentStep >= 4 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>This order has been cancelled and refunded to original payment source.</span>
                </div>
              )}

              {/* Delivery Details & Courier Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
                    <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Shipping Address</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {matchedOrder.customer.fullName}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {matchedOrder.customer.street}, {matchedOrder.customer.city},{' '}
                    {matchedOrder.customer.state} - {matchedOrder.customer.zipCode}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Phone: {matchedOrder.customer.phone}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Truck className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Carrier &amp; AWB Tracking</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Courier: India Post - SpeedPost
                  </p>
                  <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    AWB: {matchedOrder.trackingNumber || 'SP-7890123IN'}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Estimated Delivery: 2-3 Business Days</span>
                  </p>
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Ordered Items ({matchedOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {matchedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                            <span>Qty: {item.quantity}</span>
                            {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                            <span>• {item.brand}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {formatRupees(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Not Found Alert */
            <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-rose-700 dark:text-rose-300">
                  No Order Found for &quot;{searchedOrderId}&quot;
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Please check the Order ID on your SMS/Email receipt. Sample valid IDs in this catalog include{' '}
                  <strong className="font-mono text-slate-800 dark:text-slate-200">ORD-9821</strong> or{' '}
                  <strong className="font-mono text-slate-800 dark:text-slate-200">ORD-9822</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
