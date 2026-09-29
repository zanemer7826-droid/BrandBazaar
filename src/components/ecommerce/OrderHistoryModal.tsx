import React, { useState, useRef } from 'react';
import {
  X,
  Package,
  Calendar,
  Download,
  Printer,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Search,
  FileText,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Video,
  UploadCloud,
  FileCheck,
  RotateCcw,
  ArrowLeft,
  Mail,
  Phone,
  Receipt,
  ShieldCheck,
  Tag,
  User,
  BadgeCheck,
} from 'lucide-react';
import { Order, UserProfile, StoreBrandingSettings } from '../../types/ecommerce';
import { formatRupees } from '../../utils/currency';
import { downloadOrderInvoice, openInvoicePrintWindow } from '../../utils/invoiceGenerator';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currentUser: UserProfile | null;
  branding: StoreBrandingSettings;
  onOpenOrderTrack?: (orderId: string) => void;
  onStartShopping?: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentUser,
  branding,
  onOpenOrderTrack,
  onStartShopping,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExchangeFlowOpen, setIsExchangeFlowOpen] = useState(false);
  const [exchangeStep, setExchangeStep] = useState<'intro' | 'upload' | 'success'>('intro');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Filter orders by current user (if logged in, prioritize user orders, fallback to all orders for demo convenience)
  const userOrders = orders.filter((o) => {
    if (!currentUser) return true;
    const matchesUser =
      (currentUser.email && o.customer.email.toLowerCase() === currentUser.email.toLowerCase()) ||
      (currentUser.phone && o.customer.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')) ||
      o.customer.fullName.toLowerCase().includes(currentUser.name.toLowerCase());
    return matchesUser || orders.length <= 4; // Show orders for preview if list is small
  });

  const filteredOrders = userOrders.filter((order) => {
    const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;
    
    if (!searchQuery.trim()) {
      return matchesStatus;
    }

    const q = searchQuery.toLowerCase().trim();

    // 1. Order ID match
    const matchesId = order.id.toLowerCase().includes(q);

    // 2. Line Item Name & Brand match
    const matchesItem = order.items.some(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.brand && i.brand.toLowerCase().includes(q))
    );

    // 3. Customer Name match
    const matchesCustomer = order.customer.fullName.toLowerCase().includes(q);

    // 4. Date matching (various formatted representations)
    const orderDate = new Date(order.createdAt);
    const dateFormattedINShort = orderDate
      .toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      .toLowerCase();
    const dateFormattedINLong = orderDate
      .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      .toLowerCase();
    const dateFormattedUSShort = orderDate
      .toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      .toLowerCase();
    const dateFormattedUSLong = orderDate
      .toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
      .toLowerCase();
    const monthLong = orderDate.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const monthShort = orderDate.toLocaleString('en-US', { month: 'short' }).toLowerCase();
    const yearStr = orderDate.getFullYear().toString();
    const dayStr = orderDate.getDate().toString();
    const isoStr = order.createdAt.toLowerCase();
    const slashDate = `${orderDate.getDate()}/${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
    const dashDate = `${orderDate.getDate()}-${orderDate.getMonth() + 1}-${orderDate.getFullYear()}`;

    const matchesDate =
      dateFormattedINShort.includes(q) ||
      dateFormattedINLong.includes(q) ||
      dateFormattedUSShort.includes(q) ||
      dateFormattedUSLong.includes(q) ||
      monthLong.includes(q) ||
      monthShort.includes(q) ||
      yearStr.includes(q) ||
      dayStr === q ||
      isoStr.includes(q) ||
      slashDate.includes(q) ||
      dashDate.includes(q);

    return matchesStatus && (matchesId || matchesItem || matchesCustomer || matchesDate);
  });

  const handleCopyOrderId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getReturnRemainingInfo = (order: Order) => {
    if (order.status !== 'DELIVERED') return null;
    
    // Strict 24-hour exchange/return policy as per Narayan Enterprise (https://narayanenterprise.in/return-refund-policy)
    const createdDate = new Date(order.createdAt);
    // In a real app, this would be from 'deliveredAt'. For demo, we use createdAt + mock offset or just createdAt.
    const returnDeadline = new Date(createdDate.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    
    const diffMs = returnDeadline.getTime() - now.getTime();
    if (diffMs <= 0) return null;
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      label: diffHours > 0 ? `${diffHours}h ${diffMins}m` : `${diffMins}m`
    };
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'PENDING':
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md font-bold"
              style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  Order History &amp; Invoices
                </h3>
                {currentUser && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                    {currentUser.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Track your past purchases, verify delivery status, and download tax invoices.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 shrink-0">
          <div className="relative w-full md:w-96 group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowMobileDetail(false);
              }}
              placeholder="Search by order ID, item name, or date (e.g. Sep 28)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowMobileDetail(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
            {['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setSelectedStatus(st);
                  setShowMobileDetail(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Orders' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: Two Column (List + Selected Order Detail) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Active Search & Filter Feedback Banner */}
          {searchQuery.trim() && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  Search results for: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">&ldquo;{searchQuery}&rdquo;</strong>
                  <span className="text-slate-400 ml-1.5 font-normal">
                    ({filteredOrders.length} {filteredOrders.length === 1 ? 'match' : 'matches'} found)
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-0.5 rounded-lg hover:bg-indigo-100/50 dark:hover:bg-indigo-900/50"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Easy Exchange Informational Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-indigo-500/10 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[13px] font-extrabold text-slate-900 dark:text-white leading-tight">
                  Our Easy Exchange Program
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                  We believe in perfect fits. If your purchase isn't quite right, our priority exchange service ensures a smooth, helpful experience. Simply share your unboxing video for instant verification.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 shrink-0">
              <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                <CheckCircle2 className="w-3 h-3" />
                <span>Helpful Support</span>
              </div>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                {searchQuery ? <Search className="w-8 h-8" /> : <Package className="w-8 h-8" />}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {searchQuery ? 'No matching orders found' : 'No orders found'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed px-4">
                  {searchQuery
                    ? `No orders matching "${searchQuery}" by order ID, item name, or order date.`
                    : 'You have not placed any orders under this account yet.'}
                </p>
              </div>
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-2xs"
                >
                  Clear search filter
                </button>
              ) : onStartShopping ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartShopping();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md"
                  style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
                >
                  Start Shopping
                </button>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Orders List (5 cols) */}
              <div className={`${showMobileDetail ? 'hidden lg:block' : 'block'} lg:col-span-5 space-y-3`}>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  <span>Past Purchases ({filteredOrders.length})</span>
                  <span className="text-[10px] text-indigo-500 font-semibold lowercase">Click row for full details</span>
                </div>

                {filteredOrders.map((order) => {
                  const activeOrderId = (selectedOrder && filteredOrders.some(o => o.id === selectedOrder.id))
                    ? selectedOrder.id
                    : filteredOrders[0]?.id;
                  const isSelected = activeOrderId === order.id;
                  const firstItem = order.items[0];

                  return (
                    <div
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowMobileDetail(true);
                      }}
                      className={`group p-4 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                              {order.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${getStatusBadge(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                            {getReturnRemainingInfo(order) && (
                              <span 
                                className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[9px] font-black uppercase border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1"
                                title="Easy exchange available with unboxing video"
                              >
                                <RotateCcw className="w-2.5 h-2.5" />
                                <span>Exchange Active</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-sm text-slate-900 dark:text-white">
                            {formatRupees(order.total)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>

                      {/* Line Item Thumbnails Preview */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-2 min-w-0">
                          <div className="flex -space-x-2 overflow-hidden shrink-0">
                            {order.items.slice(0, 3).map((item, i) => (
                              <img
                                key={i}
                                src={item.image}
                                alt={item.name}
                                className="w-9 h-9 rounded-lg object-cover border-2 border-white dark:border-slate-900"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-slate-600 dark:text-slate-300 truncate font-semibold">
                            {firstItem?.name} {order.items.length > 1 && `+ ${order.items.length - 1} more`}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 pl-2 transition-colors">
                          <span className="text-[11px] font-bold hidden sm:inline">Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Detailed Order View (7 cols) */}
              <div className={`${!showMobileDetail ? 'hidden lg:block' : 'block'} lg:col-span-7`}>
                {filteredOrders.length > 0 ? (
                  (() => {
                    const order = (selectedOrder && filteredOrders.some(o => o.id === selectedOrder.id))
                      ? selectedOrder
                      : filteredOrders[0];
                    const subtotal = order.subtotal || order.items.reduce((s, i) => s + i.price * i.quantity, 0);
                    const discount = order.discount || 0;
                    const tax = order.tax || Math.round(subtotal * 0.05);
                    const cgst = Math.round(tax / 2);
                    const sgst = tax - cgst;
                    const shipping = order.shipping || 0;
                    const total = order.total || subtotal - discount + tax + shipping;

                    // Timeline step resolution
                    const getTimelineStep = () => {
                      if (order.status === 'DELIVERED') return 4;
                      if (order.status === 'SHIPPED') return 3;
                      if (order.status === 'PROCESSING') return 2;
                      return 1;
                    };
                    const currentStep = getTimelineStep();

                    return (
                      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
                        {/* Mobile Back Button */}
                        <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setShowMobileDetail(false)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5 hover:bg-slate-200 transition-colors"
                          >
                            <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Back to All Orders</span>
                          </button>
                          <span className="text-[11px] font-mono text-slate-400 font-bold">
                            Viewing {order.id}
                          </span>
                        </div>

                        {/* Order Details Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-black text-xl text-slate-900 dark:text-white">
                                {order.id}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleCopyOrderId(order.id, e)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Copy Order ID"
                              >
                                {copiedId === order.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                Placed on{' '}
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </p>
                          </div>

                          {/* Invoice & Tracking Actions */}
                          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                            {onOpenOrderTrack && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenOrderTrack(order.id);
                                }}
                                className="px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs"
                                title="Track live shipping timeline"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Track Shipment</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => downloadOrderInvoice(order, branding)}
                              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all active:scale-95"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Invoice</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openInvoicePrintWindow(order, branding)}
                              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-xs"
                              title="Print Invoice / Save as PDF"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Delivery Status Journey */}
                        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Truck className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 dark:text-white block">
                                  Blue Dart Express (Air Cargo)
                                </span>
                                <span className="font-mono text-slate-400 text-[11px]">
                                  AWB: {order.trackingNumber || 'BD-7890123IN'} &bull; Insured Transit
                                </span>
                              </div>
                            </div>

                            <div className="text-left sm:text-right">
                              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                                {order.status === 'DELIVERED' ? 'Delivered On' : 'Estimated Delivery'}
                              </span>
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                {order.estimatedDelivery || (order.status === 'DELIVERED' ? 'Successfully Delivered' : 'Within 2-3 Business Days')}
                              </span>
                            </div>
                          </div>

                          {/* 4-Step Visual Progress Bar */}
                          <div className="pt-2">
                            <div className="grid grid-cols-4 gap-2 relative">
                              {[
                                { step: 1, label: 'Order Placed', desc: 'Confirmed' },
                                { step: 2, label: 'Quality Check', desc: 'Packed' },
                                { step: 3, label: 'In Transit', desc: 'Blue Dart Air' },
                                { step: 4, label: 'Delivered', desc: 'Handed Over' },
                              ].map((st) => {
                                const isPassed = currentStep >= st.step;
                                const isCurrent = currentStep === st.step;
                                return (
                                  <div key={st.step} className="flex flex-col items-center text-center space-y-1">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                        isPassed
                                          ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-500/20'
                                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                      } ${isCurrent ? 'scale-110' : ''}`}
                                    >
                                      {isPassed ? <Check className="w-3.5 h-3.5" /> : st.step}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[80px]">
                                      {st.label}
                                    </span>
                                    <span className="text-[9px] text-slate-400 hidden sm:block">
                                      {st.desc}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Line connecting steps */}
                            <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, ((currentStep - 1) / 3) * 100 + 15)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Easy Exchange Active Notification */}
                        {getReturnRemainingInfo(order) && !isExchangeFlowOpen && (
                          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 flex items-center justify-between gap-4 shadow-sm animate-in fade-in zoom-in-95">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                <RotateCcw className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="text-[12px] font-extrabold text-emerald-800 dark:text-emerald-300">
                                  Easy Exchange Window Active
                                </h4>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-500">
                                  You have {getReturnRemainingInfo(order)?.label} left to request an easy exchange for this order.
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setIsExchangeFlowOpen(true);
                                setExchangeStep('intro');
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-lg transition-all active:scale-95"
                            >
                              Start Exchange
                            </button>
                          </div>
                        )}

                        {/* Exchange Flow Modal Content */}
                        {isExchangeFlowOpen && (
                          <div className="p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-5 animate-in slide-in-from-top-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600">
                                  <RotateCcw className="w-4 h-4" />
                                </div>
                                <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                                  {exchangeStep === 'success' ? 'Request Sent!' : 'Start Your Easy Exchange'}
                                </h5>
                              </div>
                              {exchangeStep !== 'success' && (
                                <button
                                  onClick={() => setIsExchangeFlowOpen(false)}
                                  className="text-[11px] font-bold text-slate-400 hover:text-slate-600 hover:underline"
                                >
                                  Close
                                </button>
                              )}
                            </div>

                            {exchangeStep === 'intro' && (
                              <div className="space-y-5">
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl border border-indigo-100/50">
                                  We want to make sure your exchange is handled with priority care. Please confirm your item is unused and you have your unboxing video ready.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="flex items-center space-x-2.5 text-[11px] text-slate-600 dark:text-slate-400 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Unused with original tags</span>
                                  </div>
                                  <div className="flex items-center space-x-2.5 text-[11px] text-slate-600 dark:text-slate-400 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
                                    <Video className="w-4 h-4 text-indigo-500" />
                                    <span>Unboxing video recorded</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setExchangeStep('upload')}
                                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xl transition-all hover:scale-[1.01] active:scale-95"
                                >
                                  Continue to Video Upload
                                </button>
                              </div>
                            )}

                            {exchangeStep === 'upload' && (
                              <div className="space-y-5">
                                <div 
                                  onClick={() => {
                                    if (!videoFile && !isUploading) {
                                      fileInputRef.current?.click();
                                    }
                                  }}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) {
                                      if (file.size > 80 * 1024 * 1024) {
                                        setUploadError('Video file too large (max 80MB)');
                                        return;
                                      }
                                      setVideoFile(file);
                                      setUploadError(null);
                                      const url = URL.createObjectURL(file);
                                      setVideoPreviewUrl(url);
                                    }
                                  }}
                                  className={`p-8 sm:p-10 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-4 cursor-pointer group ${
                                    videoFile 
                                      ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20' 
                                      : 'border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 bg-white/60 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-slate-800/70 shadow-sm'
                                  }`}
                                >
                                  {isUploading ? (
                                    <div className="space-y-4 py-4 w-full max-w-xs mx-auto">
                                      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                      <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black text-indigo-600 tracking-wide uppercase">
                                          <span>Uploading Video...</span>
                                          <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                          />
                                        </div>
                                        <p className="text-[10px] text-slate-500">Encrypting &amp; connecting to verification server</p>
                                      </div>
                                    </div>
                                  ) : videoFile ? (
                                    <>
                                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-500/50 bg-black">
                                        {videoPreviewUrl ? (
                                          <video 
                                            src={videoPreviewUrl} 
                                            className="w-full h-full object-cover"
                                            muted
                                            onMouseOver={(e) => e.currentTarget.play()}
                                            onMouseOut={(e) => e.currentTarget.pause()}
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Video className="w-8 h-8 text-slate-400" />
                                          </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <p className="text-[9px] text-white font-black uppercase">Hover to preview</p>
                                        </div>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[240px]">
                                          {videoFile.name}
                                        </p>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Video Ready for Verification</p>
                                      </div>
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
                                          setVideoFile(null);
                                          setVideoPreviewUrl(null);
                                          setUploadError(null);
                                        }}
                                        className="text-[10px] font-bold text-rose-500 hover:underline"
                                      >
                                        Remove and choose another
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 shadow-md group-hover:scale-105 transition-transform">
                                        <UploadCloud className="w-7 h-7" />
                                      </div>
                                      <div className="space-y-1.5">
                                        <p className="text-sm font-black text-slate-900 dark:text-white">Attach Unboxing Video</p>
                                        <p className="text-[11px] text-slate-500 leading-relaxed px-8">
                                          Click anywhere in this box or choose a video file showing all 360° angles of the unopened package.
                                        </p>
                                      </div>
                                      {uploadError && (
                                        <p className="text-[10px] text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-lg">
                                          {uploadError}
                                        </p>
                                      )}
                                      <input 
                                        ref={fileInputRef}
                                        type="file" 
                                        accept="video/*"
                                        className="hidden" 
                                        id="exchange-video-upload-input" 
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            if (file.size > 80 * 1024 * 1024) {
                                              setUploadError('Video file too large (max 80MB)');
                                              return;
                                            }
                                            setVideoFile(file);
                                            setUploadError(null);
                                            const url = URL.createObjectURL(file);
                                            setVideoPreviewUrl(url);
                                          }
                                        }}
                                      />
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          fileInputRef.current?.click();
                                        }}
                                        className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer hover:opacity-90 shadow-xl transition-all flex items-center space-x-1.5"
                                      >
                                        <Video className="w-3.5 h-3.5" />
                                        <span>Choose Video File</span>
                                      </button>
                                    </>
                                  )}
                                </div>

                                <button
                                  disabled={!videoFile || isUploading}
                                  onClick={() => {
                                    if (!videoFile) {
                                      setUploadError('Please select a video file first');
                                      return;
                                    }
                                    setIsUploading(true);
                                    setUploadProgress(0);
                                    
                                    // Simulate real upload progress
                                    const interval = setInterval(() => {
                                      setUploadProgress((prev) => {
                                        if (prev >= 100) {
                                          clearInterval(interval);
                                          setIsUploading(false);
                                          setExchangeStep('success');
                                          return 100;
                                        }
                                        return prev + Math.floor(Math.random() * 15) + 5;
                                      });
                                    }, 300);
                                  }}
                                  className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-2xl transition-all ${
                                    !videoFile || isUploading
                                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                                      : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.01]'
                                  }`}
                                >
                                  {isUploading ? 'Uploading...' : 'Submit for Helpful Review'}
                                </button>
                              </div>
                            )}

                            {exchangeStep === 'success' && (
                              <div className="space-y-4 text-center py-4 animate-in zoom-in-95">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 shadow-xl mx-auto">
                                  <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div className="space-y-1.5">
                                  <h6 className="font-black text-base text-emerald-800 dark:text-emerald-300">We've Received Your Request!</h6>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 px-8 leading-relaxed">
                                    Thank you for your unboxing video. Our care team will review it within 2 hours and reach out to you via WhatsApp for the next steps.
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    setIsExchangeFlowOpen(false);
                                    setVideoFile(null);
                                  }}
                                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                  Back to Order Details
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 1. Purchased Items Detailed Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
                              <Package className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Purchased Items ({order.items.length})</span>
                            </h5>
                            <span className="text-[11px] text-slate-500 font-semibold">
                              Total Units: {order.items.reduce((s, i) => s + i.quantity, 0)}
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
                              >
                                <div className="flex items-center space-x-3.5 min-w-0 w-full sm:w-auto">
                                  <div className="relative group shrink-0">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                                    />
                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] flex items-center justify-center shadow-sm">
                                      {item.quantity}
                                    </span>
                                  </div>

                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[9px] uppercase border border-indigo-200/60 dark:border-indigo-800">
                                        {item.brand || 'Brand Bazaar'}
                                      </span>
                                      <span className="text-[10px] font-mono text-slate-400">
                                        SKU: {item.productId?.slice(0, 8).toUpperCase() || 'BB-ITEM'}
                                      </span>
                                    </div>

                                    <h6 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                                      {item.name}
                                    </h6>

                                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                      {item.selectedSize && (
                                        <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 text-[10px]">
                                          Size: {item.selectedSize}
                                        </span>
                                      )}
                                      {item.selectedColor && (
                                        <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 text-[10px] flex items-center space-x-1">
                                          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                                          <span>Color: {item.selectedColor}</span>
                                        </span>
                                      )}
                                      <span className="font-semibold text-slate-400">
                                        Qty: {item.quantity} &bull; Unit: {formatRupees(item.price)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-700/60">
                                  <div className="text-left sm:text-right">
                                    <span className="text-sm font-black text-slate-900 dark:text-white">
                                      {formatRupees(item.price * item.quantity)}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block">
                                      Inclusive of Taxes
                                    </span>
                                  </div>

                                  {getReturnRemainingInfo(order) && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsExchangeFlowOpen(true);
                                        setExchangeStep('intro');
                                      }}
                                      className="mt-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                                    >
                                      <RotateCcw className="w-2.5 h-2.5" />
                                      <span>Exchange</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 2. Full Customer & Delivery Address Card */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span>Verified Delivery Address &amp; Contact</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[9px] uppercase border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
                              <BadgeCheck className="w-3 h-3" />
                              <span>Insured Destination</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {/* Physical Address Details */}
                            <div className="space-y-1.5">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                  <User className="w-3 h-3" />
                                </div>
                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                  {order.customer.fullName}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                                <span className="block font-medium">{order.customer.street}</span>
                                <span className="block">
                                  {order.customer.city}, {order.customer.state} &bull; PIN: <strong>{order.customer.zipCode}</strong>
                                </span>
                                <span className="block text-slate-400 text-[11px]">
                                  {order.customer.country || 'India'}
                                </span>
                              </p>
                            </div>

                            {/* Direct Contact Details */}
                            <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200/60 dark:border-slate-700/60 pt-2 md:pt-0 md:pl-4">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                Dispatch Recipient Contact
                              </span>

                              <div className="space-y-1.5 text-xs">
                                <a
                                  href={`tel:${order.customer.phone}`}
                                  className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                  <span className="font-mono font-bold">{order.customer.phone}</span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                                    Primary Phone
                                  </span>
                                </a>

                                <a
                                  href={`mailto:${order.customer.email}`}
                                  className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
                                >
                                  <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                  <span className="truncate">{order.customer.email}</span>
                                </a>
                              </div>

                              <div className="pt-1 text-[11px] text-slate-400 flex items-center space-x-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>OTP &amp; Digital Signature Verification Required at Delivery</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3. Detailed Tax, Shipping & Financial Breakdown Card */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 dark:from-slate-800/40 dark:via-indigo-950/20 dark:to-slate-800/40 border border-slate-200/90 dark:border-slate-800 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-700/70 pb-3">
                            <div className="flex items-center space-x-2">
                              <Receipt className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">
                                Complete Tax &amp; Payment Breakdown
                              </h5>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">
                              GST Compliant Invoice
                            </span>
                          </div>

                          <div className="space-y-2 text-xs">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                              <span>Items Gross Subtotal ({order.items.length} items):</span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {formatRupees(subtotal)}
                              </span>
                            </div>

                            {/* Coupon / Discount */}
                            {discount > 0 && (
                              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/60 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900">
                                <span className="flex items-center space-x-1.5">
                                  <Tag className="w-3 h-3" />
                                  <span>Promotional Discount ({order.couponCode || 'PROMO'}):</span>
                                </span>
                                <span>- {formatRupees(discount)}</span>
                              </div>
                            )}

                            {/* Shipping Breakdown */}
                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                              <span className="flex items-center space-x-1.5">
                                <Truck className="w-3 h-3 text-slate-400" />
                                <span>Express Insured Shipping:</span>
                              </span>
                              {shipping === 0 ? (
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                                  <span className="line-through text-slate-400 font-normal text-[11px]">₹150</span>
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[10px]">FREE</span>
                                </span>
                              ) : (
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {formatRupees(shipping)}
                                </span>
                              )}
                            </div>

                            {/* Detailed GST Tax Component Breakdown */}
                            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                              <div className="flex justify-between items-center text-[11px] text-slate-500">
                                <span className="pl-2">&bull; Central GST (CGST 2.5%):</span>
                                <span className="font-mono">{formatRupees(cgst)}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-slate-500">
                                <span className="pl-2">&bull; State GST (SGST 2.5%):</span>
                                <span className="font-mono">{formatRupees(sgst)}</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 font-semibold">
                                <span>Total Applicable Taxes (GST):</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  {formatRupees(tax)}
                                </span>
                              </div>
                            </div>

                            {/* Final Total Paid */}
                            <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                              <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white block">
                                  Grand Total Paid:
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  All taxes, logistics &amp; insurance included
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                                  {formatRupees(total)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Payment Transaction Reference */}
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="w-4 h-4 text-emerald-500 shrink-0" />
                              <div>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  Method: {order.paymentMethod}
                                </span>
                                <span className="text-slate-400 block text-[10px]">
                                  Ref: TXN-{(order.id.replace(/\D/g, '') || '9821')}-IN &bull; Verified Online
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto">
                              PAID (Authorized)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-16 text-center text-slate-400 space-y-3">
                    <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
                    <div>
                      <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                        No order selected
                      </p>
                      <p className="text-xs text-slate-400">
                        Select any past order on the left to view complete invoice, address, and item details.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
