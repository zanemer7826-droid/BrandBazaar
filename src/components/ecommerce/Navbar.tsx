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
  Home,
  Eye,
  Camera,
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
  onOpenLogoUpload?: () => void;
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
  onOpenLogoUpload,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWishlistBouncing, setIsWishlistBouncing] = useState(false);
  const [showFloatingPlusOne, setShowFloatingPlusOne] = useState(false);
  const [activeToast, setActiveToast] = useState<WishlistToastEvent | null>(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
      {/* Top Notification Bar */}
      {showBar && !announcementDismissed && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 text-white text-xs py-1.5 px-3 sm:px-4 font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="flex items-center font-bold px-2 py-0.5 rounded bg-black/20 text-[10px] tracking-wide uppercase shrink-0">
              <Percent className="w-3 h-3 mr-1" /> {announcementTag}
            </span>
            <span className="truncate">
              Grand Launch at <strong>{branding.storeName || 'Brand Bazaar'}</strong>: {announcementText}
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 text-white/90 text-[11px] ml-2">
            {currentUser && onOpenOrderHistory && (
              <>
                <button
                  onClick={onOpenOrderHistory}
                  className="hidden md:flex items-center hover:underline text-white font-bold bg-white/10 px-2 py-0.5 rounded"
                >
                  <FileText className="w-3.5 h-3.5 mr-1 text-emerald-300" /> My Orders ({currentUser.name})
                </button>
                <span className="hidden md:inline">&bull;</span>
              </>
            )}
            <span className="hidden sm:inline-flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-300" /> 100% Authentic Guarantee
            </span>
            <button
              onClick={() => setAnnouncementDismissed(true)}
              className="p-1 text-white/80 hover:text-white text-xs font-bold rounded hover:bg-black/20"
              title="Dismiss banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar (Slimmer height h-14 sm:h-16 to eliminate bulkiness) */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Dynamic Store Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-2.5 text-left group">
            {/* Logo: Image vs Monogram Letter with Click-to-Upload Badge */}
            <div className="relative group/logo">
              <button
                type="button"
                onClick={() => onSelectCategory('All')}
                className="block"
                title="Go to Home Catalog"
              >
                {branding.logoType === 'image' && branding.logoImageUrl ? (
                  <img
                    src={branding.logoImageUrl}
                    alt={branding.storeName}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover shadow-md border border-slate-200 dark:border-slate-700 transition-transform group-hover/logo:scale-105"
                  />
                ) : (
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-white text-base sm:text-xl shadow-md transition-transform group-hover/logo:scale-105 shrink-0"
                    style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
                  >
                    {branding.logoText || 'B'}
                  </div>
                )}
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={() => onSelectCategory('All')}
                className="text-left"
              >
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate max-w-[110px] sm:max-w-none">
                    {branding.storeName || 'BRAND BAZAAR'}
                  </span>
                  <span className="hidden lg:inline-flex text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/50">
                    FLAGSHIP
                  </span>
                </div>
                <p className="hidden sm:block text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                  {branding.storeTagline || 'The Everything Premium Marketplace'}
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Global Search Box (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg relative mx-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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

        {/* Right Action Icons: Track, Sign In, Wishlist, Bag, Menu */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Tracking Button - VISIBLE on mobile with icon and text */}
          {onOpenTrackOrder && (
            <button
              onClick={onOpenTrackOrder}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
              title="Track Order"
            >
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[11px] sm:text-xs font-bold">Track</span>
            </button>
          )}

          {/* Customer Account / Sign In Trigger - VISIBLE on mobile with text */}
          {currentUser ? (
            <button
              onClick={onOpenOrderHistory || onOpenAuth}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors shadow-2xs shrink-0"
              title="My Orders & Account"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="truncate max-w-[65px] sm:max-w-none">{currentUser.name.split(' ')[0] || 'Orders'}</span>
            </button>
          ) : (
            onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs shrink-0"
                title="Sign In to Shopper Account"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold">Sign In</span>
              </button>
            )
          )}

          {/* Wishlist Button with Floating Counter */}
          <div className="relative shrink-0">
            <button
              onClick={onOpenWishlist}
              className={`p-1.5 sm:p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-all duration-300 ${
                isWishlistBouncing
                  ? 'text-rose-500 scale-110 bg-rose-50 dark:bg-rose-950/60 ring-2 ring-rose-500/40'
                  : 'text-slate-700 dark:text-slate-200'
              }`}
              title="Saved Wishlist"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                  isWishlistBouncing ? 'fill-rose-500 scale-125 animate-bounce' : ''
                }`}
              />
              {wishlistCount > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-0.5 rounded-full text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center transition-all ${
                    isWishlistBouncing
                      ? 'bg-rose-600 scale-125 ring-2 ring-rose-400/40 shadow-lg'
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

          {/* Cart / Bag Trigger - VISIBLE on mobile with Bag text and Count */}
          <button
            onClick={onOpenCart}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
            style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
            title="Shopping Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[11px] sm:text-xs">Bag</span>
            <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-white/25 text-white font-black text-[10px] sm:text-xs flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg md:hidden text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - Directly visible on mobile screens */}
      <div className="md:hidden px-3 pb-2 pt-0.5 border-b border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${branding.storeName || 'products'}...`}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Navigation Bar (Desktop & Mobile Swipeable) */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center justify-between text-xs font-semibold overflow-x-auto scrollbar-none py-2 sm:py-2.5">
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all text-xs shrink-0 whitespace-nowrap ${
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

          <div className="hidden lg:flex items-center space-x-4 text-slate-500 dark:text-slate-400 text-[11px] shrink-0">
            <span className="flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" /> Curated Luxury Catalog
            </span>
            <span>&bull; 24h Easy Exchange Portal</span>
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

      {/* Mobile Sticky Bottom Navigation Bar (Persistent 1-Tap Access for Home, Track, Wishlist, Sign In, Bag) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-around shadow-2xl">
        {/* Home */}
        <button
          type="button"
          onClick={() => {
            onSelectCategory('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            selectedCategory === 'All' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Track */}
        {onOpenTrackOrder && (
          <button
            type="button"
            onClick={onOpenTrackOrder}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] font-bold mt-0.5">Track</span>
          </button>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={onOpenWishlist}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-600 dark:text-slate-300 relative transition-colors"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">Wishlist</span>
        </button>

        {/* Sign In / Account */}
        {currentUser ? (
          <button
            type="button"
            onClick={onOpenOrderHistory || onOpenAuth}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-indigo-600 dark:text-indigo-400 transition-colors font-bold"
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 truncate max-w-[50px]">Orders</span>
          </button>
        ) : (
          onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Sign In</span>
            </button>
          )
        )}

        {/* Bag */}
        <button
          type="button"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl text-white shadow-md relative transition-transform active:scale-95"
          style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
        >
          <div className="relative flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full bg-white text-indigo-600 font-black text-[9px] flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          </div>
          <span className="text-[10px] font-black mt-0.5">Bag</span>
        </button>
      </nav>
    </header>
  );
};
