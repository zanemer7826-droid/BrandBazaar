import React, { useState, useRef } from 'react';
import {
  X,
  Search,
  HelpCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Video,
  UploadCloud,
  FileCheck,
} from 'lucide-react';
import { Order } from '../../types/ecommerce';
import { formatRupees } from '../../utils/currency';
import { OrderLookupForm } from './OrderLookupForm';

export type ClientServiceTab = 'faq' | 'track' | 'returns';

interface ClientServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ClientServiceTab;
  orders?: Order[];
  primaryColor?: string;
}

interface FaqItem {
  question: string;
  answer: string;
  category: 'Orders & Shipping' | 'Returns & Refunds' | 'Payments & UPI' | 'Authenticity & Warranty';
}

const FAQ_DATA: FaqItem[] = [
  {
    category: 'Orders & Shipping',
    question: 'How long does delivery take across India?',
    answer:
      'We ship all orders via Blue Dart, Delhivery, and DTDC Express. Metro cities (Mumbai, Delhi NCR, Bengaluru, Chennai, Hyderabad, Kolkata) receive delivery within 24 to 48 hours. Non-metro locations and tier-2/3 cities are delivered within 3 to 5 business days.',
  },
  {
    category: 'Orders & Shipping',
    question: 'How do I track my shipment?',
    answer:
      'Once your order is dispatched, you will receive an SMS and email notification with your Air Waybill (AWB) tracking number. You can also track your package directly under the "Track Your Order" tab above using your Order ID or phone number.',
  },
  {
    category: 'Orders & Shipping',
    question: 'Is shipping free?',
    answer:
      'Yes! We offer 100% Free Express Shipping on all prepaid and COD orders above ₹1,999 across all pin codes in India. Orders below ₹1,999 have a nominal flat delivery charge of ₹199.',
  },
  {
    category: 'Returns & Refunds',
    question: 'What is the Return & Exchange Policy?',
    answer:
      'To maintain the highest quality standards, all sales are final. However, we offer a worry-free exchange program within 24 hours of delivery. Just ensure you record a quick unboxing video to help us verify the condition for a smooth swap!',
  },
  {
    category: 'Returns & Refunds',
    question: 'How does the Easy Exchange work?',
    answer:
      'Simply reach out to us within 24 hours of delivery with your unboxing video. We use the video to quickly verify the parcel condition and speed up your replacement process.',
  },
  {
    category: 'Payments & UPI',
    question: 'Which payment options are supported?',
    answer:
      'We support instant NPCI Dynamic UPI QR codes (Google Pay, PhonePe, Paytm, CRED), Netbanking across all 40+ RBI-scheduled Indian banks (SBI, HDFC, ICICI, Axis, Kotak, PNB), Debit/Credit Cards (RuPay, Visa, Mastercard, AMEX), and Cash on Delivery (COD).',
  },
  {
    category: 'Payments & UPI',
    question: 'Is Netbanking and UPI checkout 100% secure?',
    answer:
      'Yes. All transactions are protected with 256-bit SSL encryption, RBI-mandated two-factor authentication (OTP/biometrics), and PCI-DSS Level 1 compliance. We do not store any banking passwords or PINs.',
  },
  {
    category: 'Authenticity & Warranty',
    question: 'Are all products authentic and genuine?',
    answer:
      'Every product listed on Brand Bazaar is sourced directly from authorized brand distributors or verified flagship manufacturers. Each shipment includes an official brand warranty and proof of authenticity.',
  },
  {
    category: 'Authenticity & Warranty',
    question: 'How do I claim brand warranty?',
    answer:
      'Your digital GST tax invoice acts as official proof of purchase. You can visit any authorized brand service center across India or reach out to our VIP concierge team for doorstep warranty assistance.',
  },
];

export const ClientServicesModal: React.FC<ClientServicesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'faq',
  orders = [],
  primaryColor = '#4f46e5',
}) => {
  const [activeTab, setActiveTab] = useState<ClientServiceTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Track Order State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Returns Form State
  const [returnOrderId, setReturnOrderId] = useState('');
  const [returnReason, setReturnReason] = useState('Size did not fit');
  const [returnSubmitted, setReturnSubmitted] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Orders & Shipping', 'Returns & Refunds', 'Payments & UPI', 'Authenticity & Warranty'];

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackSearched(true);
    const clean = trackQuery.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.customer.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === clean)
    );
    setTrackedOrder(found || null);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      setUploadError('Please select or attach your 360° unboxing video before proceeding.');
      return;
    }
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setReturnSubmitted(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 12;
      });
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md font-black text-base"
              style={{ backgroundColor: primaryColor }}
            >
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                Brand Bazaar Client Services
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                24/7 Support, Order Tracking, Return Policy &amp; FAQs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900 shrink-0 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'faq'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help Center &amp; FAQ</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'track'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Track Your Order</span>
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'returns'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Easy Exchange Portal</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: HELP CENTER & FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions (e.g. refund, delivery, UPI, warranty)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* FAQ Accordion */}
              <div className="space-y-3">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No FAQs matched your search. Try different keywords or contact our support team below.
                  </div>
                ) : (
                  filteredFaqs.map((faq, idx) => {
                    const isOpen = expandedFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40"
                      >
                        <button
                          onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                          className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/70 transition-colors"
                        >
                          <span className="flex-1">{faq.question}</span>
                          <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Contact Concierge Strip */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-slate-900/10 border border-indigo-200 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Need instant personalized assistance?
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Our VIP support team is available 24/7 across WhatsApp, Phone &amp; Email.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="mailto:support@brandbazaar.in"
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5 hover:bg-slate-200"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Us</span>
                  </a>
                  <a
                    href="tel:18002008899"
                    className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center space-x-1.5 hover:bg-indigo-700 shadow-md"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>1800-200-8899</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRACK YOUR ORDER */}
          {activeTab === 'track' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Live Consignment &amp; Order Tracker
                </h4>
                <p className="text-xs text-slate-500">
                  Lookup live fulfillment status, tracking AWB number, delivery address, and ordered items.
                </p>
              </div>

              <OrderLookupForm orders={orders} primaryColor={primaryColor} />
            </div>
          )}

          {/* TAB 3: EASY EXCHANGE PORTAL */}
          {activeTab === 'returns' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-emerald-500/10 to-slate-900/10 border border-indigo-500/20 space-y-3">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Premium Exchange & Quality Guarantee</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  We are committed to delivering excellence. While all sales are final, we offer a <strong>priority exchange window</strong> for any concerns. To ensure a smooth process, please submit your request within 24 hours with your unboxing video.
                </p>
              </div>

              {/* Policy Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    Quick Support Window
                  </h5>
                  <p className="text-[11px] text-slate-500">For the fastest resolution, please initiate your exchange within 24 hours of receiving your parcel.</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-indigo-500" />
                    Original Packaging
                  </h5>
                  <p className="text-[11px] text-slate-500">To qualify for an exchange, items should be in their original, unused condition with all designer tags attached.</p>
                </div>

                <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/20 space-y-2 sm:col-span-2">
                  <h5 className="font-bold text-xs text-indigo-700 dark:text-indigo-400 flex items-center gap-2 uppercase tracking-tight">
                    <Video className="w-3.5 h-3.5" />
                    Simple Video Verification
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Recording a quick 360° video of the sealed package before opening protects you against any courier damage and ensures <strong>instant approval</strong> for your exchange.
                  </p>
                </div>
              </div>

              {/* Interactive Exchange Request Form */}
              {!returnSubmitted ? (
                <form onSubmit={handleReturnSubmit} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm bg-white dark:bg-slate-900/50">
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Start Your Exchange Request
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Order Number
                      </label>
                      <input
                        type="text"
                        required
                        value={returnOrderId}
                        onChange={(e) => setReturnOrderId(e.target.value)}
                        placeholder="e.g. ORD-9821"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Reason for Exchange
                      </label>
                      <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="Size did not fit">Size did not fit (Exchange)</option>
                        <option value="Quality check">Quality concerns</option>
                        <option value="Received incorrect item">Received incorrect item</option>
                        <option value="Defective/Damaged">Defective/Damaged</option>
                      </select>
                    </div>
                  </div>

                  {/* Clickable Video Upload Dropzone */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Unboxing Video Evidence (Mandatory 360° View)
                    </label>

                    <div
                      onClick={() => {
                        if (!isUploading) {
                          fileInputRef.current?.click();
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          if (!file.type.startsWith('video/')) {
                            setUploadError('Please select a valid video file format (MP4, MOV, WebM).');
                            return;
                          }
                          if (file.size > 80 * 1024 * 1024) {
                            setUploadError('Video file too large (max 80MB).');
                            return;
                          }
                          setVideoFile(file);
                          setUploadError(null);
                          const url = URL.createObjectURL(file);
                          setVideoPreviewUrl(url);
                        }
                      }}
                      className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 group ${
                        videoFile
                          ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 hover:border-indigo-500 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30'
                      }`}
                    >
                      {/* Hidden File Input always ready */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        id="client-services-video-input"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 80 * 1024 * 1024) {
                              setUploadError('Video file too large (max 80MB).');
                              return;
                            }
                            setVideoFile(file);
                            setUploadError(null);
                            const url = URL.createObjectURL(file);
                            setVideoPreviewUrl(url);
                          }
                        }}
                      />

                      {isUploading ? (
                        <div className="space-y-3 py-3 w-full max-w-xs mx-auto">
                          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase">
                              <span>Uploading &amp; Verifying...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500">Checking 360° unboxing recording seals</p>
                          </div>
                        </div>
                      ) : videoFile ? (
                        <>
                          <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-500/50 bg-black">
                            {videoPreviewUrl ? (
                              <video
                                src={videoPreviewUrl}
                                className="w-full h-full object-cover"
                                muted
                                onMouseOver={(e) => e.currentTarget.play()}
                                onMouseOut={(e) => e.currentTarget.pause()}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Video className="w-8 h-8" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[9px] text-white font-black uppercase">Hover to preview</p>
                            </div>
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center justify-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                              <FileCheck className="w-4 h-4" />
                              <span className="truncate max-w-[200px]">{videoFile.name}</span>
                            </div>
                            <p className="text-[10px] text-slate-500">
                              {(videoFile.size / (1024 * 1024)).toFixed(1)} MB &bull; Ready for verification
                            </p>
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
                            className="text-[11px] font-bold text-rose-500 hover:text-rose-700 hover:underline"
                          >
                            Remove and choose different video
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-105 transition-transform">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-black text-slate-900 dark:text-white">
                              Attach Unboxing Video
                            </p>
                            <p className="text-[11px] text-slate-500 max-w-xs">
                              Click anywhere in this box or choose a video file showing all 360° angles of the unopened package.
                            </p>
                          </div>

                          {uploadError && (
                            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-lg">
                              {uploadError}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md group-hover:opacity-90 transition-all flex items-center space-x-1.5"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Select Video File</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isUploading ? `Uploading Video (${uploadProgress}%)...` : 'Submit for Quick Verification'}
                  </button>
                </form>
              ) : (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/40 text-center space-y-2 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h5 className="font-extrabold text-sm text-emerald-700 dark:text-emerald-300">
                    Verification In Progress
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Our quality team is reviewing your order <strong>{returnOrderId || 'ORD-9821'}</strong>. You will receive an update via WhatsApp within 2 hours.
                  </p>
                  <button
                    onClick={() => {
                      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
                      setReturnSubmitted(false);
                      setReturnOrderId('');
                      setVideoFile(null);
                      setVideoPreviewUrl(null);
                      setUploadProgress(0);
                      setUploadError(null);
                    }}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold underline pt-1"
                  >
                    Submit another request
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
