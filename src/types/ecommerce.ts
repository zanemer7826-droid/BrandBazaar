export interface TechnicalSpec {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  brand: string;
  category: 'Fashion' | 'Footwear' | 'Electronics' | 'Accessories' | 'Beauty' | 'Home & Living';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  lowStockThreshold?: number;
  image: string;
  images?: string[];
  description: string;
  badge?: 'HOT' | 'SALE' | 'NEW' | 'LIMITED' | 'BESTSELLER';
  tags?: string[];
  features: string[];
  sizes?: string[];
  colors?: string[];
  metaTitle?: string;
  metaDescription?: string;
  videoUrl?: string;
  relatedProductIds?: string[];
  technicalSpecs?: TechnicalSpec[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  product?: Product;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  couponCode?: string;
  shipping: number;
  tax: number;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  createdAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface PaymentGatewaySettings {
  upi: {
    enabled: boolean;
    upiId: string;
    merchantName: string;
    allowAutoVerify: boolean;
  };
  netbanking: {
    enabled: boolean;
    allowAllIndianBanks: boolean;
  };
  stripe: {
    enabled: boolean;
    publishableKey: string;
    secretKeyMasked: string;
    testMode: boolean;
  };
  cod: {
    enabled: boolean;
    extraFee: number;
  };
  shipping?: {
    freeDeliveryThreshold: number; // Order amount above which delivery is free (₹)
    standardShippingFee: number; // Standard delivery fee for orders below threshold (₹)
  };
  freeDeliveryThreshold?: number; // Order amount above which delivery is free (₹)
  standardShippingFee?: number; // Standard delivery fee for orders below threshold (₹)
  currency: string;
  currencySymbol: string;
}

export interface StoreBrandingSettings {
  storeName: string;
  storeTagline: string;
  logoType: 'letter' | 'image';
  logoText: string;
  logoImageUrl: string;
  primaryColor: string;
  freeDeliveryThreshold?: number;
  standardShippingFee?: number;
}

export type CategoryFilter = 'All' | 'Fashion' | 'Footwear' | 'Electronics' | 'Accessories' | 'Beauty' | 'Home & Living';
export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  isVip: boolean;
  vipSince?: string;
  avatar?: string;
  loginMethod: 'mobile_otp' | 'email_otp';
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  city?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  recommended: boolean;
  tag?: string;
}

export interface CouponOffer {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  description: string;
  enabled: boolean;
  tag?: string;
}

export interface FlashSaleOfferSettings {
  enabled: boolean;
  badgeTitle: string;
  discountHeadline: string;
  description: string;
  timerDurationHours: number;
  ctaText: string;
  targetCategory: CategoryFilter;
  announcementTag: string;
  announcementText: string;
  showAnnouncementBar: boolean;
}

export interface PromotionalBannerOffer {
  id: string;
  title: string;
  subtitle: string;
  highlightText: string;
  discountBadge: string;
  category: CategoryFilter;
  enabled: boolean;
}

export interface StoreOffersSettings {
  flashSale: FlashSaleOfferSettings;
  coupons: CouponOffer[];
  promotions: PromotionalBannerOffer[];
}

