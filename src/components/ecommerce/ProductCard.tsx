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
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView,
  primaryColor,
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
      className="group relative flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={currentPhoto}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm text-white ${
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
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/90 text-white backdrop-blur-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Photo Gallery Count Tag */}
        {gallery.length > 1 && (
          <div className="absolute top-3 right-12 z-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-black tracking-wider flex items-center space-x-1">
            <span>📷 {gallery.length} Photos</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-transform active:scale-90 shadow-md z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-rose-500 hover:bg-white'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Multi-Photo Dots/Thumbnail Switcher Bar */}
        {gallery.length > 1 && (
          <div className="absolute bottom-12 inset-x-0 flex items-center justify-center space-x-1 z-10 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
      <div className="flex flex-1 flex-col p-4 sm:p-5 justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span>{product.brand}</span>
            <span className="text-slate-500 font-normal">{product.category}</span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>

          {/* Product Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
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

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1 pt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {product.rating}
            </span>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>

          {/* Color Switcher if available */}
          {product.colors && product.colors.length > 0 && (
            <div className="pt-2 flex items-center space-x-1.5">
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
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {formatRupees(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatRupees(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
              In Stock ({product.stockCount})
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center space-x-1.5 ${
              addedAnim ? 'bg-emerald-600 scale-105' : 'hover:opacity-95 hover:scale-102 active:scale-95'
            }`}
            style={{ backgroundColor: addedAnim ? '#059669' : primaryColor || '#4f46e5' }}
          >
            {addedAnim ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
