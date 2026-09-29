import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { Navbar, WishlistToastEvent } from './components/ecommerce/Navbar';
import { HeroBanner } from './components/ecommerce/HeroBanner';
import { ProductCatalog } from './components/ecommerce/ProductCatalog';
import { CartDrawer } from './components/ecommerce/CartDrawer';
import { WishlistDrawer } from './components/ecommerce/WishlistDrawer';
import { QuickViewModal } from './components/ecommerce/QuickViewModal';
import { AdminPortalModal } from './components/ecommerce/AdminPortalModal';
import { AuthModal } from './components/ecommerce/AuthModal';
import { OrderHistoryModal } from './components/ecommerce/OrderHistoryModal';
import { Footer } from './components/ecommerce/Footer';
import { ClientServicesModal, ClientServiceTab } from './components/ecommerce/ClientServicesModal';
import { OrderSuccessModal } from './components/ecommerce/OrderSuccessModal';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_OFFERS } from './data/mockEcommerce';
import { sendOrderConfirmationEmail } from './utils/emailNotifier';
import {
  Product,
  Order,
  CartItem,
  CategoryFilter,
  ShippingAddress,
  StoreBrandingSettings,
  PaymentGatewaySettings,
  UserProfile,
  StoreOffersSettings,
} from './types/ecommerce';

const INITIAL_BRANDING: StoreBrandingSettings = {
  storeName: 'BRAND BAZAAR',
  storeTagline: 'The Everything Premium Marketplace',
  logoType: 'letter',
  logoText: 'B',
  logoImageUrl: '',
  primaryColor: '#4f46e5',
};

const INITIAL_GATEWAYS: PaymentGatewaySettings = {
  upi: {
    enabled: true,
    upiId: 'brandbazaar@icici',
    merchantName: 'Brand Bazaar Flagship',
    allowAutoVerify: true,
  },
  netbanking: {
    enabled: true,
    allowAllIndianBanks: true,
  },
  stripe: {
    enabled: true,
    publishableKey: 'pk_test_51Mz0exampleStripeKey994',
    secretKeyMasked: 'sk_test_••••••••••••••••••••••',
    testMode: true,
  },
  cod: {
    enabled: true,
    extraFee: 0,
  },
  freeDeliveryThreshold: 1999,
  standardShippingFee: 199,
  currency: 'INR',
  currencySymbol: '₹',
};

export default function App() {
  // Store inventory state (with localStorage persistence & Rupee seed migration)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('brand_bazaar_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].price < 1000) {
          return INITIAL_PRODUCTS;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Store orders state (with localStorage persistence)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('brand_bazaar_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].total < 1000) {
          return INITIAL_ORDERS;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('brand_bazaar_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('brand_bazaar_wishlist');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    return new Set(['prod-01', 'prod-04']);
  });

  // Branding & Logo Settings state
  const [branding, setBranding] = useState<StoreBrandingSettings>(() => {
    const saved = localStorage.getItem('brand_bazaar_branding');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BRANDING;
  });

  // Payment Gateway Settings state
  const [gatewaySettings, setGatewaySettings] = useState<PaymentGatewaySettings>(() => {
    const saved = localStorage.getItem('brand_bazaar_gateways');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_GATEWAYS,
          ...parsed,
          upi: parsed.upi || INITIAL_GATEWAYS.upi,
          netbanking: parsed.netbanking || INITIAL_GATEWAYS.netbanking,
          currency: 'INR',
          currencySymbol: '₹',
        };
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_GATEWAYS;
  });

  // Store Offers & Promotions state
  const [offers, setOffers] = useState<StoreOffersSettings>(() => {
    const saved = localStorage.getItem('brand_bazaar_offers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_OFFERS,
          ...parsed,
          flashSale: {
            ...INITIAL_OFFERS.flashSale,
            ...(parsed.flashSale || {}),
          },
          coupons: Array.isArray(parsed.coupons) ? parsed.coupons : INITIAL_OFFERS.coupons,
          promotions: Array.isArray(parsed.promotions) ? parsed.promotions : INITIAL_OFFERS.promotions,
        };
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_OFFERS;
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [lastWishlistEvent, setLastWishlistEvent] = useState<WishlistToastEvent | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('bb_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [orderSuccessModal, setOrderSuccessModal] = useState<{
    isOpen: boolean;
    order: Order | null;
  }>({
    isOpen: false,
    order: null,
  });
  const [clientServicesState, setClientServicesState] = useState<{
    isOpen: boolean;
    initialTab: ClientServiceTab;
  }>({
    isOpen: false,
    initialTab: 'faq',
  });

  const primaryColor = branding.primaryColor || '#4f46e5';

  const [vipMembers, setVipMembers] = useState<Array<{ phone: string; countryCode: string; date: string; code: string }>>(() => {
    try {
      const saved = localStorage.getItem('bb_vip_members');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleRegisterVip = (member: { phone: string; countryCode: string; date: string; code: string }) => {
    setVipMembers((prev) => {
      const exists = prev.some((m) => m.phone === member.phone && m.countryCode === member.countryCode);
      if (exists) return prev;
      const next = [member, ...prev];
      try {
        localStorage.setItem('bb_vip_members', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleUserLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('bb_current_user', JSON.stringify(user));
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bb_current_user');
  };

  // Persist products
  useEffect(() => {
    localStorage.setItem('brand_bazaar_products', JSON.stringify(products));
  }, [products]);

  // Persist orders
  useEffect(() => {
    localStorage.setItem('brand_bazaar_orders', JSON.stringify(orders));
  }, [orders]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('brand_bazaar_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('brand_bazaar_wishlist', JSON.stringify(Array.from(wishlistIds)));
  }, [wishlistIds]);

  // Check URL query param for deep linking directly to shared product (e.g. /?product=prod-01)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sharedProductId = params.get('product');
      if (sharedProductId) {
        const found = products.find((p) => p.id === sharedProductId);
        if (found) {
          setQuickViewProduct(found);
        }
      }
      const searchParam = params.get('search');
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    } catch {
      // Ignore URL parse errors
    }
  }, [products]);

  // Persist branding
  useEffect(() => {
    localStorage.setItem('brand_bazaar_branding', JSON.stringify(branding));
  }, [branding]);

  // Persist payment gateways
  useEffect(() => {
    localStorage.setItem('brand_bazaar_gateways', JSON.stringify(gatewaySettings));
  }, [gatewaySettings]);

  // Persist offers and promotions
  useEffect(() => {
    localStorage.setItem('brand_bazaar_offers', JSON.stringify(offers));
  }, [offers]);

  // Cart operations
  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
      }
    });
  };

  const handleUpdateCartQuantity = (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (productId: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      const isAlreadyIn = next.has(product.id);
      if (isAlreadyIn) {
        next.delete(product.id);
        setLastWishlistEvent({ product, action: 'removed', timestamp: Date.now() });
      } else {
        next.add(product.id);
        setLastWishlistEvent({ product, action: 'added', timestamp: Date.now() });
      }
      return next;
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        setLastWishlistEvent({ product: prod, action: 'removed', timestamp: Date.now() });
      }
      return next;
    });
  };

  // Checkout operation
  const handleCheckout = async (
    shippingAddress: ShippingAddress,
    paymentMethod: string,
    appliedCoupon?: {
      code: string;
      discountAmount: number;
      discountType: string;
      discountValue: number;
    } | null
  ): Promise<string> => {
    // 1. Validation Step: Check payment status from selected gateway before moving order to PAID status
    const isCod = paymentMethod.toLowerCase().includes('cash on delivery') || paymentMethod.toLowerCase().includes('cod');

    if (!isCod) {
      const hasValidGatewayVerification =
        paymentMethod.includes('Txn:') ||
        paymentMethod.includes('Ref:') ||
        paymentMethod.includes('Paid') ||
        paymentMethod.includes('Authorized') ||
        paymentMethod.includes('Verified');

      if (!hasValidGatewayVerification) {
        throw new Error(
          `Payment verification failed for "${paymentMethod}". Orders cannot be marked as PAID without valid gateway transaction verification or tokenization.`
        );
      }
    }

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const freeDeliveryThreshold = gatewaySettings.freeDeliveryThreshold ?? (gatewaySettings.shipping?.freeDeliveryThreshold ?? 1999);
    const standardShippingFee = gatewaySettings.standardShippingFee ?? (gatewaySettings.shipping?.standardShippingFee ?? 199);
    const isFreeShipping = subtotal === 0 || freeDeliveryThreshold === 0 || subtotal >= freeDeliveryThreshold;
    const shipping = isFreeShipping ? 0 : standardShippingFee;
    const tax = Math.round(discountedSubtotal * 0.05); // 5% GST
    const codExtra = paymentMethod === 'Cash on Delivery' && gatewaySettings.cod?.enabled ? (gatewaySettings.cod.extraFee || 0) : 0;
    const total = discountedSubtotal + shipping + tax + codExtra;

    const orderItems = cart.map((c) => ({
      productId: c.product.id,
      name: c.product.name,
      brand: c.product.brand,
      price: c.product.price,
      quantity: c.quantity,
      image: c.product.image,
      selectedSize: c.selectedSize,
      selectedColor: c.selectedColor,
      product: c.product,
    }));

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: shippingAddress,
      items: orderItems,
      subtotal,
      discount: discountAmount > 0 ? discountAmount : undefined,
      couponCode: appliedCoupon?.code,
      shipping,
      tax,
      total,
      status: 'PROCESSING',
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID',
      createdAt: new Date().toISOString(),
      trackingNumber: `BBZ-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: '2-4 Business Days',
    };

    // Update product stock counts
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.find((c) => c.product.id === prod.id);
        if (cartMatch) {
          const nextStock = Math.max(0, prod.stockCount - cartMatch.quantity);
          return { ...prod, stockCount: nextStock, inStock: nextStock > 0 };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Trigger order confirmation email to customer via Node.js Express backend / SendGrid API
    await sendOrderConfirmationEmail(newOrder);

    // Redirect UI flow to Order Success confirmation modal immediately after promise resolves
    setIsCartOpen(false);
    setOrderSuccessModal({ isOpen: true, order: newOrder });

    // Clear cart
    setCart([]);

    return newOrder.id;
  };

  // Admin operations
  const handleAddProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [product, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const handleUpdateOrderTracking = (orderId: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, trackingNumber } : ord))
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistProducts = products.filter((p) => wishlistIds.has(p.id));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* 1. Global Navigation Bar with Dynamic Logo */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTrackOrder={() => setClientServicesState({ isOpen: true, initialTab: 'track' })}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        branding={branding}
        flashSale={offers.flashSale}
        lastWishlistEvent={lastWishlistEvent}
        onClearWishlistToast={() => setLastWishlistEvent(null)}
      />

      {/* 2. Top Hero Visual Banner (Only visible on All Categories view) */}
      <div className={`transition-all ease-out overflow-hidden ${selectedCategory === 'All' && !searchQuery.trim() ? 'max-h-[1000px] opacity-100 duration-1500' : 'max-h-0 opacity-0 duration-1000'}`}>
        <HeroBanner
          onExplore={(cat) => setSelectedCategory(cat)}
          primaryColor={primaryColor}
          flashSale={offers.flashSale}
        />
      </div>

      {/* 3. Product Catalog Grid */}
      <main className="flex-1">
        <ProductCatalog
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          onQuickView={(p) => setQuickViewProduct(p)}
          primaryColor={primaryColor}
        />
      </main>

      {/* 4. Global Footer with VIP Mobile Join and Dynamic Logo */}
      <Footer
        onSelectCategory={setSelectedCategory}
        branding={branding}
        primaryColor={primaryColor}
        onOpenClientServices={(tab) => setClientServicesState({ isOpen: true, initialTab: tab })}
        offers={offers}
        onRegisterVip={handleRegisterVip}
      />

      {/* 5. Drawers and Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
        gatewaySettings={gatewaySettings}
        primaryColor={primaryColor}
        coupons={offers.coupons}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        primaryColor={primaryColor}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.has(quickViewProduct.id) : false}
        primaryColor={primaryColor}
        freeDeliveryThreshold={gatewaySettings.freeDeliveryThreshold ?? 1999}
      />

      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateOrderTracking={handleUpdateOrderTracking}
        gatewaySettings={gatewaySettings}
        onUpdateGatewaySettings={setGatewaySettings}
        branding={branding}
        onUpdateBranding={setBranding}
        primaryColor={primaryColor}
        offers={offers}
        onUpdateOffers={setOffers}
        vipMembers={vipMembers}
      />

      <ClientServicesModal
        isOpen={clientServicesState.isOpen}
        onClose={() => setClientServicesState((prev) => ({ ...prev, isOpen: false }))}
        initialTab={clientServicesState.initialTab}
        orders={orders}
        primaryColor={primaryColor}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={handleUserLogin}
        onLogout={handleUserLogout}
        onViewOrderHistory={() => {
          setIsAuthOpen(false);
          setIsOrderHistoryOpen(true);
        }}
        primaryColor={primaryColor}
        storeName={branding.storeName}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        currentUser={currentUser}
        branding={branding}
        onStartShopping={() => {
          setSelectedCategory('All');
        }}
      />

      <OrderSuccessModal
        isOpen={orderSuccessModal.isOpen}
        onClose={() => setOrderSuccessModal({ isOpen: false, order: null })}
        order={orderSuccessModal.order}
        primaryColor={primaryColor}
      />

      {/* Discrete Floating Admin Portal Trigger (Bottom-Left Only) */}
      <button
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-5 left-5 z-40 bg-slate-900/90 dark:bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md shadow-2xl px-3.5 py-2.5 rounded-2xl flex items-center space-x-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 group"
        title="Store Manager Admin Portal"
      >
        <div className="w-5 h-5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <Lock className="w-3 h-3" />
        </div>
        <span className="tracking-wide">Admin Portal</span>
      </button>
    </div>
  );
}
