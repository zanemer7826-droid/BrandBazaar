import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Heart,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Percent,
  Truck,
  User,
  FileText,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { CategoryFilter, StoreBrandingSettings, UserProfile, Product, FlashSaleOfferSettings } from '../../types/ecommerce';

export interface WishlistToastEvent {
  product: Product;
  action: 'added' | 'removed';
  timestamp: number;
}

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenTrackOrder?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  onOpenOrderHistory?: () => void;
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  branding: StoreBrandingSettings;
  flashSale?: FlashSaleOfferSettings;
  lastWishlistEvent?: WishlistToastEvent | null;
  onClearWishlistToast?: () => void;
}

const CATEGORIES: CategoryFilter[] = [
  'All',
  'Fashion',
  'Footwear',
  'Electronics',
  'Accessories',
  'Beauty',
  'Home & Living',
];

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenTrackOrder,
  currentUser,
  onOpenAuth,
  onOpenOrderHistory,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  branding,
  flashSale,
  lastWishlistEvent,
  onClearWishlistToast,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWishlistBouncing, setIsWishlistBouncing] = useState(false);
  const [showFloatingPlusOne, setShowFloatingPlusOne] = useState(false);
  const [activeToast, setActiveToast] = useState<WishlistToastEvent | null>(null);

  const showBar = flashSale ? flashSale.showAnnouncementBar : true;
  const announcementTag = flashSale?.announcementTag || 'SEASON SALE';
  const announcementText = flashSale?.announcementText || 'Enjoy 20% off on all luxury accessories & free global express shipping!';

  // Trigger animations when wishlist event arrives
  useEffect(() => {
    if (!lastWishlistEvent) return;

    if (lastWishlistEvent.action === 'added') {
      setIsWishlistBouncing(true);
      setShowFloatingPlusOne(true);
      setActiveToast(lastWishlistEvent);

      const bounceTimeout = setTimeout(() => setIsWishlistBouncing(false), 1400);
      const floatTimeout = setTimeout(() => setShowFloatingPlusOne(false), 1200);
      const toastTimeout = setTimeout(() => {
        setActiveToast(null);
        if (onClearWishlistToast) onClearWishlistToast();
      }, 4000);

      return () => {
        clearTimeout(bounceTimeout);
        clearTimeout(floatTimeout);
        clearTimeout(toastTimeout);
      };
    } else {
      setActiveToast(lastWishlistEvent);
      const toastTimeout = setTimeout(() => {
        setActiveToast(null);
        if (onClearWishlistToast) onClearWishlistToast();
      }, 2500);
      return () => clearTimeout(toastTimeout);
    }
  }, [lastWishlistEvent, onClearWishlistToast]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Notification Bar */}
      {showBar && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="flex items-center font-bold px-2 py-0.5 rounded bg-black/20 text-[10px] tracking-wide uppercase">
              <Percent className="w-3 h-3 mr-1" /> {announcementTag}
            </span>
            <span className="truncate">
              Grand Launch at <strong>{branding.storeName || 'Brand Bazaar'}</strong>: {announcementText}
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 shrink-0 text-white/90 text-[11px]">
            {currentUser && onOpenOrderHistory && (
              <>
                <button
                  onClick={onOpenOrderHistory}
                  className="flex items-center hover:underline text-white font-bold bg-white/10 px-2 py-0.5 rounded"
                >
                  <FileText className="w-3.5 h-3.5 mr-1 text-emerald-300" /> My Orders ({currentUser.name})
                </button>
                <span>&bull;</span>
              </>
            )}
            {onOpenTrackOrder && (
              <button
                onClick={onOpenTrackOrder}
                className="flex items-center hover:underline text-white font-bold"
              >
                <Truck className="w-3.5 h-3.5 mr-1 text-amber-300" /> Track Order Status
              </button>
            )}
            <span>&bull;</span>
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-300" /> 100% Authentic Guarantee
            </span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Dynamic Store Logo */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => onSelectCategory('All')}
            className="flex items-center space-x-2.5 text-left group"
          >
            {/* Logo: Image vs Monogram Letter */}
            {branding.logoType === 'image' && branding.logoImageUrl ? (
              <img
                src={branding.logoImageUrl}
                alt={branding.storeName}
                className="w-10 h-10 rounded-2xl object-cover shadow-lg border border-slate-200 dark:border-slate-700 transition-transform group-hover:scale-105"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg transition-transform group-hover:scale-105"
                style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
              >
                {branding.logoText || 'B'}
              </div>
            )}

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {branding.storeName || 'BRAND BAZAAR'}
                </span>
                <span className="hidden lg:inline-flex text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/50">
                  FLAGSHIP
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                {branding.storeTagline || 'The Everything Premium Marketplace'}
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Box */}
        <div className="hidden md:flex flex-1 max-w-lg relative mx-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search watches, cashmere, shoes, audio, tech..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Action Icons: Account, Wishlist, Cart, Admin Portal */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          {/* Tracking Button */}
          {onOpenTrackOrder && (
            <button
              onClick={onOpenTrackOrder}
              className="flex items-center space-x-1.5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              title="Track Order"
            >
              <Truck className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold">Track</span>
            </button>
          )}

          {/* Customer Account / Order History Trigger */}
          {currentUser ? (
            <button
              onClick={onOpenOrderHistory || onOpenAuth}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs font-bold border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors shadow-xs"
              title="My Orders & Account"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Orders</span>
            </button>
          ) : (
            onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
                title="Sign In to Shopper Account"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )
          )}

          {/* Wishlist Button with Floating Counter Animation & Toast */}
          <div className="relative">
            <button
              onClick={onOpenWishlist}
              className={`p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-all duration-300 ${
                isWishlistBouncing
                  ? 'text-rose-500 scale-110 bg-rose-50 dark:bg-rose-950/60 ring-2 ring-rose-500/40'
                  : 'text-slate-700 dark:text-slate-200'
              }`}
              title="Saved Wishlist"
            >
              <Heart
                className={`w-5 h-5 transition-transform duration-300 ${
                  isWishlistBouncing ? 'fill-rose-500 scale-125 animate-bounce' : ''
                }`}
              />
              {wishlistCount > 0 && (
                <span
                  className={`absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-black flex items-center justify-center transition-all ${
                    isWishlistBouncing
                      ? 'bg-rose-600 scale-125 ring-4 ring-rose-400/40 shadow-lg'
                      : 'bg-rose-500 shadow-xs'
                  }`}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Floating +1 Upward Drift Animation */}
            {showFloatingPlusOne && (
              <span className="absolute -top-4 right-0 pointer-events-none font-black text-xs text-rose-500 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-full shadow-md border border-rose-200 dark:border-rose-900 animate-in fade-in zoom-in slide-out-to-top-4 duration-1000">
                +1 ❤️
              </span>
            )}

            {/* FLOATING WISHLIST TOAST NOTIFICATION */}
            {activeToast && activeToast.action === 'added' && (
              <div className="absolute right-0 top-full mt-3 w-72 sm:w-80 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-rose-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-start space-x-3">
                  <img
                    src={activeToast.product.image}
                    alt={activeToast.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>Added to Wishlist!</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                      {activeToast.product.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{activeToast.product.brand}</p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveToast(null);
                      if (onClearWishlistToast) onClearWishlistToast();
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} in wishlist
                  </span>
                  <button
                    onClick={() => {
                      setActiveToast(null);
                      onOpenWishlist();
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                  >
                    <span>View Wishlist</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-full text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="w-5 h-5 rounded-full bg-white/25 text-white font-black text-xs flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg md:hidden text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs font-semibold overflow-x-auto py-2.5">
          <div className="flex items-center space-x-1 sm:space-x-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400 text-[11px]">
            <span className="flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" /> Curated Luxury Catalog
            </span>
            <span className="hidden lg:inline">&bull; 24h Easy Exchange Portal</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search ${branding.storeName}...`}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Browse Categories
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {currentUser && onOpenOrderHistory ? (
              <button
                onClick={() => {
                  onOpenOrderHistory();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center space-x-2"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span>My Past Orders &amp; Invoices</span>
              </button>
            ) : (
              onOpenAuth && (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Customer Login / VIP Club</span>
                </button>
              )
            )}

            {onOpenTrackOrder && (
              <button
                onClick={() => {
                  onOpenTrackOrder();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-2"
              >
                <Truck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Track Order Status</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
