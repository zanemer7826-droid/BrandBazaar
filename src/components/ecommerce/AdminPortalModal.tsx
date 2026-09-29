import React, { useState, useRef } from 'react';
import {
  X,
  Lock,
  Plus,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  Trash2,
  Edit3,
  LogOut,
  ShieldCheck,
  Eye,
  CreditCard,
  Upload,
  Image as ImageIcon,
  Key,
  Settings,
  Check,
  RefreshCw,
  Globe,
  Sliders,
  Palette,
  Layers,
  Grid,
  List,
  Star,
  Building2,
  Tag,
  Flame,
  Percent,
  Timer,
  Gift,
  ArrowRight,
  Barcode,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

// Automated SKU Generator Utility based on Category, Brand, Name, Size, and Random Unique Suffix
export const generateAutomatedSKU = (
  category: string,
  brand: string,
  name: string,
  sizes?: string
): string => {
  const catMap: Record<string, string> = {
    'Fashion': 'FSH',
    'Footwear': 'FTW',
    'Electronics': 'ELE',
    'Accessories': 'ACC',
    'Beauty': 'BTY',
    'Home & Living': 'HML',
  };
  const catCode = catMap[category] || (category ? category.substring(0, 3).toUpperCase() : 'GEN');

  const cleanBrand = (brand || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const brandCode = cleanBrand.length >= 3 ? cleanBrand.substring(0, 4) : (cleanBrand || 'BRD').padEnd(3, 'X');

  const cleanName = (name || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const nameCode = cleanName.length >= 3 ? cleanName.substring(0, 3) : (cleanName || 'PRD').padEnd(3, 'X');

  let sizeCode = 'STD';
  if (sizes && sizes.trim()) {
    const firstSize = sizes.split(',')[0].trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (firstSize) {
      sizeCode = firstSize.substring(0, 4);
    }
  }

  // Generate random 6-character unique identifier suffix: 3 letters + 3 digits (e.g. "XYZ123")
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let randLetters = '';
  for (let i = 0; i < 3; i++) {
    randLetters += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  let randDigits = '';
  for (let i = 0; i < 3; i++) {
    randDigits += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  const uniqueSuffix = `${randLetters}${randDigits}`; // e.g., "XYZ123"

  return `${catCode}-${brandCode}-${nameCode}-${sizeCode}-${uniqueSuffix}`;
};

export const COLOR_PRESETS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Gold', hex: '#D97706' },
  { name: 'Crimson', hex: '#DC2626' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Silver', hex: '#94A3B8' },
  { name: 'Rose Gold', hex: '#F43F5E' },
  { name: 'Beige', hex: '#D97706' },
  { name: 'Purple', hex: '#7C3AED' },
  { name: 'Slate', hex: '#475569' },
  { name: 'Pink', hex: '#EC4899' },
];

export const SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43', 'Free Size'];
import {
  Product,
  Order,
  PaymentGatewaySettings,
  StoreBrandingSettings,
  CategoryFilter,
  StoreOffersSettings,
  CouponOffer,
  TechnicalSpec,
} from '../../types/ecommerce';
import { formatRupees } from '../../utils/currency';
import { INDIAN_BANKS } from '../../data/indianBanks';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct?: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateOrderTracking: (orderId: string, trackingNumber: string) => void;
  gatewaySettings: PaymentGatewaySettings;
  onUpdateGatewaySettings: (settings: PaymentGatewaySettings) => void;
  branding: StoreBrandingSettings;
  onUpdateBranding: (branding: StoreBrandingSettings) => void;
  primaryColor: string;
  offers?: StoreOffersSettings;
  onUpdateOffers?: (offers: StoreOffersSettings) => void;
  vipMembers?: Array<{ phone: string; countryCode: string; date: string; code: string }>;
}

const LOGO_PRESETS = [
  {
    name: 'Royal Monogram Crest',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    description: 'Gold & black luxury crest',
  },
  {
    name: 'Minimalist Diamond Shield',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
    description: 'Sleek monochrome geometry',
  },
  {
    name: 'Neon Cyber Crown',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=80',
    description: 'Vibrant futuristic emblem',
  },
  {
    name: 'Platinum Heritage Lion',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=300&q=80',
    description: 'Fine jewelry brand seal',
  },
];

const COLOR_PALETTES = [
  { name: 'Indigo Prestige', hex: '#4f46e5' },
  { name: 'Crimson Luxury', hex: '#e11d48' },
  { name: 'Emerald Oasis', hex: '#059669' },
  { name: 'Imperial Amber', hex: '#d97706' },
  { name: 'Midnight Sapphire', hex: '#2563eb' },
  { name: 'Cyber Violet', hex: '#7c3aed' },
  { name: 'Onyx Noir', hex: '#0f172a' },
];

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateOrderTracking,
  gatewaySettings,
  onUpdateGatewaySettings,
  branding,
  onUpdateBranding,
  primaryColor,
  offers,
  onUpdateOffers,
  vipMembers = [],
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Tab: 'overview' | 'orders' | 'products' | 'add-product' | 'edit-product' | 'offers' | 'gateways' | 'branding' | 'vip-members'
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'add-product' | 'edit-product' | 'offers' | 'gateways' | 'branding' | 'vip-members'
  >('overview');

  // Filter & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<'All' | CategoryFilter>('All');
  const [productStockFilter, setProductStockFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [productViewMode, setProductViewMode] = useState<'catalogue' | 'table'>('catalogue');
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);

  // Product Image source mode: 'upload' vs 'url'
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Product Image mode
  const [editImageMode, setEditImageMode] = useState<'upload' | 'url'>('upload');
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Logo upload mode: 'upload' vs 'url' vs 'presets'
  const [logoUploadMode, setLogoUploadMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // New Product Form state
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    brand: '',
    category: 'Fashion' as Product['category'],
    price: 4999,
    originalPrice: 6999,
    rating: 4.8,
    reviewCount: 15,
    inStock: true,
    stockCount: 25,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    images: [] as string[],
    description: '',
    badge: 'NEW' as Product['badge'],
    features: 'Premium material, Handcrafted quality, 1-year warranty',
    colors: 'Black, White, Slate',
    sizes: 'S, M, L, XL',
    metaTitle: '',
    metaDescription: '',
    videoUrl: '',
    relatedProductIds: [] as string[],
    technicalSpecs: [] as TechnicalSpec[],
  });

  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editSuccessMessage, setEditSuccessMessage] = useState('');

  // AI Product Description Generator state via Gemini
  const [isGeneratingAiDescription, setIsGeneratingAiDescription] = useState(false);
  const [aiDescSuccessMsg, setAiDescSuccessMsg] = useState('');

  const exportOrdersToCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Status', 'Total', 'Payment Method', 'Tracking Number'];
    const csvData = orders.map(o => [
      o.id,
      new Date(o.createdAt).toLocaleDateString(),
      o.customer.fullName,
      o.customer.email,
      o.status,
      o.total,
      o.paymentMethod,
      o.trackingNumber || ''
    ]);

    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Low Stock Configurable Threshold state
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bb_low_stock_threshold');
      return saved ? Number(saved) : 10;
    } catch {
      return 10;
    }
  });

  const handleSaveLowStockThreshold = (val: number) => {
    const num = Math.max(1, Number(val) || 10);
    setLowStockThreshold(num);
    try {
      localStorage.setItem('bb_low_stock_threshold', String(num));
    } catch {}
  };

  // Local settings draft for Payment Gateways & Shipping
  const [localGateways, setLocalGateways] = useState<PaymentGatewaySettings>(() => ({
    ...gatewaySettings,
    freeDeliveryThreshold: gatewaySettings.freeDeliveryThreshold ?? (gatewaySettings.shipping?.freeDeliveryThreshold ?? 1999),
    standardShippingFee: gatewaySettings.standardShippingFee ?? (gatewaySettings.shipping?.standardShippingFee ?? 199),
    upi: gatewaySettings.upi || {
      enabled: true,
      upiId: 'brandbazaar@icici',
      merchantName: 'Brand Bazaar Flagship',
      allowAutoVerify: true,
    },
    netbanking: gatewaySettings.netbanking || {
      enabled: true,
      allowAllIndianBanks: true,
    },
  }));
  const [gatewaySavedMessage, setGatewaySavedMessage] = useState(false);

  // Local settings draft for Branding & Logo
  const [localBranding, setLocalBranding] = useState<StoreBrandingSettings>(branding);
  const [brandingSavedMessage, setBrandingSavedMessage] = useState(false);

  // Local settings draft for Offers & Promotions
  const [localOffers, setLocalOffers] = useState<StoreOffersSettings>(() => {
    if (offers) return offers;
    return {
      flashSale: {
        enabled: true,
        badgeTitle: '⚡ LIMITED TIME FLASH SALE',
        discountHeadline: 'EXTRA 20% OFF',
        description: 'Luxury catalog prices slashed for a limited window. Free Pan-India express delivery included.',
        timerDurationHours: 24,
        ctaText: 'Claim Deal',
        targetCategory: 'All',
        announcementTag: 'SEASON SALE',
        announcementText: 'Enjoy 20% off on all luxury accessories & free global express shipping!',
        showAnnouncementBar: true,
      },
      coupons: [
        {
          id: 'cpn-1',
          code: 'BAZAAR-VIP15',
          discountType: 'percentage',
          discountValue: 15,
          minSpend: 1999,
          description: 'Exclusive 15% VIP shopper instant discount on luxury catalog',
          enabled: true,
          tag: 'VIP EXCLUSIVE',
        },
        {
          id: 'cpn-2',
          code: 'WELCOME20',
          discountType: 'percentage',
          discountValue: 20,
          minSpend: 2999,
          description: 'First order grand welcome coupon with extra 20% savings',
          enabled: true,
          tag: 'FIRST ORDER',
        },
        {
          id: 'cpn-3',
          code: 'FESTIVE500',
          discountType: 'fixed',
          discountValue: 500,
          minSpend: 4999,
          description: 'Flat ₹500 off on festive collection purchases over ₹4,999',
          enabled: true,
          tag: 'FESTIVE SPECIAL',
        },
      ],
      promotions: [],
    };
  });
  const [offersSavedMessage, setOffersSavedMessage] = useState(false);

  // New Coupon Form state
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 20,
    minSpend: 2999,
    description: '',
    tag: 'LIMITED OFFER',
  });

  // Edit Coupon Modal state
  const [editingCoupon, setEditingCoupon] = useState<CouponOffer | null>(null);

  // AI Image Prompt State
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isAiEditingImage, setIsAiEditingImage] = useState(false);
  const [aiEditSuccessMsg, setAiEditSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Handle Admin Password Verification (Default: "admin123" or "bazaar2026")
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123' || passwordInput === 'bazaar2026' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. (Hint: use "admin123" or "bazaar2026")');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setActiveTab('overview');
  };

  // Handle local image file upload (supports multiple files concurrently) for New Product
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((f) => {
      if (f.size > 5 * 1024 * 1024) {
        alert(`File ${f.name} exceeds 5MB limit. Please choose a smaller photo.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    Promise.all(
      validFiles.map((file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      )
    ).then((newResults) => {
      setNewProduct((prev) => {
        const isDefaultPlaceholder =
          typeof prev.image === 'string' && prev.image.includes('photo-1523275335684-37898b6baf30');
        const existingImages = isDefaultPlaceholder
          ? []
          : prev.images && prev.images.length > 0
          ? prev.images
          : prev.image
          ? [prev.image]
          : [];

        const combined = [...existingImages, ...newResults];
        return {
          ...prev,
          image: combined[0],
          images: combined,
        };
      });
      // Reset file input value so same files can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  // Handle local image file upload (supports multiple files concurrently) for Edit Product
  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((f) => {
      if (f.size > 5 * 1024 * 1024) {
        alert(`File ${f.name} exceeds 5MB limit. Please choose a smaller photo.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    Promise.all(
      validFiles.map((file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      )
    ).then((newResults) => {
      setEditingProduct((prev) => {
        if (!prev) return null;
        const isDefaultPlaceholder =
          typeof prev.image === 'string' && prev.image.includes('photo-1523275335684-37898b6baf30');
        const existingImages = isDefaultPlaceholder
          ? []
          : prev.images && prev.images.length > 0
          ? prev.images
          : prev.image
          ? [prev.image]
          : [];

        const combined = [...existingImages, ...newResults];
        return {
          ...prev,
          image: combined[0],
          images: combined,
        };
      });
      if (editFileInputRef.current) editFileInputRef.current.value = '';
    });
  };

  // AI Image Editor Handler using Gemini
  const handleAiEditImage = async (target: 'new' | 'edit') => {
    if (!aiPromptInput.trim()) return;
    setIsAiEditingImage(true);
    setAiEditSuccessMsg('');

    try {
      const productName = target === 'new' ? newProduct.name : editingProduct?.name;
      const currentImage = target === 'new' ? newProduct.image : editingProduct?.image;

      const res = await fetch('/api/ai-edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPromptInput,
          image: currentImage,
          productName,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        if (target === 'new') {
          setNewProduct((prev) => {
            const currentImages = prev.images && prev.images.length > 0 ? prev.images : (prev.image ? [prev.image] : []);
            const nextImages = [data.imageUrl, ...currentImages];
            return {
              ...prev,
              image: data.imageUrl,
              images: nextImages,
            };
          });
        } else {
          setEditingProduct((prev) => {
            if (!prev) return null;
            const currentImages = prev.images && prev.images.length > 0 ? prev.images : (prev.image ? [prev.image] : []);
            const nextImages = [data.imageUrl, ...currentImages];
            return {
              ...prev,
              image: data.imageUrl,
              images: nextImages,
            };
          });
        }
        setAiEditSuccessMsg(`✨ AI Image Generated! (${data.enhancedQuery || 'Studio Lighting'})`);
        setAiPromptInput('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiEditingImage(false);
    }
  };

  // AI Product Description Generator Handler using Gemini
  const handleGenerateAiDescription = async (target: 'new' | 'edit') => {
    setIsGeneratingAiDescription(true);
    setAiDescSuccessMsg('');

    try {
      const productName = target === 'new' ? newProduct.name : editingProduct?.name;
      const brand = target === 'new' ? newProduct.brand : editingProduct?.brand;
      const category = target === 'new' ? newProduct.category : editingProduct?.category;
      const imageUrl = target === 'new' ? newProduct.image : editingProduct?.image;

      const res = await fetch('/api/ai-generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          brand,
          category,
          imageUrl,
          additionalPrompt: 'Generate a high-converting, attractive e-commerce description with key feature highlights based on the uploaded product image',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const descText = data.data.fullMarkdown || data.data.description;
        if (target === 'new') {
          setNewProduct((prev) => ({
            ...prev,
            description: descText,
            features: data.data.bulletPoints && data.data.bulletPoints.length > 0
              ? data.data.bulletPoints.join(', ')
              : prev.features,
          }));
        } else {
          setEditingProduct((prev) => (prev ? {
            ...prev,
            description: descText,
            features: data.data.bulletPoints && data.data.bulletPoints.length > 0
              ? data.data.bulletPoints.join(', ')
              : prev.features,
          } : null));
        }
        setAiDescSuccessMsg('✨ AI Product Description generated from uploaded photo & details via Gemini!');
        setTimeout(() => setAiDescSuccessMsg(''), 6000);
      } else {
        setAiDescSuccessMsg(`⚠️ Could not generate: ${data.error || 'Please try again.'}`);
      }
    } catch (err: any) {
      console.error('[AI Description Generator Error]:', err);
      setAiDescSuccessMsg(`⚠️ Connection error: ${err?.message || 'Failed to generate description.'}`);
    } finally {
      setIsGeneratingAiDescription(false);
    }
  };

  // Handle local image file upload for Store Logo
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo file size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLocalBranding((prev) => ({
          ...prev,
          logoType: 'image',
          logoImageUrl: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.brand || !newProduct.price) {
      return;
    }

    const finalSku = (newProduct.sku && newProduct.sku.trim()) || generateAutomatedSKU(
      newProduct.category,
      newProduct.brand,
      newProduct.name,
      newProduct.sizes
    );

    onAddProduct({
      sku: finalSku,
      name: newProduct.name,
      brand: newProduct.brand,
      category: newProduct.category,
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
      rating: Number(newProduct.rating) || 4.8,
      reviewCount: Number(newProduct.reviewCount) || 10,
      inStock: newProduct.inStock,
      stockCount: Number(newProduct.stockCount) || 20,
      lowStockThreshold: Number(newProduct.lowStockThreshold) || 10,
      image: newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      images: newProduct.images && newProduct.images.length > 0 ? newProduct.images : [newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      description: newProduct.description || `${newProduct.name} by ${newProduct.brand}.`,
      badge: newProduct.badge,
      features: newProduct.features.split(',').map((f) => f.trim()).filter(Boolean),
      colors: newProduct.colors ? newProduct.colors.split(',').map((c) => c.trim()).filter(Boolean) : undefined,
      sizes: newProduct.sizes ? newProduct.sizes.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      metaTitle: newProduct.metaTitle || undefined,
      metaDescription: newProduct.metaDescription || undefined,
      videoUrl: newProduct.videoUrl || undefined,
      relatedProductIds: newProduct.relatedProductIds,
      technicalSpecs: newProduct.technicalSpecs,
    });

    setFormSuccessMessage(`Product "${newProduct.name}" added successfully! (SKU: ${finalSku})`);
    setTimeout(() => {
      setFormSuccessMessage('');
      setActiveTab('products');
    }, 1200);

    // Reset fields
    setNewProduct({
      sku: '',
      name: '',
      brand: '',
      category: 'Fashion',
      price: 4999,
      originalPrice: 6999,
      rating: 4.8,
      reviewCount: 15,
      inStock: true,
      stockCount: 25,
      lowStockThreshold: 10,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      images: [],
      description: '',
      badge: 'NEW',
      features: 'Premium material, Handcrafted quality, 1-year warranty',
      colors: 'Black, White, Slate',
      sizes: 'S, M, L, XL',
      metaTitle: '',
      metaDescription: '',
      videoUrl: '',
      relatedProductIds: [],
      technicalSpecs: [],
    });
  };

  const handleSaveGatewaySettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGatewaySettings(localGateways);
    setGatewaySavedMessage(true);
    setTimeout(() => setGatewaySavedMessage(false), 2500);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBranding(localBranding);
    setBrandingSavedMessage(true);
    setTimeout(() => setBrandingSavedMessage(false), 2500);
  };

  const handleSaveOffers = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateOffers) {
      onUpdateOffers(localOffers);
    }
    setOffersSavedMessage(true);
    setTimeout(() => setOffersSavedMessage(false), 2500);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    const coupon: CouponOffer = {
      id: `cpn-${Date.now()}`,
      code: newCoupon.code.trim().toUpperCase(),
      discountType: newCoupon.discountType,
      discountValue: Number(newCoupon.discountValue) || 10,
      minSpend: Number(newCoupon.minSpend) || 0,
      description: newCoupon.description.trim() || `${newCoupon.discountValue}% special promotional discount`,
      enabled: true,
      tag: newCoupon.tag.trim().toUpperCase() || 'SPECIAL OFFER',
    };

    const updatedCoupons = [coupon, ...localOffers.coupons];
    const updated = { ...localOffers, coupons: updatedCoupons };
    setLocalOffers(updated);
    if (onUpdateOffers) onUpdateOffers(updated);

    // Reset new coupon form
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: 20,
      minSpend: 2999,
      description: '',
      tag: 'LIMITED OFFER',
    });
  };

  const handleToggleCoupon = (couponId: string) => {
    const updatedCoupons = localOffers.coupons.map((c) =>
      c.id === couponId ? { ...c, enabled: !c.enabled } : c
    );
    const updated = { ...localOffers, coupons: updatedCoupons };
    setLocalOffers(updated);
    if (onUpdateOffers) onUpdateOffers(updated);
  };

  const handleDeleteCoupon = (couponId: string) => {
    const updatedCoupons = localOffers.coupons.filter((c) => c.id !== couponId);
    const updated = { ...localOffers, coupons: updatedCoupons };
    setLocalOffers(updated);
    if (onUpdateOffers) onUpdateOffers(updated);
  };

  const handleStartEditCoupon = (coupon: CouponOffer) => {
    setEditingCoupon({ ...coupon });
  };

  const handleCancelEditCoupon = () => {
    setEditingCoupon(null);
  };

  const handleSaveCouponEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon || !editingCoupon.code.trim()) return;

    const updatedCoupons = localOffers.coupons.map((c) =>
      c.id === editingCoupon.id
        ? {
            ...editingCoupon,
            code: editingCoupon.code.trim().toUpperCase(),
            discountValue: Number(editingCoupon.discountValue) || 0,
            minSpend: Number(editingCoupon.minSpend) || 0,
            description: editingCoupon.description.trim(),
            tag: editingCoupon.tag?.trim().toUpperCase(),
          }
        : c
    );

    const updated = { ...localOffers, coupons: updatedCoupons };
    setLocalOffers(updated);
    if (onUpdateOffers) onUpdateOffers(updated);
    setEditingCoupon(null);
    setOffersSavedMessage(true);
    setTimeout(() => setOffersSavedMessage(false), 2500);
  };

  // Calculations for overview stats
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length;
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stockCount, 0);
  const totalCatalogueValue = products.reduce((sum, p) => sum + p.price * p.stockCount, 0);
  const lowStockCount = products.filter((p) => p.stockCount > 0 && p.stockCount < lowStockThreshold).length;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = products.filter((p) => {
    const q = productSearch.trim().toLowerCase();
    const productSku = p.sku ? p.sku.toLowerCase() : `sku-${p.id.toLowerCase()}`;
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      productSku.includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.badge && p.badge.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));

    const matchesCategory =
      productCategoryFilter === 'All' || p.category === productCategoryFilter;

    let matchesStock = true;
    if (productStockFilter === 'IN_STOCK') matchesStock = p.stockCount > 0;
    if (productStockFilter === 'LOW_STOCK') matchesStock = p.stockCount > 0 && p.stockCount < lowStockThreshold;
    if (productStockFilter === 'OUT_OF_STOCK') matchesStock = p.stockCount === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  {localBranding.storeName || 'Brand Bazaar'} Management Portal
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {isAuthenticated ? 'AUTHORIZED SESSION' : 'PROTECTED'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Products, inventory, order fulfillment, payment gateways &amp; logo branding
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1.5"
                title="Logout from Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* IF NOT AUTHENTICATED -> PASSWORD GATE */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Enter Admin Portal Password
              </h3>
              <p className="text-xs text-slate-500">
                Access product inventory management, stock controls, payment gateway keys, customer orders, and store logo branding.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter admin password (e.g. admin123)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {authError && (
                <div className="text-xs text-rose-500 font-medium text-left">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition-all"
                style={{ backgroundColor: primaryColor || '#4f46e5' }}
              >
                Unlock Admin Dashboard
              </button>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                <strong>Default Passwords:</strong> <code>admin123</code> or <code>bazaar2026</code>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN CONSOLE */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex items-center space-x-1 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold pt-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Overview &amp; Metrics</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Customer Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Products &amp; Catalogue ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('add-product')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'add-product'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                  + Add New Product
                </span>
              </button>

              <button
                onClick={() => setActiveTab('offers')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'offers'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-600 dark:text-rose-400 font-extrabold">
                  Offers &amp; Flash Sales
                </span>
              </button>

              <button
                onClick={() => setActiveTab('gateways')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'gateways'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                  Payment Gateways
                </span>
              </button>

              <button
                onClick={() => setActiveTab('vip-members')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'vip-members'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                  VIP Club Members ({vipMembers.length})
                </span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: OVERVIEW METRICS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                      <div className="text-xs text-slate-400 font-medium">Total Gross Revenue</div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {formatRupees(totalRevenue)}
                      </div>
                      <div className="text-[11px] text-emerald-500 font-semibold mt-1">
                        +24.5% this month
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                      <div className="text-xs text-slate-400 font-medium">Orders Placed</div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {orders.length}
                      </div>
                      <div className="text-[11px] text-indigo-500 font-semibold mt-1">
                        {pendingOrdersCount} pending fulfillment
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                      <div className="text-xs text-slate-400 font-medium">Active Products</div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {products.length}
                      </div>
                      <div className="text-[11px] text-amber-500 font-semibold mt-1">
                        {totalInventoryUnits} units in stock
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                      <div className="text-xs text-slate-400 font-medium">Current Store Logo</div>
                      <div className="flex items-center space-x-2 mt-2">
                        {localBranding.logoType === 'image' && localBranding.logoImageUrl ? (
                          <img
                            src={localBranding.logoImageUrl}
                            alt="Logo preview"
                            className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm"
                            style={{ backgroundColor: localBranding.primaryColor || '#4f46e5' }}
                          >
                            {localBranding.logoText || 'B'}
                          </div>
                        )}
                        <span className="text-xs font-bold truncate">
                          {localBranding.storeName || 'Brand Bazaar'}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab('branding')}
                        className="text-[11px] text-indigo-500 font-semibold hover:underline mt-1 block"
                      >
                        Change logo &amp; theme &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Recent Orders quick table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Recent Fulfillment Orders
                      </h3>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View all orders &rarr;
                      </button>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Payment</th>
                            <th className="p-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {orders.slice(0, 4).map((ord) => (
                            <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                              <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                                {ord.id}
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                  {ord.customer.fullName}
                                </div>
                                <div className="text-[10px] text-slate-400">{ord.customer.email}</div>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  ord.status === 'DELIVERED'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                    : ord.status === 'PROCESSING'
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
                                    : ord.status === 'SHIPPED'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="p-3 text-slate-500">{ord.paymentMethod}</td>
                              <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                                {formatRupees(ord.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search orders, customers, email..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto text-xs">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 font-medium">Status:</span>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none"
                      >
                        <option value="ALL">All Statuses ({orders.length})</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                    <button
                        onClick={exportOrdersToCSV}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-1.5"
                      >
                        <span>Export CSV</span>
                      </button>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-3">Order Details</th>
                          <th className="p-3">Customer &amp; Shipping</th>
                          <th className="p-3">Items Purchased</th>
                          <th className="p-3">Status &amp; Action</th>
                          <th className="p-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">
                              No customer orders matched your criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                              <td className="p-3 align-top">
                                <div className="font-mono font-bold text-slate-900 dark:text-white">
                                  {ord.id}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  {new Date(ord.createdAt).toLocaleDateString()}
                                </div>
                                {ord.trackingNumber && (
                                  <div className="mt-1 text-[10px] text-indigo-500 font-mono">
                                    Track: {ord.trackingNumber}
                                  </div>
                                )}
                              </td>

                              <td className="p-3 align-top">
                                <div className="font-semibold text-slate-900 dark:text-white">
                                  {ord.customer.fullName}
                                </div>
                                <div className="text-[10px] text-slate-400">{ord.customer.email}</div>
                                <div className="text-[10px] text-slate-500 mt-1">
                                  {ord.customer.street}, {ord.customer.city}, {ord.customer.state} {ord.customer.zipCode}
                                </div>
                              </td>

                              <td className="p-3 align-top">
                                <div className="space-y-1">
                                  {ord.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 text-[11px]">
                                      <span className="font-bold text-slate-700 dark:text-slate-300">
                                        {item.quantity}x
                                      </span>
                                      <span className="truncate max-w-[160px] text-slate-800 dark:text-slate-200">
                                        {item.name || item.product?.name || 'Product'}
                                      </span>
                                      {item.selectedSize && (
                                        <span className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[9px]">
                                          {item.selectedSize}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </td>

                              <td className="p-3 align-top">
                                <select
                                  value={ord.status}
                                  onChange={(e) =>
                                    onUpdateOrderStatus(ord.id, e.target.value as Order['status'])
                                  }
                                  className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-[10px] focus:outline-none w-full"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="PROCESSING">PROCESSING</option>
                                  <option value="SHIPPED">SHIPPED</option>
                                  <option value="DELIVERED">DELIVERED</option>
                                  <option value="CANCELLED">CANCELLED</option>
                                </select>
                                {ord.status === 'SHIPPED' && (
                                  <input
                                    type="text"
                                    placeholder="Enter Tracking ID"
                                    defaultValue={ord.trackingNumber || ''}
                                    onBlur={(e) => {
                                      onUpdateOrderTracking(ord.id, e.target.value);
                                    }}
                                    className="mt-2 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] w-full"
                                  />
                                )}
                              </td>

                              <td className="p-3 align-top text-right">
                                <div className="font-extrabold text-slate-900 dark:text-white">
                                  {formatRupees(ord.total)}
                                </div>
                                <div className="text-[10px] text-slate-400">{ord.paymentMethod}</div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUCTS INVENTORY */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  {/* Low Stock Notification Alert Banner */}
                  {lowStockCount > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs sm:text-sm">
                            Low Stock Alert: {lowStockCount} {lowStockCount === 1 ? 'product is' : 'products are'} running low!
                          </h4>
                          <p className="text-[11px] text-amber-700 dark:text-amber-300">
                            Stock count has fallen below your configured threshold of <strong>{lowStockThreshold} units</strong>. Restock soon to prevent stockouts.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setProductStockFilter('LOW_STOCK')}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-xs transition-transform hover:scale-105"
                        >
                          View Low Stock Items ({lowStockCount})
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                      {/* Real-time Search Input with clear button */}
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search products by Name, SKU (e.g. SKU-PROD-01), Brand, or Category..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        />
                        {productSearch && (
                          <button
                            type="button"
                            onClick={() => setProductSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Add Product Button */}
                      <button
                        onClick={() => setActiveTab('add-product')}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center justify-center space-x-1.5 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Product</span>
                      </button>
                    </div>

                    {/* Filter Pills & Real-time Item Counter Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 pb-1 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">Filter Stock:</span>
                        <button
                          type="button"
                          onClick={() => setProductStockFilter('ALL')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            productStockFilter === 'ALL'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          All ({products.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductStockFilter('IN_STOCK')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            productStockFilter === 'IN_STOCK'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          In Stock ({products.filter((p) => p.stockCount > 0).length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductStockFilter('LOW_STOCK')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            productStockFilter === 'LOW_STOCK'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          Low Stock (&lt;{lowStockThreshold})
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductStockFilter('OUT_OF_STOCK')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            productStockFilter === 'OUT_OF_STOCK'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          Out of Stock ({products.filter((p) => p.stockCount === 0).length})
                        </button>
                      </div>

                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Showing <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredProducts.length}</strong> of <strong>{products.length}</strong> inventory items
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                    <div className="hidden sm:block">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-3">Product Name &amp; SKU</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Inventory</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {filteredProducts.map((p) => {
                            const skuDisplay = p.sku || `SKU-${p.id.toUpperCase()}`;
                            return (
                              <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                <td className="p-3 flex items-center space-x-3">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 dark:border-slate-700 shrink-0"
                                  />
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                                      <span>{p.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-0.5">
                                      <span>{p.brand}</span>
                                      <span>•</span>
                                      <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-[9px] text-indigo-600 dark:text-indigo-400 font-bold">
                                        {skuDisplay}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                                    {p.category}
                                  </span>
                                </td>
                                <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                                  {formatRupees(p.price)}
                                  {p.originalPrice && (
                                    <span className="ml-1 text-[10px] text-slate-400 line-through">
                                      {formatRupees(p.originalPrice)}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3">
                                  <span className={`font-semibold ${p.stockCount < 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {p.stockCount} units
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end space-x-1">
                                    <button
                                      onClick={() => {
                                        setEditingProduct({ ...p });
                                        setActiveTab('edit-product');
                                      }}
                                      className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                                      title="Edit Product Details"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => onDeleteProduct(p.id)}
                                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                                      title="Delete from Store"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Mobile Card List */}
                    <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredProducts.map((p) => {
                        const skuDisplay = p.sku || `SKU-${p.id.toUpperCase()}`;
                        return (
                          <div key={p.id} className="p-3 flex items-start space-x-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</div>
                              <div className="text-[10px] text-slate-400">{p.brand} • {p.category}</div>
                              <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">{skuDisplay}</div>
                              <div className="flex items-center justify-between mt-1.5">
                                <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                                  {formatRupees(p.price)}
                                </div>
                                <div className={`font-semibold text-[10px] ${p.stockCount < 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                  {p.stockCount} units
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={() => {
                                  setEditingProduct({ ...p });
                                  setActiveTab('edit-product');
                                }}
                                className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ADD NEW PRODUCT FORM (WITH IMAGE UPLOAD & URL) */}
              {activeTab === 'add-product' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Add New Product to Store
                      </h3>
                      <p className="text-xs text-slate-400">
                        Upload custom photos or provide an image link to publish instantly to {localBranding.storeName || 'Brand Bazaar'}.
                      </p>
                    </div>
                  </div>

                  {formSuccessMessage && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{formSuccessMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="e.g. Silk Cashmere Trench Coat"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Brand / Designer *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                          placeholder="e.g. Maison Atelier"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    {/* AUTOMATED SKU GENERATOR BLOCK */}
                    <div className="p-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                          <Barcode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span>Automated Inventory SKU (Stock Keeping Unit)</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            const autoSku = generateAutomatedSKU(
                              newProduct.category,
                              newProduct.brand,
                              newProduct.name,
                              newProduct.sizes
                            );
                            setNewProduct((prev) => ({ ...prev, sku: autoSku }));
                          }}
                          className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1 shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          <span>Auto-Generate SKU</span>
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newProduct.sku}
                          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value.toUpperCase() })}
                          placeholder="e.g. FSH-MAIS-SIL-S-XYZ123 (click Generate or type custom SKU)"
                          className="flex-1 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 font-mono text-xs font-bold uppercase tracking-wider focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                        <span>
                          Naming Pattern: <code className="font-bold text-indigo-600 dark:text-indigo-400">[Category]-[Brand]-[Name]-[Size]-[Suffix]</code>
                        </span>
                        <span className="italic text-slate-400">Guarantees inventory uniqueness (e.g. -XYZ123)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Category *
                        </label>
                        <select
                          value={newProduct.category}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, category: e.target.value as Product['category'] })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                        >
                          <option value="Fashion">Fashion</option>
                          <option value="Footwear">Footwear</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Beauty">Beauty</option>
                          <option value="Home & Living">Home &amp; Living</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          step="1"
                          required
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Compare Price (₹)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={newProduct.originalPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                          placeholder="MSRP / Strike-through"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    {/* PRODUCT IMAGE INPUT: MULTIPLE UPLOAD, URL & AI IMAGE STUDIO */}
                    <div className="space-y-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                          <ImageIcon className="w-4 h-4 text-indigo-500" />
                          <span>Product Photos &amp; AI Image Studio</span>
                        </label>

                        {/* Mode Switcher */}
                        <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg text-[11px] font-semibold">
                          <button
                            type="button"
                            onClick={() => setImageMode('upload')}
                            className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                              imageMode === 'upload'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload Files</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageMode('url')}
                            className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                              imageMode === 'url'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <Globe className="w-3 h-3" />
                            <span>Image URL</span>
                          </button>
                        </div>
                      </div>

                      {/* AI Image Studio Bar for New Product */}
                      <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                        <div className="flex items-center justify-between text-indigo-900 dark:text-indigo-200 font-bold text-xs">
                          <span className="flex items-center space-x-1">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                            <span>AI Product Photo Studio</span>
                          </span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">Powered by Gemini</span>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={aiPromptInput}
                            onChange={(e) => setAiPromptInput(e.target.value)}
                            placeholder='e.g. "Luxury gold chronograph watch on dark granite", "Italian silk trench coat studio"'
                            className="flex-1 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            type="button"
                            disabled={isAiEditingImage || !aiPromptInput.trim()}
                            onClick={() => handleAiEditImage('new')}
                            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1 shrink-0"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{isAiEditingImage ? 'Generating...' : 'Generate with AI'}</span>
                          </button>
                        </div>

                        {aiEditSuccessMsg && (
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                            {aiEditSuccessMsg}
                          </p>
                        )}
                      </div>

                      {imageMode === 'upload' ? (
                        <div className="space-y-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            multiple
                            className="hidden"
                          />
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all flex flex-col items-center justify-center space-y-1.5"
                          >
                            <Upload className="w-6 h-6 text-indigo-500" />
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                              Click or Drag photos to upload (Select multiple files)
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Supports JPG, PNG, WEBP up to 5MB each
                            </span>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="url"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]"
                        />
                      )}

                      {/* Image Gallery Thumbnails Grid */}
                      <div className="space-y-1.5 pt-2">
                        <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block">
                          Product Photos ({ (newProduct.images || [newProduct.image]).length })
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {(newProduct.images && newProduct.images.length > 0 ? newProduct.images : [newProduct.image]).map((img: string, idx: number) => {
                            const isMain = img === newProduct.image;
                            return (
                              <div
                                key={idx}
                                className={`relative group w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                                  isMain
                                    ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                                    : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                                }`}
                                onClick={() => setNewProduct((prev) => ({ ...prev, image: img }))}
                              >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                {isMain && (
                                  <span className="absolute bottom-0 inset-x-0 bg-indigo-600 text-white text-[8px] font-black text-center py-0.2">
                                    MAIN
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const prompt = window.prompt('Describe the desired changes:');
                                    if (!prompt) return;
                                    
                                    // Basic loading state could be added here
                                    try {
                                      const res = await fetch('/api/ai-edit-image', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ prompt, imageUrl: img, productName: newProduct.name }),
                                      });
                                      const data = await res.json();
                                      if (data.success) {
                                        setNewProduct(prev => {
                                          const current = prev.images && prev.images.length > 0 ? prev.images : [prev.image];
                                          const next = [...current];
                                          next[idx] = data.imageUrl;
                                          return { ...prev, images: next, image: prev.image === img ? data.imageUrl : prev.image };
                                        });
                                      } else {
                                        alert('AI Edit failed: ' + data.error);
                                      }
                                    } catch (err) {
                                      alert('AI Edit failed: ' + err);
                                    }
                                  }}
                                  className="absolute top-0.5 left-0.5 p-0.5 rounded-full bg-indigo-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="AI Edit"
                                >
                                  <Sparkles className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewProduct((prev) => {
                                      const current = prev.images && prev.images.length > 0 ? prev.images : [prev.image];
                                      const next = current.filter((_, i: number) => i !== idx);
                                      const mainImg = next[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30';
                                      return { ...prev, image: mainImg, images: next };
                                    });
                                  }}
                                  className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-rose-500 text-white transition-opacity"
                                  title="Remove image"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNewProduct((prev) => {
                                        const current = prev.images && prev.images.length > 0 ? prev.images : [prev.image];
                                        const next = [...current];
                                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                                        return { ...prev, images: next };
                                      });
                                    }}
                                    className="absolute bottom-0.5 left-0.5 p-0.5 rounded-full bg-black/50 text-white"
                                    title="Move left"
                                  >
                                    <ChevronLeft className="w-3 h-3" />
                                  </button>
                                )}
                                {idx < (newProduct.images && newProduct.images.length > 0 ? newProduct.images.length - 1 : 0) && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNewProduct((prev) => {
                                        const current = prev.images && prev.images.length > 0 ? prev.images : [prev.image];
                                        const next = [...current];
                                        [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                                        return { ...prev, images: next };
                                      });
                                    }}
                                    className="absolute bottom-0.5 right-0.5 p-0.5 rounded-full bg-black/50 text-white"
                                    title="Move right"
                                  >
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Initial Stock Units
                        </label>
                        <input
                          type="number"
                          value={newProduct.stockCount}
                          onChange={(e) => setNewProduct({ ...newProduct, stockCount: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Low Stock Threshold
                        </label>
                        <input
                          type="number"
                          value={newProduct.lowStockThreshold || 10}
                          onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Promo Badge
                        </label>
                        <select
                          value={newProduct.badge || 'NEW'}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, badge: e.target.value as Product['badge'] })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        >
                          <option value="NEW">NEW ARRIVAL</option>
                          <option value="BESTSELLER">BESTSELLER</option>
                          <option value="LIMITED">LIMITED EDITION</option>
                          <option value="SALE">ON SALE</option>
                        </select>
                      </div>
                    </div>

                    {/* PRODUCT COLORS SELECTOR & SWATCHES */}
                    <div className="space-y-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 text-xs">
                          <Palette className="w-4 h-4 text-indigo-500" />
                          <span>Product Colors &amp; Swatches</span>
                        </label>
                        <span className="text-[10px] text-slate-400">Click swatch to toggle or type custom colors</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {COLOR_PRESETS.map((preset) => {
                          const currentColorsList = newProduct.colors
                            ? newProduct.colors.split(',').map((c) => c.trim())
                            : [];
                          const isSelected = currentColorsList.includes(preset.name);

                          const toggleColor = () => {
                            let updated: string[];
                            if (isSelected) {
                              updated = currentColorsList.filter((c) => c !== preset.name);
                            } else {
                              updated = [...currentColorsList, preset.name];
                            }
                            setNewProduct({ ...newProduct, colors: updated.join(', ') });
                          };

                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={toggleColor}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30 shadow-xs'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full border border-black/20 shadow-xs shrink-0"
                                style={{ backgroundColor: preset.hex }}
                              />
                              <span>{preset.name}</span>
                              {isSelected && <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                            </button>
                          );
                        })}
                      </div>

                      <input
                        type="text"
                        value={newProduct.colors}
                        onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                        placeholder="e.g. Black, White, Midnight Blue, Champagne Gold"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                      />
                    </div>

                    {/* PRODUCT SIZES SELECTOR */}
                    <div className="space-y-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 text-xs">
                          <Sliders className="w-4 h-4 text-indigo-500" />
                          <span>Available Sizes &amp; Fit Options</span>
                        </label>
                        <span className="text-[10px] text-slate-400">Click chip to toggle or type custom sizes</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {SIZE_PRESETS.map((sz) => {
                          const currentSizesList = newProduct.sizes
                            ? newProduct.sizes.split(',').map((s) => s.trim())
                            : [];
                          const isSelected = currentSizesList.includes(sz);

                          const toggleSize = () => {
                            let updated: string[];
                            if (isSelected) {
                              updated = currentSizesList.filter((s) => s !== sz);
                            } else {
                              updated = [...currentSizesList, sz];
                            }
                            setNewProduct({ ...newProduct, sizes: updated.join(', ') });
                          };

                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={toggleSize}
                              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all border ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>

                      <input
                        type="text"
                        value={newProduct.sizes}
                        onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                        placeholder="e.g. S, M, L, XL, Free Size, 38, 40, 42"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                          <span>Product Description</span>
                        </label>

                        <button
                          type="button"
                          disabled={isGeneratingAiDescription}
                          onClick={() => handleGenerateAiDescription('new')}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAiDescription ? 'animate-spin' : 'animate-pulse'}`} />
                          <span>{isGeneratingAiDescription ? 'Generating via Gemini AI...' : '✨ Generate AI Description from Image'}</span>
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Detailed fabric, craftsmanship or technical specifications (or click above to generate via Gemini AI)..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs leading-relaxed font-medium"
                      />

                      {aiDescSuccessMsg && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 shrink-0 text-emerald-500 animate-bounce" />
                          <span>{aiDescSuccessMsg}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">Meta Title (SEO)</label>
                        <input
                          type="text"
                          value={newProduct.metaTitle || ''}
                          onChange={(e) => setNewProduct({...newProduct, metaTitle: e.target.value})}
                          placeholder="e.g. Luxury Silk Trench Coat - Brand Bazaar"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">Meta Description (SEO)</label>
                        <input
                          type="text"
                          value={newProduct.metaDescription || ''}
                          onChange={(e) => setNewProduct({...newProduct, metaDescription: e.target.value})}
                          placeholder="e.g. Shop the premium Silk Trench Coat. Authenticity guaranteed."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Product Video URL (YouTube/Vimeo)</label>
                      <input
                        type="url"
                        value={newProduct.videoUrl || ''}
                        onChange={(e) => setNewProduct({...newProduct, videoUrl: e.target.value})}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Technical Specs (Key:Value, separated by comma)</label>
                      <textarea
                        rows={2}
                        value={newProduct.technicalSpecs?.map(s => `${s.key}:${s.value}`).join(', ') || ''}
                        onChange={(e) => {
                          const specs = e.target.value.split(',').map(pair => {
                            const [key, value] = pair.split(':');
                            return { key: (key || '').trim(), value: (value || '').trim() };
                          }).filter(s => s.key);
                          setNewProduct({...newProduct, technicalSpecs: specs});
                        }}
                        placeholder="e.g. Material: Silk, Origin: Italy, Weight: 500g"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg transition-transform hover:scale-105 active:scale-95"
                      >
                        Publish Product to Brand Bazaar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: EDIT PRODUCT FORM */}
              {activeTab === 'edit-product' && editingProduct && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <Edit3 className="w-5 h-5 text-indigo-500" />
                        <span>Edit Product: {editingProduct.name}</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Update product specifications, inventory, price, or description.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      &larr; Back to Products
                    </button>
                  </div>

                  {editSuccessMessage && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{editSuccessMessage}</span>
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (onUpdateProduct && editingProduct) {
                        onUpdateProduct(editingProduct);
                        setEditSuccessMessage('Product updated successfully!');
                        setTimeout(() => {
                          setEditSuccessMessage('');
                          setActiveTab('products');
                        }, 1200);
                      }
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, name: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Brand / Designer *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.brand}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, brand: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    {/* AUTOMATED SKU GENERATOR BLOCK FOR EDIT PRODUCT */}
                    <div className="p-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                          <Barcode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span>Automated Inventory SKU</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            if (!editingProduct) return;
                            const sizeStr = Array.isArray(editingProduct.sizes) ? editingProduct.sizes.join(', ') : editingProduct.sizes;
                            const autoSku = generateAutomatedSKU(
                              editingProduct.category,
                              editingProduct.brand,
                              editingProduct.name,
                              sizeStr
                            );
                            setEditingProduct({ ...editingProduct, sku: autoSku });
                          }}
                          className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1 shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          <span>Regenerate SKU</span>
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingProduct.sku || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })}
                          placeholder="e.g. FSH-MAIS-SIL-S-XYZ123"
                          className="flex-1 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 font-mono text-xs font-bold uppercase tracking-wider focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                        <span>
                          Naming Pattern: <code className="font-bold text-indigo-600 dark:text-indigo-400">[Category]-[Brand]-[Name]-[Size]-[Suffix]</code>
                        </span>
                        <span className="italic text-slate-400">Guarantees inventory uniqueness (e.g. -XYZ123)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Category *
                        </label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              category: e.target.value as Product['category'],
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                        >
                          <option value="Fashion">Fashion</option>
                          <option value="Footwear">Footwear</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Beauty">Beauty</option>
                          <option value="Home & Living">Home &amp; Living</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          step="1"
                          required
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              price: Number(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Compare Price (₹)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={editingProduct.originalPrice || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              originalPrice: Number(e.target.value) || undefined,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    {/* EDIT PRODUCT IMAGE SECTION: MULTIPLE UPLOAD, URL & AI IMAGE EDITOR */}
                    <div className="space-y-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                          <ImageIcon className="w-4 h-4 text-indigo-500" />
                          <span>Product Photos &amp; AI Image Studio</span>
                        </label>

                        {/* Mode Switcher */}
                        <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg text-[11px] font-semibold">
                          <button
                            type="button"
                            onClick={() => setEditImageMode('upload')}
                            className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                              editImageMode === 'upload'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload Files</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditImageMode('url')}
                            className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                              editImageMode === 'url'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <Globe className="w-3 h-3" />
                            <span>Image URL</span>
                          </button>
                        </div>
                      </div>

                      {/* AI Image Generation / Prompt Editor Bar */}
                      <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                        <div className="flex items-center justify-between text-indigo-900 dark:text-indigo-200 font-bold text-xs">
                          <span className="flex items-center space-x-1">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                            <span>AI Product Photo Editor &amp; Director</span>
                          </span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">Powered by Gemini</span>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={aiPromptInput}
                            onChange={(e) => setAiPromptInput(e.target.value)}
                            placeholder='e.g. "Add studio spotlight lighting", "Change color to Rose Gold", "Minimalist marble backdrop"'
                            className="flex-1 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            type="button"
                            disabled={isAiEditingImage || !aiPromptInput.trim()}
                            onClick={() => handleAiEditImage('edit')}
                            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1 shrink-0"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{isAiEditingImage ? 'Generating...' : 'Edit with AI'}</span>
                          </button>
                        </div>

                        {aiEditSuccessMsg && (
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                            {aiEditSuccessMsg}
                          </p>
                        )}
                      </div>

                      {editImageMode === 'upload' ? (
                        <div className="space-y-2">
                          <input
                            type="file"
                            ref={editFileInputRef}
                            onChange={handleEditFileUpload}
                            accept="image/*"
                            multiple
                            className="hidden"
                          />
                          <div
                            onClick={() => editFileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all flex flex-col items-center justify-center space-y-1.5 bg-white dark:bg-slate-900"
                          >
                            <Upload className="w-6 h-6 text-indigo-500" />
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                              Click or Drag photos to upload (Select multiple files)
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Supports JPG, PNG, WEBP up to 5MB each
                            </span>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="url"
                          value={editingProduct.image}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, image: e.target.value })
                          }
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]"
                        />
                      )}

                      {/* Gallery & Main Image Preview Grid */}
                      <div className="space-y-1.5 pt-2">
                        <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block">
                          Product Image Gallery (Click thumbnail to set as main photo)
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {(editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : [editingProduct.image]).map((img: string, idx: number) => {
                            const isMain = img === editingProduct.image;
                            return (
                              <div
                                key={idx}
                                className={`relative group w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                                  isMain
                                    ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                                    : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                                }`}
                                onClick={() =>
                                  setEditingProduct((prev) => (prev ? { ...prev, image: img } : null))
                                }
                              >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                {isMain && (
                                  <span className="absolute bottom-0 inset-x-0 bg-indigo-600 text-white text-[8px] font-black text-center py-0.2">
                                    MAIN
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingProduct((prev) => {
                                      if (!prev) return null;
                                      const current = prev.images && prev.images.length > 0 ? prev.images : [prev.image];
                                      const next = current.filter((_, i: number) => i !== idx);
                                      const mainImg = next[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30';
                                      return { ...prev, image: mainImg, images: next };
                                    });
                                  }}
                                  className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove image"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Stock Units
                        </label>
                        <input
                          type="number"
                          value={editingProduct.stockCount}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              stockCount: Number(e.target.value) || 0,
                              inStock: (Number(e.target.value) || 0) > 0,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Promo Badge
                        </label>
                        <select
                          value={editingProduct.badge || 'NEW'}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              badge: e.target.value as Product['badge'],
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        >
                          <option value="NEW">NEW</option>
                          <option value="HOT">HOT</option>
                          <option value="SALE">SALE</option>
                          <option value="BESTSELLER">BESTSELLER</option>
                          <option value="LIMITED">LIMITED</option>
                        </select>
                      </div>
                    </div>

                    {/* EDIT PRODUCT COLORS SELECTOR & SWATCHES */}
                    <div className="space-y-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 text-xs">
                          <Palette className="w-4 h-4 text-indigo-500" />
                          <span>Product Colors &amp; Swatches</span>
                        </label>
                        <span className="text-[10px] text-slate-400">Click swatch to toggle or type custom colors</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {COLOR_PRESETS.map((preset) => {
                          const rawColors = Array.isArray(editingProduct.colors)
                            ? editingProduct.colors.join(', ')
                            : editingProduct.colors || '';
                          const currentColorsList = rawColors.split(',').map((c) => c.trim()).filter(Boolean);
                          const isSelected = currentColorsList.includes(preset.name);

                          const toggleColor = () => {
                            let updated: string[];
                            if (isSelected) {
                              updated = currentColorsList.filter((c) => c !== preset.name);
                            } else {
                              updated = [...currentColorsList, preset.name];
                            }
                            setEditingProduct({ ...editingProduct, colors: updated });
                          };

                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={toggleColor}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30 shadow-xs'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full border border-black/20 shadow-xs shrink-0"
                                style={{ backgroundColor: preset.hex }}
                              />
                              <span>{preset.name}</span>
                              {isSelected && <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                            </button>
                          );
                        })}
                      </div>

                      <input
                        type="text"
                        value={
                          Array.isArray(editingProduct.colors)
                            ? editingProduct.colors.join(', ')
                            : editingProduct.colors || ''
                        }
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            colors: e.target.value.split(',').map((c) => c.trim()).filter(Boolean),
                          })
                        }
                        placeholder="e.g. Black, White, Midnight Blue, Champagne Gold"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                      />
                    </div>

                    {/* EDIT PRODUCT SIZES SELECTOR */}
                    <div className="space-y-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 text-xs">
                          <Sliders className="w-4 h-4 text-indigo-500" />
                          <span>Available Sizes &amp; Fit Options</span>
                        </label>
                        <span className="text-[10px] text-slate-400">Click chip to toggle or type custom sizes</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {SIZE_PRESETS.map((sz) => {
                          const rawSizes = Array.isArray(editingProduct.sizes)
                            ? editingProduct.sizes.join(', ')
                            : editingProduct.sizes || '';
                          const currentSizesList = rawSizes.split(',').map((s) => s.trim()).filter(Boolean);
                          const isSelected = currentSizesList.includes(sz);

                          const toggleSize = () => {
                            let updated: string[];
                            if (isSelected) {
                              updated = currentSizesList.filter((s) => s !== sz);
                            } else {
                              updated = [...currentSizesList, sz];
                            }
                            setEditingProduct({ ...editingProduct, sizes: updated });
                          };

                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={toggleSize}
                              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all border ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>

                      <input
                        type="text"
                        value={
                          Array.isArray(editingProduct.sizes)
                            ? editingProduct.sizes.join(', ')
                            : editingProduct.sizes || ''
                        }
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="e.g. S, M, L, XL, Free Size, 38, 40, 42"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                          <span>Product Description</span>
                        </label>

                        <button
                          type="button"
                          disabled={isGeneratingAiDescription}
                          onClick={() => handleGenerateAiDescription('edit')}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAiDescription ? 'animate-spin' : 'animate-pulse'}`} />
                          <span>{isGeneratingAiDescription ? 'Generating via Gemini AI...' : '✨ Generate AI Description from Image'}</span>
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        placeholder="Detailed product features, materials, craftsmanship (or click above to generate via Gemini AI)..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs leading-relaxed font-medium"
                      />

                      {aiDescSuccessMsg && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 shrink-0 text-emerald-500 animate-bounce" />
                          <span>{aiDescSuccessMsg}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                      >
                        Save Product Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: OFFERS & FLASH SALES MANAGER */}
              {activeTab === 'offers' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                        <Flame className="w-5 h-5 text-rose-500" />
                        <span>Limited-Time Offers &amp; Promo Deals Manager</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Configure the limited-time sale countdown timer, header announcement strips, and coupon discount codes.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveOffers}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all flex items-center space-x-1.5 shrink-0"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save &amp; Publish Offers</span>
                    </button>
                  </div>

                  {offersSavedMessage && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Offers, Flash Sale Countdown &amp; Promotional Coupons updated successfully!</span>
                    </div>
                  )}

                  {/* LIVE REAL-TIME PREVIEW CARD */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-rose-300 dark:border-rose-900/60 bg-gradient-to-br from-rose-50/50 via-slate-50 to-white dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Live Storefront Offers Preview
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">Simulating Customer View</span>
                    </div>

                    {/* Top Announcement Bar Preview */}
                    {localOffers.flashSale.showAnnouncementBar && (
                      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 text-white text-[11px] py-1.5 px-3 rounded-xl font-medium flex items-center justify-between shadow-xs">
                        <div className="flex items-center space-x-2 truncate">
                          <span className="flex items-center font-bold px-1.5 py-0.5 rounded bg-black/20 text-[9px] uppercase">
                            <Percent className="w-2.5 h-2.5 mr-1" /> {localOffers.flashSale.announcementTag || 'SEASON SALE'}
                          </span>
                          <span className="truncate">
                            Grand Launch at <strong>{localBranding.storeName || 'Brand Bazaar'}</strong>: {localOffers.flashSale.announcementText}
                          </span>
                        </div>
                        <span className="text-[10px] text-white/80 hidden sm:inline">&bull; 100% Genuine</span>
                      </div>
                    )}

                    {/* Flash Sale Banner Preview */}
                    {localOffers.flashSale.enabled ? (
                      <div className="p-4 rounded-2xl bg-slate-950 text-white border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                        <div className="flex items-center space-x-3 text-left">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shrink-0">
                            <Flame className="w-4 h-4 fill-current" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                                {localOffers.flashSale.badgeTitle || '⚡ LIMITED TIME FLASH SALE'}
                              </span>
                              {localOffers.flashSale.discountHeadline && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                                  {localOffers.flashSale.discountHeadline}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                              {localOffers.flashSale.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <div className="flex items-center space-x-1 font-mono text-xs font-bold text-amber-300 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-white/10">
                            <Timer className="w-3.5 h-3.5 text-rose-400 mr-1" />
                            <span>{localOffers.flashSale.timerDurationHours}h 00m 00s</span>
                          </div>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black text-xs shadow-md"
                          >
                            {localOffers.flashSale.ctaText || 'Claim Deal'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-500 font-medium">
                        Flash Sale Urgency Strip is currently disabled on storefront.
                      </div>
                    )}
                  </div>

                  {/* FORM 1: LIMITED-TIME FLASH SALE & COUNTDOWN TIMER CONFIGURATION */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                          <Timer className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            Limited-Time Sale Countdown Strip
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Controls the glowing countdown clock banner on the storefront homepage hero.
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localOffers.flashSale.enabled}
                          onChange={(e) =>
                            setLocalOffers({
                              ...localOffers,
                              flashSale: { ...localOffers.flashSale, enabled: e.target.checked },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-rose-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Sale Badge Title
                        </label>
                        <input
                          type="text"
                          value={localOffers.flashSale.badgeTitle}
                          onChange={(e) =>
                            setLocalOffers({
                              ...localOffers,
                              flashSale: { ...localOffers.flashSale, badgeTitle: e.target.value },
                            })
                          }
                          placeholder="e.g. ⚡ LIMITED TIME FLASH SALE"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Discount Pill Headline
                        </label>
                        <input
                          type="text"
                          value={localOffers.flashSale.discountHeadline}
                          onChange={(e) =>
                            setLocalOffers({
                              ...localOffers,
                              flashSale: { ...localOffers.flashSale, discountHeadline: e.target.value },
                            })
                          }
                          placeholder="e.g. EXTRA 20% OFF or FLAT 30% DISCOUNT"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-rose-600 dark:text-rose-400"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Offer Description / Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={localOffers.flashSale.description}
                          onChange={(e) =>
                            setLocalOffers({
                              ...localOffers,
                              flashSale: { ...localOffers.flashSale, description: e.target.value },
                            })
                          }
                          placeholder="Luxury catalog prices slashed for a limited window. Free Pan-India express delivery included."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Countdown Duration (Hours)
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min={1}
                            max={168}
                            value={localOffers.flashSale.timerDurationHours}
                            onChange={(e) =>
                              setLocalOffers({
                                ...localOffers,
                                flashSale: {
                                  ...localOffers.flashSale,
                                  timerDurationHours: Math.max(1, parseInt(e.target.value) || 24),
                                },
                              })
                            }
                            className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                          />
                          <div className="flex items-center space-x-1">
                            {[12, 24, 48, 72].map((hrs) => (
                              <button
                                key={hrs}
                                type="button"
                                onClick={() =>
                                  setLocalOffers({
                                    ...localOffers,
                                    flashSale: { ...localOffers.flashSale, timerDurationHours: hrs },
                                  })
                                }
                                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                                  localOffers.flashSale.timerDurationHours === hrs
                                    ? 'bg-rose-600 text-white border-rose-600'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                              >
                                {hrs}h
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          CTA Button Label
                        </label>
                        <input
                          type="text"
                          value={localOffers.flashSale.ctaText}
                          onChange={(e) =>
                            setLocalOffers({
                              ...localOffers,
                              flashSale: { ...localOffers.flashSale, ctaText: e.target.value },
                            })
                          }
                          placeholder="e.g. Claim Deal or Shop Sale Now"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Target Collection / Department
                        </label>
                        <select
                          value={localOffers.flashSale.targetCategory}
                          onChange={(e) =>
                            setLocalOffers({
                              ...localOffers,
                              flashSale: {
                                ...localOffers.flashSale,
                                targetCategory: e.target.value as CategoryFilter,
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium cursor-pointer"
                        >
                          <option value="All">All Luxury Departments</option>
                          <option value="Fashion">Fashion &amp; Apparel</option>
                          <option value="Footwear">Footwear &amp; Sneakers</option>
                          <option value="Electronics">Electronics &amp; Spatial Audio</option>
                          <option value="Accessories">Accessories &amp; Timepieces</option>
                          <option value="Beauty">Beauty &amp; Grooming</option>
                          <option value="Home & Living">Home &amp; Living</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* FORM 2: GLOBAL TOP HEADER ANNOUNCEMENT BAR */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                          <Percent className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            Global Top Announcement Bar
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            The full-width promotional announcement strip rendered atop the navbar.
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localOffers.flashSale.showAnnouncementBar}
                          onChange={(e) =>
                            setLocalOffers({
                              ...localOffers,
                              flashSale: {
                                ...localOffers.flashSale,
                                showAnnouncementBar: e.target.checked,
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Announcement Tag
                        </label>
                        <input
                          type="text"
                          value={localOffers.flashSale.announcementTag}
                          onChange={(e) =>
                            setLocalOffers({
                              ...localOffers,
                              flashSale: {
                                ...localOffers.flashSale,
                                announcementTag: e.target.value.toUpperCase(),
                              },
                            })
                          }
                          placeholder="e.g. SEASON SALE or DIWALI SPECIAL"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Announcement Copy Text
                        </label>
                        <input
                          type="text"
                          value={localOffers.flashSale.announcementText}
                          onChange={(e) =>
                            setLocalOffers({
                              ...localOffers,
                              flashSale: {
                                ...localOffers.flashSale,
                                announcementText: e.target.value,
                              },
                            })
                          }
                          placeholder="e.g. Enjoy 20% off on all luxury accessories & free global express shipping!"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FORM 3: STORE PROMO CODES & COUPONS MANAGER */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            Store Coupons &amp; Discount Promo Codes ({localOffers.coupons.length})
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Create promotional codes for checkout discounts, VIP SMS alerts, and marketing campaigns.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Add New Coupon Inline Form */}
                    <form onSubmit={handleAddCoupon} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                      <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                        <Plus className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Create New Discount Coupon</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            Coupon Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={newCoupon.code}
                            onChange={(e) =>
                              setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                            }
                            placeholder="e.g. FLASH30"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            Discount Type
                          </label>
                          <select
                            value={newCoupon.discountType}
                            onChange={(e) =>
                              setNewCoupon({
                                ...newCoupon,
                                discountType: e.target.value as 'percentage' | 'fixed',
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Flat Amount (₹)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            Discount Value *
                          </label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={newCoupon.discountValue}
                            onChange={(e) =>
                              setNewCoupon({
                                ...newCoupon,
                                discountValue: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="20"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            Min Order Spend (₹)
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={newCoupon.minSpend}
                            onChange={(e) =>
                              setNewCoupon({
                                ...newCoupon,
                                minSpend: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="2999"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            Description
                          </label>
                          <input
                            type="text"
                            value={newCoupon.description}
                            onChange={(e) =>
                              setNewCoupon({ ...newCoupon, description: e.target.value })
                            }
                            placeholder="e.g. 20% discount on orders above ₹2,999"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            Badge Tag
                          </label>
                          <input
                            type="text"
                            value={newCoupon.tag}
                            onChange={(e) =>
                              setNewCoupon({ ...newCoupon, tag: e.target.value.toUpperCase() })
                            }
                            placeholder="e.g. FLASH DEAL"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs uppercase"
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Coupon</span>
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Active Coupons List */}
                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Active Promotional Coupons
                      </div>

                      {localOffers.coupons.length === 0 ? (
                        <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400">
                          No coupon codes configured. Create one above!
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {localOffers.coupons.map((coupon) => (
                            <div
                              key={coupon.id}
                              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                                coupon.enabled
                                  ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-900/60 shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400 tracking-wider">
                                    {coupon.code}
                                  </span>
                                  {coupon.tag && (
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                      {coupon.tag}
                                    </span>
                                  )}
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                    {coupon.discountType === 'percentage'
                                      ? `${coupon.discountValue}% OFF`
                                      : `₹${coupon.discountValue} OFF`}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                  {coupon.description || `Valid on orders above ${formatRupees(coupon.minSpend || 0)}`}
                                </p>
                                {coupon.minSpend ? (
                                  <span className="text-[10px] text-slate-400">
                                    Min Spend: {formatRupees(coupon.minSpend)}
                                  </span>
                                ) : null}
                              </div>

                              <div className="flex items-center space-x-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditCoupon(coupon)}
                                  className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                                  title="Edit Coupon"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleCoupon(coupon.id)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                    coupon.enabled
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  {coupon.enabled ? 'ACTIVE' : 'PAUSED'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCoupon(coupon.id)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                  title="Delete Coupon"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Offers Footer CTA */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleSaveOffers}
                      className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg transition-all flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save &amp; Publish All Offers &amp; Deals</span>
                    </button>
                  </div>

                  {/* EDIT COUPON MODAL POPUP */}
                  {editingCoupon && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                              <Edit3 className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                Edit Coupon: <span className="font-mono text-indigo-600 dark:text-indigo-400">{editingCoupon.code}</span>
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                Modify discount value, minimum order requirement, or promo title.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleCancelEditCoupon}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveCouponEdit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700 dark:text-slate-300">
                                Coupon Code *
                              </label>
                              <input
                                type="text"
                                required
                                value={editingCoupon.code}
                                onChange={(e) =>
                                  setEditingCoupon({
                                    ...editingCoupon,
                                    code: e.target.value.toUpperCase(),
                                  })
                                }
                                placeholder="e.g. FLASH30"
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-xs"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-700 dark:text-slate-300">
                                Discount Type
                              </label>
                              <select
                                value={editingCoupon.discountType}
                                onChange={(e) =>
                                  setEditingCoupon({
                                    ...editingCoupon,
                                    discountType: e.target.value as 'percentage' | 'fixed',
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                              >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Flat Amount (₹)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-700 dark:text-slate-300">
                                Discount Value *
                              </label>
                              <input
                                type="number"
                                required
                                min={1}
                                value={editingCoupon.discountValue}
                                onChange={(e) =>
                                  setEditingCoupon({
                                    ...editingCoupon,
                                    discountValue: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-xs"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-700 dark:text-slate-300">
                                Min Order Spend (₹)
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={editingCoupon.minSpend || 0}
                                onChange={(e) =>
                                  setEditingCoupon({
                                    ...editingCoupon,
                                    minSpend: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                              />
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                              <label className="font-bold text-slate-700 dark:text-slate-300">
                                Description
                              </label>
                              <input
                                type="text"
                                value={editingCoupon.description || ''}
                                onChange={(e) =>
                                  setEditingCoupon({
                                    ...editingCoupon,
                                    description: e.target.value,
                                  })
                                }
                                placeholder="e.g. 20% discount on orders above ₹2,999"
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-700 dark:text-slate-300">
                                Badge Tag
                              </label>
                              <input
                                type="text"
                                value={editingCoupon.tag || ''}
                                onChange={(e) =>
                                  setEditingCoupon({
                                    ...editingCoupon,
                                    tag: e.target.value.toUpperCase(),
                                  })
                                }
                                placeholder="e.g. FLASH DEAL"
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs uppercase"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-700 dark:text-slate-300">
                                Coupon Status
                              </label>
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingCoupon({
                                      ...editingCoupon,
                                      enabled: !editingCoupon.enabled,
                                    })
                                  }
                                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                                    editingCoupon.enabled
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                                  }`}
                                >
                                  {editingCoupon.enabled ? '✓ ACTIVE (ENABLED)' : '⏸ PAUSED (DISABLED)'}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={handleCancelEditCoupon}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center space-x-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save Coupon Changes</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PAYMENT GATEWAYS CONFIGURATION */}
              {activeTab === 'gateways' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-indigo-500" />
                        <span>Payment Gateway Settings</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Enable or disable live checkout processors and configure credentials.
                      </p>
                    </div>
                  </div>

                  {gatewaySavedMessage && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Payment gateway settings updated and applied to checkout!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveGatewaySettings} className="space-y-5 text-xs">
                    {/* 0. UPI DYNAMIC QR CODE GATEWAY */}
                    <div className="p-5 rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50/40 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                            ⚡
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                UPI Dynamic QR Code Gateway
                              </h4>
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40">
                                NPCI REAL-TIME
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Generate dynamic QR codes with exact order payable amounts for GPay, PhonePe, Paytm, CRED &amp; BHIM
                            </p>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localGateways.upi?.enabled}
                            onChange={(e) =>
                              setLocalGateways({
                                ...localGateways,
                                upi: {
                                  ...localGateways.upi,
                                  enabled: e.target.checked,
                                  upiId: localGateways.upi?.upiId || 'brandbazaar@icici',
                                  merchantName: localGateways.upi?.merchantName || 'Brand Bazaar Flagship',
                                  allowAutoVerify: true,
                                },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {localGateways.upi?.enabled && (
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-semibold text-slate-700 dark:text-slate-300">
                                Merchant UPI ID (VPA) *
                              </label>
                              <input
                                type="text"
                                required
                                value={localGateways.upi?.upiId || ''}
                                onChange={(e) =>
                                  setLocalGateways({
                                    ...localGateways,
                                    upi: {
                                      ...localGateways.upi,
                                      enabled: true,
                                      allowAutoVerify: true,
                                      merchantName: localGateways.upi?.merchantName || 'Brand Bazaar Store',
                                      upiId: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g. brandbazaar@icici"
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-semibold text-slate-700 dark:text-slate-300">
                                Merchant Business Display Name
                              </label>
                              <input
                                type="text"
                                value={localGateways.upi?.merchantName || ''}
                                onChange={(e) =>
                                  setLocalGateways({
                                    ...localGateways,
                                    upi: {
                                      ...localGateways.upi,
                                      enabled: true,
                                      allowAutoVerify: true,
                                      upiId: localGateways.upi?.upiId || 'brandbazaar@icici',
                                      merchantName: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g. Brand Bazaar Store"
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px]"
                              />
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
                            <div className="flex items-center space-x-2">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span className="text-slate-600 dark:text-slate-300">
                                Dynamic NPCI UPI QR string will encode payable order amounts automatically
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-500 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                              upi://pay?pa={localGateways.upi?.upiId || 'brandbazaar@icici'}&amp;am=₹
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 1. STRIPE */}
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                            S
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                              Stripe Payments (Credit / Debit Card)
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Accept Visa, Mastercard, AMEX, Discover with 3D Secure
                            </p>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localGateways.stripe.enabled}
                            onChange={(e) =>
                              setLocalGateways({
                                ...localGateways,
                                stripe: { ...localGateways.stripe, enabled: e.target.checked },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      {localGateways.stripe.enabled && (
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-700 dark:text-slate-300">
                              Stripe Publishable Key
                            </label>
                            <input
                              type="text"
                              value={localGateways.stripe.publishableKey}
                              onChange={(e) =>
                                setLocalGateways({
                                  ...localGateways,
                                  stripe: { ...localGateways.stripe, publishableKey: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px]"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="stripeTestMode"
                              checked={localGateways.stripe.testMode}
                              onChange={(e) =>
                                setLocalGateways({
                                  ...localGateways,
                                  stripe: { ...localGateways.stripe, testMode: e.target.checked },
                                })
                              }
                              className="rounded text-indigo-600"
                            />
                            <label htmlFor="stripeTestMode" className="text-slate-600 dark:text-slate-400">
                              Test Mode (Use Stripe test cards)
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. NETBANKING (INDIAN BANKS) */}
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm">
                            🏛️
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                              Indian Netbanking (Direct Bank Redirection)
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Direct gateway dropdown redirect for SBI, HDFC, ICICI, Axis, PNB, and 40+ Indian banks
                            </p>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localGateways.netbanking?.enabled ?? true}
                            onChange={(e) =>
                              setLocalGateways({
                                ...localGateways,
                                netbanking: { ...localGateways.netbanking, enabled: e.target.checked },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-600"></div>
                        </label>
                      </div>

                      {localGateways.netbanking?.enabled && (
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                            <div>
                              <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                                Support all RBI-scheduled Indian Banks
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Includes State Bank of India, HDFC Bank, ICICI Bank, Axis Bank, Kotak, PNB, etc.
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={localGateways.netbanking?.allowAllIndianBanks ?? true}
                                onChange={(e) =>
                                  setLocalGateways({
                                    ...localGateways,
                                    netbanking: {
                                      ...localGateways.netbanking,
                                      allowAllIndianBanks: e.target.checked,
                                    },
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-orange-600"></div>
                            </label>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {['SBI', 'HDFC', 'ICICI', 'AXIS', 'KOTAK', 'PNB', 'BOB', 'CANARA'].map((b) => (
                              <span key={b} className="px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold text-[10px] border border-orange-200 dark:border-orange-800/50">
                                ✓ {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. CASH ON DELIVERY (COD) */}
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                            💵
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                              Cash on Delivery (COD)
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Allow buyers to pay cash upon doorstep package handover
                            </p>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localGateways.cod.enabled}
                            onChange={(e) =>
                              setLocalGateways({
                                ...localGateways,
                                cod: { ...localGateways.cod, enabled: e.target.checked },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {localGateways.cod.enabled && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                          <label className="font-semibold text-slate-700 dark:text-slate-300">
                            Handling Convenience Surcharge (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={localGateways.cod.extraFee}
                            onChange={(e) =>
                              setLocalGateways({
                                ...localGateways,
                                cod: { ...localGateways.cod, extraFee: Number(e.target.value) },
                              })
                            }
                            placeholder="e.g. 49 or 0 for free COD"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px]"
                          />
                        </div>
                      )}
                    </div>

                    {/* 5. FREE DELIVERY THRESHOLD & SHIPPING RATES */}
                    <div className="p-5 rounded-2xl border-2 border-indigo-500/40 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50/40 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            🚚
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                Free Delivery Threshold &amp; Shipping Rates
                              </h4>
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/40">
                                LOGISTICS
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Configure minimum order spend (in Rupees) for automatic 100% Free Express Delivery
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs">
                          {localGateways.freeDeliveryThreshold === 0
                            ? 'ALWAYS FREE'
                            : `FREE ABOVE ₹${localGateways.freeDeliveryThreshold ?? 1999}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-700 dark:text-slate-300">
                            Free Delivery Minimum Order Amount (₹) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            required
                            value={localGateways.freeDeliveryThreshold ?? 1999}
                            onChange={(e) =>
                              setLocalGateways({
                                ...localGateways,
                                freeDeliveryThreshold: e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0),
                              })
                            }
                            placeholder="e.g. 4999, 1999, 999 (0 for Always Free)"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs"
                          />

                          {/* Quick Threshold Presets */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] text-slate-400">Presets:</span>
                            {[
                              { label: 'Free (₹0)', val: 0 },
                              { label: '₹199', val: 199 },
                              { label: '₹999', val: 999 },
                              { label: '₹1,499', val: 1499 },
                              { label: '₹1,999', val: 1999 },
                              { label: '₹2,499', val: 2499 },
                              { label: '₹4,999', val: 4999 },
                            ].map((preset) => (
                              <button
                                key={preset.val}
                                type="button"
                                onClick={() =>
                                  setLocalGateways({
                                    ...localGateways,
                                    freeDeliveryThreshold: preset.val,
                                  })
                                }
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                                  (localGateways.freeDeliveryThreshold ?? 1999) === preset.val
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-700 dark:text-slate-300">
                            Standard Express Shipping Fee (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={localGateways.standardShippingFee ?? 199}
                            onChange={(e) =>
                              setLocalGateways({
                                ...localGateways,
                                standardShippingFee: e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0),
                              })
                            }
                            placeholder="e.g. 199, 99, 49"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                          />
                          <p className="text-[10px] text-slate-400">
                            Charged only when cart subtotal is below ₹
                            {localGateways.freeDeliveryThreshold ?? 1999}.
                          </p>
                        </div>
                      </div>

                      {/* Live Calculation Preview Note */}
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-center space-x-2">
                        <span className="text-indigo-500 font-bold">ℹ</span>
                        <span>
                          {localGateways.freeDeliveryThreshold === 0 ? (
                            <>All customer orders receive <strong>100% FREE express shipping</strong> at checkout.</>
                          ) : (
                            <>Orders below <strong>₹{localGateways.freeDeliveryThreshold ?? 1999}</strong> are charged <strong>₹{localGateways.standardShippingFee ?? 199}</strong> express shipping. Orders at or above <strong>₹{localGateways.freeDeliveryThreshold ?? 1999}</strong> receive <strong>FREE delivery</strong>.</>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* INVENTORY & LOW-STOCK THRESHOLD SETTINGS CARD */}
                    <div className="p-5 rounded-2xl border-2 border-amber-500/40 dark:border-amber-500/30 bg-gradient-to-br from-amber-50/40 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm">
                            ⚠️
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                Inventory Low-Stock Notification Threshold
                              </h4>
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                                ALERT SETTING
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Products with stock units falling below this threshold will trigger admin low-stock notifications &amp; badges
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
                          THRESHOLD: {lowStockThreshold} UNITS
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                        <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                          Low-Stock Alert Trigger Count (Units) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          required
                          value={lowStockThreshold}
                          onChange={(e) => handleSaveLowStockThreshold(Number(e.target.value) || 10)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs"
                        />
                        <p className="text-[10px] text-slate-400">
                          Current status: {products.filter((p) => p.stockCount > 0 && p.stockCount < lowStockThreshold).length} items currently flagged as low stock in inventory.
                        </p>
                      </div>
                    </div>

                    {/* 6. STORE CURRENCY CONFIG */}
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            Store Display &amp; Checkout Currency
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Active standard currency: Indian Rupee (₹ INR)
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs">
                          {localGateways.currencySymbol || '₹'} {localGateways.currency || 'INR'}
                        </span>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center space-x-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save &amp; Activate Payment Gateway Settings</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: VIP CLUB MEMBERS */}
              {activeTab === 'vip-members' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                        <Gift className="w-5 h-5 text-amber-500" />
                        <span>SMS VIP Club Members &amp; Offer Redemptions</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        All mobile numbers registered via footer VIP Club (strictly 1 offer per mobile number).
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-3">Mobile Number</th>
                          <th className="p-3">Country Code</th>
                          <th className="p-3">Assigned Promo Code</th>
                          <th className="p-3">Registration Date</th>
                          <th className="p-3 text-right">Offer Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(!vipMembers || vipMembers.length === 0) ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                              No VIP Club members registered yet via the footer mobile banner.
                            </td>
                          </tr>
                        ) : (
                          vipMembers.map((member, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                              <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                                {member.countryCode} {member.phone}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                                  {member.countryCode}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                                  {member.code}
                                </span>
                              </td>
                              <td className="p-3 text-slate-500">
                                {new Date(member.date).toLocaleString()}
                              </td>
                              <td className="p-3 text-right">
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                  ✓ Redeemed Once
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === 'branding' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <Palette className="w-5 h-5 text-purple-500" />
                        <span>Store Logo &amp; Branding Customization</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Upload custom logo, customize monogram badge, and set brand typography &amp; accent palette.
                      </p>
                    </div>
                  </div>

                  {brandingSavedMessage && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Branding &amp; Logo changes saved successfully! Live store updated.</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveBranding} className="space-y-6 text-xs">
                    {/* Live Preview Card */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Live Header &amp; Footer Preview
                      </span>

                      {/* Header Preview */}
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {localBranding.logoType === 'image' && localBranding.logoImageUrl ? (
                            <img
                              src={localBranding.logoImageUrl}
                              alt="Store Logo"
                              className="w-10 h-10 rounded-2xl object-cover shadow-sm border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-sm"
                              style={{ backgroundColor: localBranding.primaryColor || '#4f46e5' }}
                            >
                              {localBranding.logoText || 'B'}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                {localBranding.storeName || 'BRAND BAZAAR'}
                              </span>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/50">
                                FLAGSHIP
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                              {localBranding.storeTagline || 'The Everything Premium Marketplace'}
                            </p>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 font-medium">
                          Previewing Header
                        </div>
                      </div>
                    </div>

                    {/* Store Name & Tagline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Store Name
                        </label>
                        <input
                          type="text"
                          required
                          value={localBranding.storeName}
                          onChange={(e) => setLocalBranding({ ...localBranding, storeName: e.target.value })}
                          placeholder="e.g. BRAND BAZAAR"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">
                          Store Tagline / Subtitle
                        </label>
                        <input
                          type="text"
                          value={localBranding.storeTagline}
                          onChange={(e) => setLocalBranding({ ...localBranding, storeTagline: e.target.value })}
                          placeholder="e.g. The Everything Premium Marketplace"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    {/* Logo Type Selector */}
                    <div className="space-y-2">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        Choose Logo Style
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setLocalBranding({ ...localBranding, logoType: 'image' })}
                          className={`p-4 rounded-2xl border text-left transition-all flex items-start space-x-3 ${
                            localBranding.logoType === 'image'
                              ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <ImageIcon className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              Custom Image Logo
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Upload your brand icon, symbol, or badge photo
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setLocalBranding({ ...localBranding, logoType: 'letter' })}
                          className={`p-4 rounded-2xl border text-left transition-all flex items-start space-x-3 ${
                            localBranding.logoType === 'letter'
                              ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-black flex items-center justify-center text-xs mt-0.5 shrink-0">
                            B
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              Monogram Letter Badge
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Clean typographic initial with vibrant accent fill
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* IF LOGO TYPE IS IMAGE */}
                    {localBranding.logoType === 'image' && (
                      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-800 dark:text-slate-200">
                            Logo Image Source
                          </label>

                          <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg text-[11px] font-semibold">
                            <button
                              type="button"
                              onClick={() => setLogoUploadMode('upload')}
                              className={`px-2.5 py-1 rounded-md transition-all ${
                                logoUploadMode === 'upload'
                                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              Upload File
                            </button>
                            <button
                              type="button"
                              onClick={() => setLogoUploadMode('url')}
                              className={`px-2.5 py-1 rounded-md transition-all ${
                                logoUploadMode === 'url'
                                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              Image URL
                            </button>
                            <button
                              type="button"
                              onClick={() => setLogoUploadMode('presets')}
                              className={`px-2.5 py-1 rounded-md transition-all ${
                                logoUploadMode === 'presets'
                                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              Presets
                            </button>
                          </div>
                        </div>

                        {/* MODE 1: FILE UPLOAD */}
                        {logoUploadMode === 'upload' && (
                          <div className="space-y-2">
                            <input
                              type="file"
                              ref={logoFileInputRef}
                              onChange={handleLogoFileUpload}
                              accept="image/*"
                              className="hidden"
                            />
                            <div
                              onClick={() => logoFileInputRef.current?.click()}
                              className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all flex flex-col items-center justify-center space-y-1.5"
                            >
                              <Upload className="w-6 h-6 text-indigo-500" />
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                Click to upload brand logo file
                              </span>
                              <span className="text-[10px] text-slate-400">
                                PNG, SVG, JPG or WEBP (transparent background recommended)
                              </span>
                            </div>
                          </div>
                        )}

                        {/* MODE 2: URL INPUT */}
                        {logoUploadMode === 'url' && (
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                              Direct Logo Image URL
                            </label>
                            <input
                              type="url"
                              value={localBranding.logoImageUrl}
                              onChange={(e) =>
                                setLocalBranding({ ...localBranding, logoImageUrl: e.target.value })
                              }
                              placeholder="https://example.com/logo.png"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                            />
                          </div>
                        )}

                        {/* MODE 3: PRESETS */}
                        {logoUploadMode === 'presets' && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {LOGO_PRESETS.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() =>
                                  setLocalBranding({ ...localBranding, logoImageUrl: preset.url })
                                }
                                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center space-y-1.5 ${
                                  localBranding.logoImageUrl === preset.url
                                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.name}
                                  className="w-10 h-10 rounded-xl object-cover shadow-xs"
                                />
                                <span className="font-bold text-[10px] text-slate-800 dark:text-slate-200 line-clamp-1">
                                  {preset.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Active Image Preview & Clear */}
                        {localBranding.logoImageUrl && (
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center space-x-2">
                              <img
                                src={localBranding.logoImageUrl}
                                alt="Active logo"
                                className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-600"
                              />
                              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                Active Logo Image Loaded
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setLocalBranding({
                                  ...localBranding,
                                  logoImageUrl: '',
                                  logoType: 'letter',
                                })
                              }
                              className="text-[11px] text-rose-500 hover:underline"
                            >
                              Remove Image
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* IF LOGO TYPE IS MONOGRAM LETTER */}
                    {localBranding.logoType === 'letter' && (
                      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                        <label className="font-bold text-slate-800 dark:text-slate-200">
                          Monogram Character(s)
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            maxLength={3}
                            value={localBranding.logoText}
                            onChange={(e) =>
                              setLocalBranding({
                                ...localBranding,
                                logoText: e.target.value.toUpperCase(),
                              })
                            }
                            placeholder="e.g. B or BB"
                            className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-center text-base"
                          />
                          <p className="text-[11px] text-slate-500">
                            Enter 1 to 3 letters for your store monogram badge.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PRIMARY BRAND ACCENT COLOR */}
                    <div className="space-y-2">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        Primary Brand Color Theme
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {COLOR_PALETTES.map((color) => (
                          <button
                            key={color.hex}
                            type="button"
                            onClick={() =>
                              setLocalBranding({ ...localBranding, primaryColor: color.hex })
                            }
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold ${
                              localBranding.primaryColor === color.hex
                                ? 'border-slate-900 dark:border-white shadow-sm ring-2 ring-slate-400/40'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.name}</span>
                          </button>
                        ))}
                      </div>

                      {/* Custom Hex input */}
                      <div className="flex items-center space-x-2 pt-2">
                        <span className="text-[11px] text-slate-500 font-medium">Custom Hex:</span>
                        <input
                          type="color"
                          value={localBranding.primaryColor || '#4f46e5'}
                          onChange={(e) =>
                            setLocalBranding({ ...localBranding, primaryColor: e.target.value })
                          }
                          className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={localBranding.primaryColor}
                          onChange={(e) =>
                            setLocalBranding({ ...localBranding, primaryColor: e.target.value })
                          }
                          className="w-24 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs uppercase"
                        />
                      </div>
                    </div>

                    {/* Save Branding Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center space-x-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save &amp; Apply Store Logo &amp; Branding</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
