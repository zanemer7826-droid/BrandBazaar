import React, { useState } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Eye,
  Check,
  TrendingUp,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { Product } from '../../types/ecommerce';
import { formatRupees } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
  primaryColor: string;
  eyeComfortMode?: boolean;
}

// Helper to simplify text on mobile for eye comfort and clean readability
const simplifyForMobile = (fullName: string): string => {
  const customMap: Record<string, string> = {
    'AeroCraft Titanium Chronograph Watch': 'Titanium Watch',
    'Pulse Pro Wireless Spatial ANC Headphones': 'ANC Headphones',
    'Horizon Minimalist Cashmere Overshirt': 'Cashmere Shirt',
    'Milano Florentine Leather Weekender': 'Leather Bag',
    'Monolith Sculptural Concrete Table Lamp': 'Table Lamp',
    'Kanso Japanese Pure Silk Kimono Robe': 'Silk Robe',
    'AeroStride Carbon Fiber Pro Running Shoes': 'Running Shoes',
    'Aura Pure Cellular Repair Night Treatment': 'Night Serum',
    'Kanso Ceramic Hybrid French Press': 'French Press',
    'Nordic Merino Wool Roll-Neck Sweater': 'Wool Sweater',
    'Aviator Titanium Polarized Sunglasses': 'Sunglasses',
    'Artisan Matte Black Pour-Over Kettle': 'Pour-Over Kettle',
    'Botanical Restorative Bath Oil': 'Bath Oil',
  };

  if (customMap[fullName]) return customMap[fullName];

  const firstPart = fullName.split(/[-–—|]/)[0].trim();
  const words = firstPart.split(/\s+/);
  if (words.length > 3) {
    return words.slice(0, 3).join(' ');
  }
  return firstPart;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView,
  primaryColor,
  eyeComfortMode = false,
}) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [addedAnim, setAddedAnim] = useState(false);

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const currentPhoto = gallery[activeImgIndex] || product.image;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, selectedColor);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className={`group relative flex flex-col rounded-xl sm:rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1 cursor-pointer ${
        eyeComfortMode
          ? 'border-[#e8e4dc] dark:border-zinc-800 bg-[#fdfcf9] dark:bg-[#1f1f23] shadow-xs hover:shadow-md'
          : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-xl'
      }`}
    >
      {/* Product Image Area */}
      <div className={`relative aspect-square w-full overflow-hidden ${eyeComfortMode ? 'bg-[#f4efe6] dark:bg-zinc-800/80' : 'bg-slate-100 dark:bg-slate-800'}`}>
        <img
          src={currentPhoto}
          alt={product.name}
          className={`h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${eyeComfortMode ? 'filter-none' : ''}`}
          loading="lazy"
        />

        {/* Top Badges */}
        {!eyeComfortMode ? (
          <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
            {product.badge && (
              <span
                className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded sm:rounded-md text-[7px] sm:text-[10px] font-black uppercase tracking-wider shadow-xs text-white ${
                  product.badge === 'HOT'
                    ? 'bg-rose-600'
                    : product.badge === 'SALE'
                    ? 'bg-amber-600'
                    : product.badge === 'NEW'
                    ? 'bg-emerald-600'
                    : 'bg-purple-600'
                }`}
              >
                {product.badge}
              </span>
            )}
            {discountPercent && (
              <span className="px-1 py-0.2 sm:px-2 sm:py-0.5 rounded sm:rounded-md text-[7px] sm:text-[10px] font-black bg-slate-900/90 text-white backdrop-blur-xs">
                -{discountPercent}%
              </span>
            )}
          </div>
        ) : discountPercent ? (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#3f3f46]/80 text-[#fafafa] backdrop-blur-xs">
              -{discountPercent}%
            </span>
          </div>
        ) : null}

        {/* Photo Gallery Count Tag */}
        {gallery.length > 1 && !eyeComfortMode && (
          <div className="hidden sm:flex absolute top-3 right-12 z-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-black tracking-wider items-center space-x-1">
            <span>📷 {gallery.length}</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-1.5 right-1.5 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full transition-transform active:scale-90 shadow-2xs sm:shadow-md z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : eyeComfortMode
              ? 'bg-white/80 dark:bg-zinc-900/80 text-stone-600 dark:text-stone-300 hover:text-rose-500 hover:bg-white'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-rose-500 hover:bg-white'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Multi-Photo Dots/Thumbnail Switcher Bar (Desktop only) */}
        {gallery.length > 1 && (
          <div className="hidden sm:flex absolute bottom-12 inset-x-0 items-center justify-center space-x-1 z-10 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIndex(idx);
                }}
                onMouseEnter={() => setActiveImgIndex(idx)}
                className={`h-2 rounded-full transition-all border ${
                  idx === activeImgIndex
                    ? 'w-6 bg-white border-indigo-600 shadow-md'
                    : 'w-2 bg-white/60 hover:bg-white border-transparent'
                }`}
                title={`View Photo ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Quick View Overlay on Hover (Desktop only) */}
        <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 rounded-xl text-xs font-bold text-white bg-black/70 hover:bg-black backdrop-blur-xs flex items-center justify-center space-x-1.5 shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View Details</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className={`flex flex-1 flex-col ${eyeComfortMode ? 'p-2.5 sm:p-4 md:p-5' : 'p-2 sm:p-4 md:p-5'} justify-between`}>
        <div className="space-y-0.5 sm:space-y-1.5">
          <div className="flex items-center justify-between text-[8px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="truncate">{product.brand}</span>
            <span className="text-slate-500 font-normal hidden sm:inline truncate">{product.category}</span>
          </div>

          <h3 className={`font-bold text-[11px] sm:text-sm md:text-base line-clamp-1 transition-colors leading-tight ${
            eyeComfortMode
              ? 'text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 font-semibold'
              : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
          }`}>
            <span className="sm:hidden">
              {eyeComfortMode ? simplifyForMobile(product.name) : product.name}
            </span>
            <span className="hidden sm:inline">
              {product.name}
            </span>
          </h3>

          {/* Product Tags (Desktop) */}
          {product.tags && product.tags.length > 0 && !eyeComfortMode && (
            <div className="hidden sm:flex flex-wrap gap-1 pt-0.5">
              {product.tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold tracking-wide uppercase ${
                    t === 'Best Seller'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800'
                      : t === 'New Arrival'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800'
                      : t === 'Limited Edition'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300/60 dark:border-purple-800'
                      : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  {t}
                </span>
              ))}
              {product.tags.length > 2 && (
                <span className="text-[9px] font-bold text-slate-400 px-1 py-0.5">
                  +{product.tags.length - 2}
                </span>
              )}
            </div>
          )}

          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-0.5 sm:space-x-1 pt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-current" />
            </div>
            <span className={`text-[9px] sm:text-xs font-bold ${eyeComfortMode ? 'text-stone-800 dark:text-stone-200' : 'text-slate-800 dark:text-slate-200'}`}>
              {product.rating}
            </span>
            {!eyeComfortMode && (
              <span className="text-[8px] sm:text-[11px] text-slate-400 hidden sm:inline">({product.reviewCount})</span>
            )}
          </div>

          {/* Color Switcher (Desktop) */}
          {product.colors && product.colors.length > 0 && !eyeComfortMode && (
            <div className="hidden sm:flex pt-2 items-center space-x-1.5">
              <span className="text-[10px] text-slate-400 font-medium">Color:</span>
              <div className="flex space-x-1">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(c);
                    }}
                    className={`text-[10px] px-1.5 py-0.5 rounded border transition-all ${
                      selectedColor === c
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className={`mt-1.5 sm:mt-4 pt-1.5 sm:pt-3 border-t flex items-center justify-between gap-1 ${
          eyeComfortMode ? 'border-[#eeebe3] dark:border-zinc-800' : 'border-slate-100 dark:border-slate-800/80'
        }`}>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline space-x-1">
              <span className={`text-[11px] sm:text-sm md:text-base font-black truncate ${
                eyeComfortMode ? 'text-stone-900 dark:text-stone-100' : 'text-slate-900 dark:text-white'
              }`}>
                {formatRupees(product.price)}
              </span>
              {product.originalPrice && !eyeComfortMode && (
                <span className="text-[8px] sm:text-xs text-slate-400 line-through hidden sm:inline">
                  {formatRupees(product.originalPrice)}
                </span>
              )}
            </div>
            {!eyeComfortMode && (
              <span className="text-[8px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold hidden md:block">
                In Stock
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-white shadow-2xs sm:shadow-md transition-all flex items-center justify-center shrink-0 ${
              addedAnim ? 'bg-emerald-600 scale-105' : 'hover:opacity-95 hover:scale-102 active:scale-95'
            }`}
            style={{ backgroundColor: addedAnim ? '#059669' : primaryColor || '#4f46e5' }}
            title={addedAnim ? 'Added to Bag' : 'Add to Bag'}
          >
            {addedAnim ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden md:inline ml-1">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden md:inline ml-1">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
