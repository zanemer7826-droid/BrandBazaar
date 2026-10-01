import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Timer,
  Flame,
  Percent,
  Eye,
  Minimize2,
} from 'lucide-react';
import { CategoryFilter, FlashSaleOfferSettings } from '../../types/ecommerce';
import { formatRupees } from '../../utils/currency';

interface HeroBannerProps {
  onExplore: (category: CategoryFilter) => void;
  onOpenAdmin?: () => void;
  primaryColor: string;
  flashSale?: FlashSaleOfferSettings;
}

interface TopPickSlide {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  category: CategoryFilter;
  image: string;
  tag: string;
}

const TOP_PICK_SLIDES: TopPickSlide[] = [
  {
    id: 'top-1',
    title: 'The Titanium Collection 2026',
    subtitle: 'Vanguard Automatic Chronograph',
    price: 34999,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
    tag: '#1 TOP SOLD',
  },
  {
    id: 'top-2',
    title: 'Acoustic Studio Master',
    subtitle: 'Lumina Spatial ANC Headphones',
    price: 24999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    tag: 'BESTSELLER',
  },
  {
    id: 'top-3',
    title: 'Milano Florentine Leathercraft',
    subtitle: 'Obsidian 48h Duffel & Luggage',
    price: 18499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    tag: 'TOP RATED',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExplore,
  onOpenAdmin,
  primaryColor,
  flashSale,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Default flash sale configurations if not provided
  const saleConfig = flashSale || {
    enabled: true,
    badgeTitle: '⚡ LIMITED TIME FLASH SALE',
    discountHeadline: 'EXTRA 20% OFF',
    description: 'Luxury catalog prices slashed for a limited window. Free Pan-India express delivery included.',
    timerDurationHours: 24,
    ctaText: 'Claim Deal',
    targetCategory: 'All' as CategoryFilter,
    announcementTag: 'SEASON SALE',
    announcementText: 'Enjoy 20% off on all luxury accessories & free global express shipping!',
    showAnnouncementBar: true,
  };

  // Limited-Time Sale Countdown Timer State (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>(() => {
    const now = new Date();
    // End of day flash sale countdown (e.g. 18h 45m remaining or midnight reset)
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = Math.max(0, Math.floor((endOfDay.getTime() - now.getTime()) / 1000));
    return {
      hours: Math.floor(diff / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: diff % 60,
    };
  });

  // Countdown timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset to 24h flash sale cycle
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Slideshow auto-advance timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TOP_PICK_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = TOP_PICK_SLIDES[currentSlide];

  // Helper formatting for 2-digit clock display
  const padZero = (n: number) => n.toString().padStart(2, '0');

  // Collapsed Minimal Strip to prevent bulky screen fill
  if (isCollapsed) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-2.5 px-3 sm:px-6 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-bold text-white">Autumn Drop Catalog</span>
          <span className="text-slate-500 hidden sm:inline">&bull; Banner Minimized</span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-slate-300 hover:text-white font-bold text-[11px] px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800"
          >
            Expand ▾
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
      {/* Top Banner Control Bar (Minimize) */}
      <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-6 pt-3 flex items-center justify-end text-xs">
        <button
          onClick={() => setIsCollapsed(true)}
          className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 flex items-center space-x-1 transition-all"
          title="Minimize Hero Banner"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Minimize</span>
        </button>
      </div>
      {/* Background ambient lighting */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: primaryColor || '#4f46e5' }}
      />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 bg-rose-500 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8 relative z-10 space-y-4 sm:space-y-6">
        {/* FLASH SALE COUNTDOWN URGENCY STRIP */}
        {saleConfig.enabled && (
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-indigo-500/15 border border-amber-500/30 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shadow-xl">
            <div className="flex items-center space-x-2.5 sm:space-x-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-lg shrink-0 animate-bounce">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-300">
                    {saleConfig.badgeTitle || '⚡ LIMITED TIME FLASH SALE'}
                  </span>
                  {saleConfig.discountHeadline && (
                    <span className="hidden sm:inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/80 text-white animate-pulse">
                      {saleConfig.discountHeadline}
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                  {saleConfig.description || 'Luxury catalog prices slashed for a limited window. Free Pan-India express delivery included.'}
                </p>
              </div>
            </div>

            {/* Live Countdown Clock Units */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden lg:block mr-1">
                Ends In:
              </div>

              {/* Hours Block */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-white/20 text-white font-mono font-black text-sm sm:text-xl flex items-center justify-center shadow-inner">
                  {padZero(timeLeft.hours)}
                </div>
                <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5 sm:mt-1">
                  Hours
                </span>
              </div>

              <span className="font-mono text-base sm:text-xl font-bold text-amber-400 pb-3 sm:pb-4">:</span>

              {/* Minutes Block */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-white/20 text-amber-300 font-mono font-black text-sm sm:text-xl flex items-center justify-center shadow-inner">
                  {padZero(timeLeft.minutes)}
                </div>
                <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5 sm:mt-1">
                  Mins
                </span>
              </div>

              <span className="font-mono text-base sm:text-xl font-bold text-amber-400 pb-3 sm:pb-4">:</span>

              {/* Seconds Block */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-rose-500/40 text-rose-400 font-mono font-black text-sm sm:text-xl flex items-center justify-center shadow-inner animate-pulse">
                  {padZero(timeLeft.seconds)}
                </div>
                <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5 sm:mt-1">
                  Secs
                </span>
              </div>

              <button
                onClick={() => {
                  onExplore(saleConfig.targetCategory || 'All');
                  setTimeout(() => {
                    const el = document.getElementById('products-catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className="ml-1 sm:ml-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-[11px] sm:text-xs shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-1 shrink-0"
              >
                <span>{saleConfig.ctaText || 'Claim Deal'}</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Grid Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column Copy */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-white/10 text-indigo-300 border border-white/15 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span>Autumn Luxury Drop &bull; Brand Bazaar Original</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1]">
              Where Every Brand Tells{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-rose-400 to-indigo-300">
                A Story of Excellence.
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              Explore thousands of verified designer timepieces, Italian leathercraft, high-performance footwear, spatial audio, and architectural home decor.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <button
                onClick={() => onExplore('Fashion')}
                className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center space-x-2"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() => onExplore('Accessories')}
                className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold border border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-xs transition-colors flex items-center space-x-2"
              >
                <span>Explore Timepieces</span>
              </button>
            </div>

            {/* Quick Micro Badges */}
            <div className="pt-4 sm:pt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 border-t border-white/10 text-[11px] sm:text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>Express Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
                <span>100% Certified Original</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
                <span>Easy Exchange</span>
              </div>
              <div className="flex items-center space-x-2">
                <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
                <span>24/7 VIP Concierge</span>
              </div>
            </div>
          </div>

          {/* Right Column Visual Showcase with Auto Slideshow */}
          <div className="lg:col-span-5 relative">
            <div
              onClick={() => onExplore(slide.category)}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group aspect-4/3 sm:aspect-auto cursor-pointer"
            >
              <img
                src={slide.image}
                alt={slide.title}
                key={slide.id}
                className="w-full h-56 sm:h-72 object-cover object-center group-hover:scale-105 transition-all duration-700 animate-in fade-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                        TOP PICK
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">
                        {slide.tag}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-slate-300">{slide.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-slate-950 shadow-md">
                      From {formatRupees(slide.price)}
                    </span>
                  </div>
                </div>

                {/* Slideshow Navigation Dots & Arrows */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
                  <div className="flex items-center space-x-1.5">
                    {TOP_PICK_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentSlide
                            ? 'w-6 bg-amber-400'
                            : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide((prev) =>
                          prev === 0 ? TOP_PICK_SLIDES.length - 1 : prev - 1
                        );
                      }}
                      className="p-1 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
                      title="Previous"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide((prev) => (prev + 1) % TOP_PICK_SLIDES.length);
                      }}
                      className="p-1 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
                      title="Next"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

