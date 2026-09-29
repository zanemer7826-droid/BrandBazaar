import React from 'react';
import {
  CheckCircle2,
  X,
  FileText,
  ShoppingBag,
  Truck,
  Mail,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Order } from '../../types/ecommerce';
import { formatRupees } from '../../utils/currency';
import { downloadOrderInvoice } from '../../utils/invoiceGenerator';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  primaryColor: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  order,
  primaryColor,
}) => {
  if (!isOpen || !order) return null;

  const isPaid = order.paymentStatus === 'PAID';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 text-center space-y-3 bg-gradient-to-b from-emerald-500/10 via-slate-50/50 to-transparent dark:from-emerald-950/30 dark:via-slate-900/50 border-b border-slate-100 dark:border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 mr-1" />
              <span>Payment Verified &amp; Confirmed</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Order #{order.id} Placed Successfully!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Thank you for shopping with Brand Bazaar. Your order has been dispatched for processing.
            </p>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs">
          {/* Email Confirmation Alert Badge */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center space-x-3 text-indigo-900 dark:text-indigo-200">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs truncate">
                Confirmation Email Sent
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Order receipt dispatched to <strong>{order.customer.email}</strong>
              </p>
            </div>
          </div>

          {/* Payment & Financial Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60 text-slate-500">
              <span className="font-sans font-bold text-slate-700 dark:text-slate-300">Payment Status</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-sans font-black text-[10px] ${
                  isPaid
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                }`}
              >
                {isPaid ? '✓ PAID IN FULL' : 'PENDING (PAY ON DELIVERY)'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Method Used:</span>
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                {order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm font-black pt-1">
              <span className="text-slate-700 dark:text-slate-300 font-sans">Total Amount Paid:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-sans text-base">
                {formatRupees(order.total)}
              </span>
            </div>
          </div>

          {/* Purchased Items Overview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                Items Ordered ({order.items.length})
              </span>
              <span className="text-[10px] font-mono">Tracking: {order.trackingNumber}</span>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                      <span>Qty: {item.quantity}</span>
                      {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-xs text-slate-900 dark:text-white shrink-0">
                    {formatRupees(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Shipping Details */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white text-xs">
              <Truck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Shipping Destination</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              <strong>{order.customer.fullName}</strong> • {order.customer.street}, {order.customer.city},{' '}
              {order.customer.state} - {order.customer.zipCode}
            </p>
            <p className="text-[10px] text-slate-400 pt-0.5">
              Estimated Delivery: <strong>{order.estimatedDelivery || '2-4 Business Days'}</strong>
            </p>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => downloadOrderInvoice(order)}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Download Invoice PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-md text-xs flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02] active:scale-95"
            style={{ backgroundColor: primaryColor || '#4f46e5' }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
