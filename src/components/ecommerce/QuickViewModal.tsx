import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Share2,
  Copy,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { Product } from '../../types/ecommerce';
import { formatRupees } from '../../utils/currency';
import { ProductReviewsSection } from './ProductReviewsSection';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  primaryColor: string;
  freeDeliveryThreshold?: number;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  primaryColor,
  freeDeliveryThreshold = 1999,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [isFullSizeOpen, setIsFullSizeOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [reviewsCount, setReviewsCount] = useState<number>(product?.reviewCount || 0);
  const [displayRating, setDisplayRating] = useState<number>(product?.rating || 4.8);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Synchronize state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0]);
      setSelectedColor(product.colors?.[0]);
      setSelectedImageIndex(0);
      setIsFullSizeOpen(false);
      setZoomScale(1);
      setActiveTab('details');
      setReviewsCount(product.reviewCount);
      setDisplayRating(product.rating);
    }
  }, [product]);

  // Dynamic SEO Tags & OpenGraph Meta & JSON-LD Injection for Product Page
  useEffect(() => {
    if (!product) return;

    const originalTitle = document.title;
    const metaDescriptionEl = document.querySelector('meta[name="description"]');
    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    const ogDescEl = document.querySelector('meta[property="og:description"]');
    const ogImageEl = document.querySelector('meta[property="og:image"]');
    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
    const twitterDescEl = document.querySelector('meta[name="twitter:description"]');
    const twitterImageEl = document.querySelector('meta[name="twitter:image"]');

    const originalDescription = metaDescriptionEl?.getAttribute('content') || '';
    const originalOgTitle = ogTitleEl?.getAttribute('content') || '';
    const originalOgDesc = ogDescEl?.getAttribute('content') || '';
    const originalOgImage = ogImageEl?.getAttribute('content') || '';
    const originalOgUrl = ogUrlEl?.getAttribute('content') || '';

    // Formulate rich dynamic SEO descriptions
    const productPageTitle = `${product.name} by ${product.brand} | Buy Online at ${formatRupees(product.price)} | Brand Bazaar`;
    const productMetaDesc = `Buy ${product.brand} ${product.name} online at ${formatRupees(product.price)} in India. ${product.description.slice(0, 110)}... Free express shipping, authentic luxury quality & 24-hour exchange verification.`;
    const productCanonicalUrl = `${window.location.origin}/?product=${encodeURIComponent(product.id)}`;

    // Update document & social tags
    document.title = productPageTitle;
    metaDescriptionEl?.setAttribute('content', productMetaDesc);
    ogTitleEl?.setAttribute('content', productPageTitle);
    ogDescEl?.setAttribute('content', productMetaDesc);
    ogImageEl?.setAttribute('content', product.image);
    ogUrlEl?.setAttribute('content', productCanonicalUrl);
    twitterTitleEl?.setAttribute('content', productPageTitle);
    twitterDescEl?.setAttribute('content', productMetaDesc);
    twitterImageEl?.setAttribute('content', product.image);

    // Inject dynamic Schema.org Product structured data (JSON-LD)
    let jsonLdScript = document.getElementById('product-schema-jsonld') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'product-schema-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }

    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: [product.image],
      description: product.description,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      category: product.category,
      offers: {
        '@type': 'Offer',
        url: productCanonicalUrl,
        priceCurrency: 'INR',
        price: product.price,
        priceValidUntil: '2026-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Brand Bazaar',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    };

    jsonLdScript.textContent = JSON.stringify(productSchema);

    // Revert SEO tags when modal closes or unmounts
    return () => {
      document.title = originalTitle;
      if (metaDescriptionEl) metaDescriptionEl.setAttribute('content', originalDescription);
      if (ogTitleEl) ogTitleEl.setAttribute('content', originalOgTitle);
      if (ogDescEl) ogDescEl.setAttribute('content', originalOgDesc);
      if (ogImageEl) ogImageEl.setAttribute('content', originalOgImage);
      if (ogUrlEl) ogUrlEl.setAttribute('content', originalOgUrl);
      if (twitterTitleEl) twitterTitleEl.setAttribute('content', originalOgTitle);
      if (twitterDescEl) twitterDescEl.setAttribute('content', originalOgDesc);
      if (twitterImageEl) twitterImageEl.setAttribute('content', originalOgImage);

      const existingScript = document.getElementById('product-schema-jsonld');
      if (existingScript) existingScript.remove();
    };
  }, [product]);

  // Handle ESC key to close full size or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullSizeOpen) {
          setIsFullSizeOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullSizeOpen, onClose]);

  if (!product) return null;

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const currentPhoto = gallery[selectedImageIndex] || product.image;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const shareUrl = `${window.location.origin}/?product=${encodeURIComponent(product.id)}`;
  const shareTitle = `Check out ${product.name} by ${product.brand} on Brand Bazaar for ${formatRupees(product.price)}!`;

  const handleNativeShareOrCopy = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.brand} - ${product.name}`,
          text: shareTitle,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to copy link
      }
    }
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareToWhatsapp = () => {
    const text = encodeURIComponent(`${shareTitle}\n\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(shareTitle);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareToPinterest = () => {
    const url = encodeURIComponent(shareUrl);
    const media = encodeURIComponent(product.image);
    const desc = encodeURIComponent(shareTitle);
    window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${desc}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row">
          {/* Top Controls: Close and Social Share */}
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:text-indigo-600 shadow-md transition-colors"
                title="Share Product Card"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Social Share Popover Card */}
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 space-y-2 z-20 animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
                    Share Product Card
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={shareToWhatsapp}
                      className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <span>💬 WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={shareToTwitter}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <span>𝕏 Twitter</span>
                    </button>
                    <button
                      type="button"
                      onClick={shareToFacebook}
                      className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <span>Facebook</span>
                    </button>
                    <button
                      type="button"
                      onClick={shareToPinterest}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <span>Pinterest</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleNativeShareOrCopy}
                    className="w-full py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Copy Product Link</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Product Image Viewer & Gallery Thumbnails */}
          <div className="md:w-1/2 flex flex-col bg-slate-100 dark:bg-slate-800">
            <div
              onClick={() => setIsFullSizeOpen(true)}
              className="relative flex-1 group cursor-zoom-in overflow-hidden min-h-[280px] md:min-h-[380px]"
              title="Click to view full size image"
            >
              <img
                src={currentPhoto}
                alt={product.name}
                className="w-full h-72 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Click to expand overlay hint */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-black/75 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xl backdrop-blur-xs">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click to View Full Size</span>
                </span>
              </div>

              {/* Next/Prev Gallery Flip Arrows */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white shadow-lg backdrop-blur-xs transition-transform active:scale-90 z-10"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white shadow-lg backdrop-blur-xs transition-transform active:scale-90 z-10"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.badge && (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
                    {product.badge}
                  </span>
                )}
                {discountPercent && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/90 text-white backdrop-blur-xs">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnail Bar (Shows all uploaded images!) */}
            {gallery.length > 1 && (
              <div className="p-2.5 bg-slate-200/80 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-center space-x-2 overflow-x-auto">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      idx === selectedImageIndex
                        ? 'border-indigo-600 ring-2 ring-indigo-500/40 opacity-100 scale-105 shadow-md'
                        : 'border-slate-300 dark:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Tabs */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between max-h-[85vh] overflow-hidden">
            {/* Header Tabs: Details vs Reviews */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
              <div className="flex space-x-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`pb-1 transition-all border-b-2 ${
                    activeTab === 'details'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Product Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-1 transition-all border-b-2 flex items-center space-x-1 ${
                    activeTab === 'reviews'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span>Customer Reviews</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500">
                    {reviewsCount}
                  </span>
                </button>
              </div>
            </div>

            {activeTab === 'details' ? (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <span>{product.brand}</span>
                    <span>&bull;</span>
                    <span>{product.category}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {product.name}
                  </h2>

                  {/* Rating Line - Click to open reviews tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className="flex items-center space-x-2 text-left hover:opacity-80 transition-opacity group"
                    title="Click to view customer feedback"
                  >
                    <div className="flex items-center text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-sm font-bold">{displayRating}</span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                      ({reviewsCount} customer reviews &bull; 98% positive)
                    </span>
                  </button>

                  {/* Price in Rupees */}
                  <div className="flex items-baseline space-x-3 pt-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {formatRupees(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatRupees(product.originalPrice)}
                      </span>
                    )}
                    {product.inStock ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        In Stock ({product.stockCount} left)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-500">Out of Stock</span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Highlights / Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-xs font-semibold text-slate-500">Key Highlights:</span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {product.features.map((feat, i) => (
                          <li key={i} className="flex items-center space-x-1.5">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-xs font-semibold text-slate-500">Select Size:</span>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                              selectedSize === size
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-xs font-semibold text-slate-500">Select Color:</span>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-7 h-7 rounded-full border-2 transition-transform ${
                              selectedColor === color
                                ? 'scale-110 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900'
                                : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Free Shipping Eligibility Callout */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>
                        {freeDeliveryThreshold === 0 ? (
                          <strong className="text-emerald-600">FREE Express Delivery on all orders!</strong>
                        ) : product.price >= freeDeliveryThreshold ? (
                          <>
                            Eligible for <strong className="text-emerald-600">FREE Express Delivery</strong> on this order!
                          </>
                        ) : (
                          <>
                            Free Express Delivery on orders above <strong className="text-slate-900 dark:text-white">{formatRupees(freeDeliveryThreshold)}</strong>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Estimated Dispatch: 1 Business Day</span>
                    </div>
                  </div>

                  {/* Quick Customer Feedback Strip */}
                  <div
                    onClick={() => setActiveTab('reviews')}
                    className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between cursor-pointer hover:bg-amber-500/15 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {displayRating}★
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Loved by {reviewsCount}+ customers across India
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Click to read verified photos &amp; feedback
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                      Read reviews &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: CUSTOMER REVIEWS & RATINGS */
              <div className="flex-1 overflow-y-auto pr-1">
                <ProductReviewsSection
                  product={product}
                  primaryColor={primaryColor}
                  onReviewsUpdated={(count, avg) => {
                    setReviewsCount(count);
                    setDisplayRating(avg);
                  }}
                />
              </div>
            )}

            {/* Sticky Action Row & Add to Bag */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 shrink-0 bg-white/95 dark:bg-slate-900/95">
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2 hover:opacity-95"
                  style={{ backgroundColor: added ? '#059669' : primaryColor || '#4f46e5' }}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag &bull; {formatRupees(product.price)}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isWishlisted
                      ? 'border-rose-300 bg-rose-50 text-rose-500'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleNativeShareOrCopy}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Share Link"
                >
                  {copiedLink ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-3.5 h-3.5 mb-0.5 text-slate-500" />
                  <span>Express Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-3.5 h-3.5 mb-0.5 text-indigo-500" />
                  <span>Easy Exchange</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mb-0.5 text-slate-500" />
                  <span>100% Authentic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL SIZE IMAGE LIGHTBOX POPUP MODAL */}
      {isFullSizeOpen && (
        <div className="fixed inset-0 z-60 flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Dimmed Lightbox Backdrop */}
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity"
            onClick={() => setIsFullSizeOpen(false)}
          />

          {/* Lightbox Navigation Header */}
          <div className="relative z-10 w-full max-w-5xl flex items-center justify-between pb-3 text-white">
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                {product.brand}
              </span>
              <span className="text-slate-600">&bull;</span>
              <h3 className="font-extrabold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                {product.name}
              </h3>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold text-amber-300">
                {formatRupees(product.price)}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomScale((prev) => Math.min(prev + 0.25, 2.5))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomScale((prev) => Math.max(prev - 0.25, 0.75))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                title="Reset Zoom"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <button
                onClick={() => setIsFullSizeOpen(false)}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors ml-2"
                title="Close Full Size"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Size Image Display */}
          <div
            className="relative z-10 max-w-5xl max-h-[80vh] w-full flex items-center justify-center overflow-auto p-2"
            onClick={() => setIsFullSizeOpen(false)}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ transform: `scale(${zoomScale})` }}
              className="max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-200 cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Footer note */}
          <div className="relative z-10 pt-3 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
            <span>High-Resolution Photo View &bull; Click anywhere outside to close or press ESC</span>
          </div>
        </div>
      )}
    </>
  );
};
