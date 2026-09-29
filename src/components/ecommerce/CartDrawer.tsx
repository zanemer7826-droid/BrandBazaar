import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  Check,
  User,
  UserCheck,
  UserPlus,
  LogIn,
  Sparkles,
  AlertCircle,
  KeyRound,
  LogOut,
  Download,
  FileText,
  Tag,
  Percent,
  ChevronDown,
  ChevronUp,
  Gift,
} from 'lucide-react';
import {
  CartItem,
  ShippingAddress,
  PaymentGatewaySettings,
  UserProfile,
  Order,
  CouponOffer,
} from '../../types/ecommerce';
import { formatRupees } from '../../utils/currency';
import { downloadOrderInvoice } from '../../utils/invoiceGenerator';
import { DynamicUpiQrModal } from './DynamicUpiQrModal';
import { IndianBankRedirectModal } from './IndianBankRedirectModal';
import { SecureCardPaymentModal } from './SecureCardPaymentModal';
import { INDIAN_BANKS, IndianBank } from '../../data/indianBanks';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, qty: number, size?: string, color?: string) => void;
  onRemoveItem: (productId: string, size?: string, color?: string) => void;
  onCheckout: (
    address: ShippingAddress,
    paymentMethod: string,
    appliedCoupon?: {
      code: string;
      discountAmount: number;
      discountType: string;
      discountValue: number;
    } | null
  ) => Promise<string>;
  gatewaySettings: PaymentGatewaySettings;
  primaryColor: string;
  coupons?: CouponOffer[];
}

const COUNTRY_OPTIONS = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  gatewaySettings,
  primaryColor,
  coupons = [],
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [isUpiQrOpen, setIsUpiQrOpen] = useState(false);
  const [isNetbankingModalOpen, setIsNetbankingModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<IndianBank>(INDIAN_BANKS[0]); // Default SBI
  const [itemPendingRemoval, setItemPendingRemoval] = useState<CartItem | null>(null);

  // Coupon Code & Discount State
  const [inputCouponCode, setInputCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponOffer | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  // Customer Checkout Authentication State
  const [checkoutAuthMode, setCheckoutAuthMode] = useState<'guest' | 'login' | 'signup'>('guest');
  const [loggedInUser, setLoggedInUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('bb_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('ananya.verma@example.in');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Signup form state
  const [signupName, setSignupName] = useState('Rohan Sen');
  const [signupEmail, setSignupEmail] = useState('rohan.sen@example.in');
  const [signupPhone, setSignupPhone] = useState('98765 43210');
  const [signupPassword, setSignupPassword] = useState('rohanPass2026');

  // Auth feedback state
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Country Code state - Defaults to India +91
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [rawPhone, setRawPhone] = useState('98201 55678');

  // Shipping form state with Indian Defaults
  const [shippingForm, setShippingForm] = useState<ShippingAddress>({
    fullName: 'Ananya Verma',
    email: 'ananya.verma@example.in',
    phone: '+91 98201 55678',
    street: 'Bungalow 7, Juhu Tara Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400049',
    country: 'India',
  });

  // Sync logged in user data to shipping details
  useEffect(() => {
    if (loggedInUser) {
      setShippingForm((prev) => ({
        ...prev,
        fullName: loggedInUser.name || prev.fullName,
        email: loggedInUser.email || prev.email,
        phone: loggedInUser.phone ? `${loggedInUser.countryCode || '+91'} ${loggedInUser.phone}` : prev.phone,
      }));
      if (loggedInUser.phone) {
        setRawPhone(loggedInUser.phone.replace('+91', '').trim());
      }
    }
  }, [loggedInUser]);

  const handleCheckoutLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const cleanId = loginIdentifier.trim().toLowerCase();
    if (!cleanId || !loginPassword.trim()) {
      setAuthError('Please enter both email/phone and password.');
      return;
    }

    try {
      const existingUsersRaw = localStorage.getItem('bb_registered_users');
      const registeredUsers: Array<{ name: string; email: string; phone: string; password?: string }> = existingUsersRaw
        ? JSON.parse(existingUsersRaw)
        : [];

      const matched = registeredUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanId ||
          u.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
      );

      // Support demo account or matched registered user
      if (matched || cleanId === 'ananya.verma@example.in' || cleanId.includes('@')) {
        const userProfile: UserProfile = {
          id: `usr-${Date.now()}`,
          name: matched ? matched.name : (cleanId.split('@')[0] || 'Customer'),
          email: matched ? matched.email : cleanId,
          phone: matched ? matched.phone : '98201 55678',
          countryCode: '+91',
          isVip: true,
          vipSince: '2026',
          loginMethod: 'email_otp',
        };

        localStorage.setItem('bb_current_user', JSON.stringify(userProfile));
        setLoggedInUser(userProfile);
        setAuthSuccess(`Welcome back, ${userProfile.name}!`);
        setCheckoutAuthMode('guest');
      } else {
        setAuthError('Invalid credentials. If you are new, please use the Sign Up tab.');
      }
    } catch {
      setAuthError('Error authenticating. Please try again or continue as guest.');
    }
  };

  const handleCheckoutSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setAuthError('Please complete all required fields.');
      return;
    }

    try {
      const existingUsersRaw = localStorage.getItem('bb_registered_users');
      const registeredUsers: Array<{ name: string; email: string; phone: string; password?: string }> = existingUsersRaw
        ? JSON.parse(existingUsersRaw)
        : [];

      const newUserRecord = {
        name: signupName.trim(),
        email: signupEmail.trim().toLowerCase(),
        phone: signupPhone.trim(),
        password: signupPassword,
      };

      const updated = [newUserRecord, ...registeredUsers.filter((u) => u.email !== newUserRecord.email)];
      localStorage.setItem('bb_registered_users', JSON.stringify(updated));

      const newProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        name: signupName.trim(),
        email: signupEmail.trim().toLowerCase(),
        phone: signupPhone.trim(),
        countryCode: '+91',
        isVip: true,
        vipSince: '2026',
        loginMethod: 'email_otp',
      };

      localStorage.setItem('bb_current_user', JSON.stringify(newProfile));
      setLoggedInUser(newProfile);
      setAuthSuccess(`Account created! Welcome to Brand Bazaar VIP, ${signupName}!`);
      setCheckoutAuthMode('guest');
    } catch {
      setAuthError('Error creating account. Please try again.');
    }
  };

  const handleCheckoutLogout = () => {
    localStorage.removeItem('bb_current_user');
    setLoggedInUser(null);
    setAuthSuccess('You have logged out.');
  };

  // Calculate available payment methods:
  // PayPal & Apple Pay REMOVED as requested.
  // UPI Dynamic QR & Netbanking with Indian Banks added as requested.
  const availableMethods: { id: string; label: string; icon: string; subtitle: string }[] = [];

  // 1. UPI Dynamic QR
  if (gatewaySettings.upi?.enabled) {
    availableMethods.push({
      id: 'UPI Dynamic QR',
      label: 'UPI (Dynamic QR Code)',
      icon: '⚡',
      subtitle: 'Scan with GPay, PhonePe, Paytm, CRED',
    });
  }

  // 2. Netbanking (Indian Banks)
  if (gatewaySettings.netbanking?.enabled !== false) {
    availableMethods.push({
      id: 'Netbanking',
      label: 'Netbanking (Indian Banks)',
      icon: '🏛️',
      subtitle: 'SBI, HDFC, ICICI, Axis, Kotak & 20+ Banks',
    });
  }

  // 3. Card Payments (RuPay, Visa, Mastercard)
  if (gatewaySettings.stripe?.enabled) {
    availableMethods.push({
      id: 'Credit / Debit Card',
      label: 'Credit / Debit Card',
      icon: '💳',
      subtitle: 'RuPay, Visa, Mastercard, AMEX',
    });
  }

  // 4. Cash on Delivery (COD)
  if (gatewaySettings.cod?.enabled) {
    availableMethods.push({
      id: 'Cash on Delivery',
      label: 'Cash on Delivery (COD)',
      icon: '💵',
      subtitle: 'Pay cash on doorstep delivery',
    });
  }

  if (availableMethods.length === 0) {
    availableMethods.push({
      id: 'UPI Dynamic QR',
      label: 'UPI (Dynamic QR Code)',
      icon: '⚡',
      subtitle: 'Instant QR payment',
    });
  }

  const [paymentMethod, setPaymentMethod] = useState<string>(availableMethods[0]?.id || 'UPI Dynamic QR');

  const subtotal = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

  // Auto-remove applied coupon if minimum spend condition is no longer met
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.minSpend && subtotal < appliedCoupon.minSpend) {
      setCouponFeedback({
        type: 'error',
        message: `Cart subtotal dropped below minimum spend of ${formatRupees(
          appliedCoupon.minSpend
        )}. Coupon "${appliedCoupon.code}" removed.`,
      });
      setAppliedCoupon(null);
    }
  }, [subtotal, appliedCoupon]);

  if (!isOpen) return null;

  const freeDeliveryThreshold =
    gatewaySettings.freeDeliveryThreshold ??
    (gatewaySettings.shipping?.freeDeliveryThreshold ?? 1999);
  const standardShippingFee =
    gatewaySettings.standardShippingFee ??
    (gatewaySettings.shipping?.standardShippingFee ?? 199);

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.round((subtotal * appliedCoupon.discountValue) / 100)
      : Math.min(subtotal, appliedCoupon.discountValue)
    : 0;

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const isFreeShipping =
    subtotal === 0 ||
    freeDeliveryThreshold === 0 ||
    subtotal >= freeDeliveryThreshold;
  const shipping = isFreeShipping ? 0 : standardShippingFee;
  const tax = Math.round(discountedSubtotal * 0.05); // 5% GST on discounted subtotal
  const codExtra =
    paymentMethod === 'Cash on Delivery' && gatewaySettings.cod?.enabled
      ? gatewaySettings.cod.extraFee || 0
      : 0;
  const total = discountedSubtotal + shipping + tax + codExtra;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || inputCouponCode).trim().toUpperCase();
    if (!code) {
      setCouponFeedback({ type: 'error', message: 'Please enter a coupon code.' });
      return;
    }

    const availableList = coupons || [];
    const matched = availableList.find((c) => c.code.toUpperCase() === code);

    if (!matched) {
      setCouponFeedback({ type: 'error', message: `Invalid promo coupon code "${code}".` });
      return;
    }

    if (!matched.enabled) {
      setCouponFeedback({
        type: 'error',
        message: `Coupon code "${code}" is currently paused or inactive.`,
      });
      return;
    }

    if (matched.minSpend && subtotal < matched.minSpend) {
      setCouponFeedback({
        type: 'error',
        message: `Coupon "${code}" requires minimum spend of ${formatRupees(
          matched.minSpend
        )}. Add ${formatRupees(matched.minSpend - subtotal)} more to apply!`,
      });
      return;
    }

    setAppliedCoupon(matched);
    const calculatedDiscount =
      matched.discountType === 'percentage'
        ? Math.round((subtotal * matched.discountValue) / 100)
        : Math.min(subtotal, matched.discountValue);

    setCouponFeedback({
      type: 'success',
      message: `Coupon "${matched.code}" applied! You saved ${formatRupees(calculatedDiscount)}.`,
    });
    setInputCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponFeedback(null);
  };

  const couponPayload = appliedCoupon
    ? {
        code: appliedCoupon.code,
        discountAmount,
        discountType: appliedCoupon.discountType,
        discountValue: appliedCoupon.discountValue,
      }
    : null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure phone has country code
    const fullPhone = `${phoneCountryCode} ${rawPhone}`.trim();
    const currentAddress: ShippingAddress = {
      ...shippingForm,
      phone: fullPhone,
    };

    // 1. If UPI Dynamic QR is chosen, open dynamic QR modal
    if (paymentMethod === 'UPI Dynamic QR') {
      setIsUpiQrOpen(true);
      return;
    }

    // 2. If Netbanking is chosen, open bank redirect modal
    if (paymentMethod === 'Netbanking') {
      setIsNetbankingModalOpen(true);
      return;
    }

    // 3. If Credit / Debit Card is chosen, open secure card payment modal
    if (paymentMethod === 'Credit / Debit Card') {
      setIsCardModalOpen(true);
      return;
    }

    // 4. Cash on Delivery (COD) - Pay upon doorstep delivery
    setIsSubmitting(true);
    try {
      const orderId = await onCheckout(currentAddress, paymentMethod, couponPayload);
      setCreatedOrderId(orderId);
      setStep('success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardPaymentSuccess = async (cardLast4: string) => {
    setIsCardModalOpen(false);
    setIsSubmitting(true);
    try {
      const currentAddress: ShippingAddress = {
        ...shippingForm,
        phone: `${phoneCountryCode} ${rawPhone}`.trim(),
      };
      const orderId = await onCheckout(
        currentAddress,
        `Credit / Debit Card (Paid •••• ${cardLast4})`,
        couponPayload
      );
      setCreatedOrderId(orderId);
      setStep('success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpiPaymentSuccess = async (transactionId: string) => {
    setIsUpiQrOpen(false);
    setIsSubmitting(true);
    try {
      const currentAddress: ShippingAddress = {
        ...shippingForm,
        phone: `${phoneCountryCode} ${rawPhone}`.trim(),
      };
      const orderId = await onCheckout(
        currentAddress,
        `UPI Dynamic QR (Txn: ${transactionId})`,
        couponPayload
      );
      setCreatedOrderId(orderId);
      setStep('success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNetbankingSuccess = async (bankTxnRef: string, bank: IndianBank) => {
    setIsNetbankingModalOpen(false);
    setIsSubmitting(true);
    try {
      const currentAddress: ShippingAddress = {
        ...shippingForm,
        phone: `${phoneCountryCode} ${rawPhone}`.trim(),
      };
      const orderId = await onCheckout(
        currentAddress,
        `Netbanking - ${bank.name} (Txn: ${bankTxnRef})`,
        couponPayload
      );
      setCreatedOrderId(orderId);
      setStep('success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeUpiId = gatewaySettings.upi?.upiId || 'brandbazaar@icici';
  const activeMerchantName = gatewaySettings.upi?.merchantName || 'Brand Bazaar Flagship';

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {step === 'cart'
                    ? `Shopping Bag (${items.reduce((a, b) => a + b.quantity, 0)})`
                    : step === 'checkout'
                    ? 'Secure Checkout'
                    : 'Order Confirmed!'}
                </h2>
                <p className="text-xs text-slate-400">
                  {step === 'cart'
                    ? 'Review items & calculate express shipping'
                    : step === 'checkout'
                    ? 'Shipping Address & Payment Method'
                    : `Order Ref #${createdOrderId}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: CART ITEMS */}
            {step === 'cart' && (
              <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Truck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        Your bag is empty
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Explore our premium fashion, luxury timepieces, footwear, and smart gadgets.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-opacity hover:opacity-95"
                      style={{ backgroundColor: primaryColor || '#4f46e5' }}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-6 space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                      {items.map((item, idx) => (
                        <div key={idx} className="pt-4 first:pt-0 flex items-start space-x-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">
                              {item.product.brand}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                              {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                              {item.selectedColor && (
                                <span className="flex items-center space-x-1">
                                  <span>Color:</span>
                                  <span
                                    className="w-2.5 h-2.5 rounded-full inline-block border border-slate-300 dark:border-slate-600"
                                    style={{ backgroundColor: item.selectedColor }}
                                  />
                                </span>
                              )}
                            </div>
                            <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                              {formatRupees(item.product.price)}
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            <button
                              type="button"
                              onClick={() => setItemPendingRemoval(item)}
                              title="Remove item"
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex items-center space-x-1 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800">
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.quantity <= 1) {
                                    setItemPendingRemoval(item);
                                  } else {
                                    onUpdateQuantity(
                                      item.product.id,
                                      item.quantity - 1,
                                      item.selectedSize,
                                      item.selectedColor
                                    );
                                  }
                                }}
                                title={item.quantity <= 1 ? "Remove item" : "Decrease quantity"}
                                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(
                                    item.product.id,
                                    item.quantity + 1,
                                    item.selectedSize,
                                    item.selectedColor
                                  )
                                }
                                title="Increase quantity"
                                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Summary & Proceed */}
                    <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                      {/* FREE DELIVERY THRESHOLD STATUS BAR */}
                      {freeDeliveryThreshold > 0 && (
                        <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200">
                              <Truck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>
                                {subtotal >= freeDeliveryThreshold
                                  ? '🎉 You unlocked FREE Express Delivery!'
                                  : `Add ${formatRupees(
                                      freeDeliveryThreshold - subtotal
                                    )} more for FREE Express Delivery`}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                              {subtotal >= freeDeliveryThreshold
                                ? '100%'
                                : `${Math.min(
                                    100,
                                    Math.round((subtotal / freeDeliveryThreshold) * 100)
                                  )}%`}
                            </span>
                          </div>

                          {/* Progress bar track */}
                          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round((subtotal / freeDeliveryThreshold) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* COUPON & PROMO CODE INPUT BOX */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-white">
                            <Tag className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Apply Promo / Coupon Code</span>
                          </div>
                          {coupons.filter((c) => c.enabled).length > 0 && (
                            <button
                              type="button"
                              onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-0.5"
                            >
                              <span>{coupons.filter((c) => c.enabled).length} Offers Available</span>
                              {showAvailableCoupons ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Applied Coupon Badge */}
                        {appliedCoupon ? (
                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-2 animate-in fade-in">
                            <div className="flex items-center space-x-2 min-w-0">
                              <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0">
                                ✓
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center space-x-1.5">
                                  <span className="font-mono font-black text-xs text-emerald-800 dark:text-emerald-300">
                                    {appliedCoupon.code}
                                  </span>
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200">
                                    {appliedCoupon.discountType === 'percentage'
                                      ? `${appliedCoupon.discountValue}% OFF`
                                      : `₹${appliedCoupon.discountValue} OFF`}
                                  </span>
                                </div>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate">
                                  You save {formatRupees(discountAmount)} on this order
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              className="text-slate-400 hover:text-rose-600 p-1 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors"
                              title="Remove coupon"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          /* Enter Coupon Input */
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={inputCouponCode}
                                onChange={(e) => {
                                  setInputCouponCode(e.target.value.toUpperCase());
                                  setCouponFeedback(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleApplyCoupon();
                                  }
                                }}
                                placeholder="e.g. BAZAAR-VIP15"
                                className="w-full pl-3 pr-3 py-2 text-xs font-mono font-bold uppercase rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApplyCoupon()}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-transform hover:scale-105 active:scale-95 shrink-0"
                              style={{ backgroundColor: primaryColor || '#4f46e5' }}
                            >
                              Apply
                            </button>
                          </div>
                        )}

                        {/* Coupon Feedback Message */}
                        {couponFeedback && (
                          <div
                            className={`p-2 rounded-xl text-[11px] font-medium flex items-center space-x-1.5 ${
                              couponFeedback.type === 'success'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                            }`}
                          >
                            {couponFeedback.type === 'success' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            )}
                            <span>{couponFeedback.message}</span>
                          </div>
                        )}

                        {/* Available Store Coupons Accordion */}
                        {showAvailableCoupons && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-150">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                              Available Coupons From Store
                            </div>
                            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                              {coupons
                                .filter((c) => c.enabled)
                                .map((c) => {
                                  const isEligible = !c.minSpend || subtotal >= c.minSpend;
                                  const isCurrent = appliedCoupon?.id === c.id;

                                  return (
                                    <div
                                      key={c.id}
                                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                                        isCurrent
                                          ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-1 ring-indigo-500/30'
                                          : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-700/80'
                                      }`}
                                    >
                                      <div className="min-w-0 space-y-0.5">
                                        <div className="flex items-center space-x-1.5">
                                          <span className="font-mono font-black text-xs text-indigo-600 dark:text-indigo-400">
                                            {c.code}
                                          </span>
                                          {c.tag && (
                                            <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 uppercase">
                                              {c.tag}
                                            </span>
                                          )}
                                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                            {c.discountType === 'percentage'
                                              ? `${c.discountValue}% OFF`
                                              : `₹${c.discountValue} OFF`}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                          {c.description}
                                        </p>
                                        {c.minSpend ? (
                                          <span className="text-[9px] text-slate-400 block">
                                            Min order: {formatRupees(c.minSpend)}{' '}
                                            {!isEligible && `(Add ${formatRupees(c.minSpend - subtotal)} more)`}
                                          </span>
                                        ) : null}
                                      </div>

                                      <button
                                        type="button"
                                        disabled={isCurrent}
                                        onClick={() => handleApplyCoupon(c.code)}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all shrink-0 ${
                                          isCurrent
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                                            : isEligible
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                                        }`}
                                      >
                                        {isCurrent ? 'Applied' : 'Apply'}
                                      </button>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex justify-between">
                          <span>Bag Subtotal</span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {formatRupees(subtotal)}
                          </span>
                        </div>

                        {appliedCoupon && discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                            <span className="flex items-center space-x-1">
                              <Tag className="w-3 h-3" />
                              <span>Coupon Discount ({appliedCoupon.code})</span>
                            </span>
                            <span>- {formatRupees(discountAmount)}</span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span>Express Delivery</span>
                          <span className="font-semibold text-emerald-600">
                            {shipping === 0 ? 'FREE (Over ₹1,999)' : formatRupees(shipping)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated GST (5%)</span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {formatRupees(tax)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                          <span>Total Due</span>
                          <span className="text-base text-indigo-600 dark:text-indigo-400">
                            {formatRupees(total)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setStep('checkout')}
                        className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2 hover:opacity-95"
                        style={{ backgroundColor: primaryColor || '#4f46e5' }}
                      >
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {step === 'checkout' && (
              <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="p-6 space-y-5 text-xs">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>256-bit SSL encrypted &bull; Official Indian Payment Gateway</span>
                  </div>

                  {/* CUSTOMER AUTHENTICATION AT CHECKOUT */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Customer Account</span>
                      </h4>
                      {loggedInUser && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                          <span>VIP Member</span>
                        </span>
                      )}
                    </div>

                    {authError && (
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] font-medium flex items-center space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}

                    {authSuccess && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{authSuccess}</span>
                      </div>
                    )}

                    {/* LOGGED IN USER CARD */}
                    {loggedInUser ? (
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {loggedInUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {loggedInUser.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {loggedInUser.email || loggedInUser.phone}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCheckoutLogout}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1 shrink-0"
                          title="Log out or switch account"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Switch</span>
                        </button>
                      </div>
                    ) : (
                      /* NOT LOGGED IN: TABS FOR GUEST / LOGIN / SIGNUP */
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl text-[11px] font-bold text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setCheckoutAuthMode('guest');
                              setAuthError('');
                              setAuthSuccess('');
                            }}
                            className={`py-1.5 rounded-lg transition-all ${
                              checkoutAuthMode === 'guest'
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-black'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                          >
                            Guest
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCheckoutAuthMode('login');
                              setAuthError('');
                              setAuthSuccess('');
                            }}
                            className={`py-1.5 rounded-lg transition-all ${
                              checkoutAuthMode === 'login'
                                ? 'bg-indigo-600 text-white shadow-xs font-black'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                          >
                            Log In
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCheckoutAuthMode('signup');
                              setAuthError('');
                              setAuthSuccess('');
                            }}
                            className={`py-1.5 rounded-lg transition-all ${
                              checkoutAuthMode === 'signup'
                                ? 'bg-indigo-600 text-white shadow-xs font-black'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                          >
                            Sign Up
                          </button>
                        </div>

                        {/* TAB A: CONTINUE AS GUEST */}
                        {checkoutAuthMode === 'guest' && (
                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-500 flex items-center justify-between">
                            <span>⚡ Checking out as Guest. Fill shipping details below.</span>
                            <button
                              type="button"
                              onClick={() => setCheckoutAuthMode('signup')}
                              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 ml-2"
                            >
                              Want VIP perks? Sign Up &rarr;
                            </button>
                          </div>
                        )}

                        {/* TAB B: LOGIN FORM */}
                        {checkoutAuthMode === 'login' && (
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-900/60 space-y-2.5 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              <span>Sign in to your Brand Bazaar account</span>
                              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">
                                Auto-fills saved address
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                  Email or Phone
                                </label>
                                <input
                                  type="text"
                                  value={loginIdentifier}
                                  onChange={(e) => setLoginIdentifier(e.target.value)}
                                  placeholder="e.g. ananya.verma@example.in"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                  Password / Passcode
                                </label>
                                <input
                                  type="password"
                                  value={loginPassword}
                                  onChange={(e) => setLoginPassword(e.target.value)}
                                  placeholder="Enter password"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={() => setCheckoutAuthMode('signup')}
                                className="text-[10px] text-slate-500 hover:text-indigo-600 hover:underline"
                              >
                                Need an account? Sign up
                              </button>

                              <button
                                type="button"
                                onClick={handleCheckoutLogin}
                                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1"
                              >
                                <LogIn className="w-3 h-3" />
                                <span>Sign In &amp; Auto-fill</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* TAB C: SIGN UP FORM */}
                        {checkoutAuthMode === 'signup' && (
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-900/60 space-y-2.5 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              <span className="flex items-center space-x-1">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>Register New Customer Account</span>
                              </span>
                              <span className="text-[10px] text-emerald-600 font-bold">
                                +500 VIP Coins
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                  Full Name *
                                </label>
                                <input
                                  type="text"
                                  value={signupName}
                                  onChange={(e) => setSignupName(e.target.value)}
                                  placeholder="e.g. Rohan Sen"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                  Email Address *
                                </label>
                                <input
                                  type="email"
                                  value={signupEmail}
                                  onChange={(e) => setSignupEmail(e.target.value)}
                                  placeholder="e.g. rohan@example.in"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                  Mobile Phone
                                </label>
                                <input
                                  type="tel"
                                  value={signupPhone}
                                  onChange={(e) => setSignupPhone(e.target.value)}
                                  placeholder="98765 43210"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                  Create Password *
                                </label>
                                <input
                                  type="password"
                                  value={signupPassword}
                                  onChange={(e) => setSignupPassword(e.target.value)}
                                  placeholder="Min 6 characters"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={() => setCheckoutAuthMode('login')}
                                className="text-[10px] text-slate-500 hover:text-indigo-600 hover:underline"
                              >
                                Already registered? Log in
                              </button>

                              <button
                                type="button"
                                onClick={handleCheckoutSignup}
                                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1"
                              >
                                <UserPlus className="w-3 h-3" />
                                <span>Sign Up &amp; Login</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Contact & Shipping */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center justify-between">
                      <span>Delivery Address</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        🇮🇳 India Pan-Country Shipping
                      </span>
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingForm.fullName}
                          onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1 space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={shippingForm.email}
                          onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>

                      {/* Mobile Number with Default +91 Country Code */}
                      <div className="col-span-2 sm:col-span-1 space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-between">
                          <span>Mobile Number</span>
                          <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold">
                            Default: +91 India
                          </span>
                        </label>
                        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20">
                          <select
                            value={phoneCountryCode}
                            onChange={(e) => setPhoneCountryCode(e.target.value)}
                            className="bg-slate-100 dark:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs px-2 py-2 border-r border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
                          >
                            {COUNTRY_OPTIONS.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            required
                            value={rawPhone}
                            onChange={(e) => setRawPhone(e.target.value)}
                            placeholder="98201 55678"
                            className="w-full px-3 py-2 bg-transparent text-xs font-medium focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="col-span-2 space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Street Address / Flat / Floor
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingForm.street}
                          onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingForm.zipCode}
                          onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                        Select Payment Method
                      </h4>
                      <span className="text-[10px] text-slate-400">Indian Gateways</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableMethods.map((m) => (
                        <button
                          type="button"
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={`p-3 rounded-2xl border text-left font-medium transition-all flex items-start space-x-2.5 ${
                            paymentMethod === m.id
                              ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 font-bold text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="text-lg shrink-0 mt-0.5">{m.icon}</span>
                          <div className="min-w-0">
                            <div className="truncate text-xs font-bold flex items-center space-x-1.5">
                              <span>{m.label}</span>
                              {m.id === 'UPI Dynamic QR' && (
                                <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                  INSTANT
                                </span>
                              )}
                              {m.id === 'Netbanking' && (
                                <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                  DIRECT
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {m.subtitle}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* UPI Dynamic QR Feature Highlight */}
                    {paymentMethod === 'UPI Dynamic QR' && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-indigo-50/40 dark:from-emerald-950/30 dark:to-indigo-950/30 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <div>
                              <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                                Dynamic UPI QR Code Ready
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Exact amount <strong>{formatRupees(total)}</strong> will be encoded in the QR.
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsUpiQrOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center space-x-1 shadow-xs"
                          >
                            <QrCode className="w-3 h-3" />
                            <span>Preview QR</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* NETBANKING INDIAN BANKS DROPDOWN & QUICK SELECTION */}
                    {paymentMethod === 'Netbanking' && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                              Select Your Indian Bank
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {INDIAN_BANKS.length} Indian Banks Supported
                          </span>
                        </div>

                        {/* Popular Banks Quick Select Chips */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Popular Banks
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                            {INDIAN_BANKS.filter((b) => b.popular).map((b) => (
                              <button
                                type="button"
                                key={b.id}
                                onClick={() => setSelectedBank(b)}
                                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                                  selectedBank.id === b.id
                                    ? 'border-indigo-600 bg-white dark:bg-slate-900 ring-2 ring-indigo-500/30 font-extrabold shadow-xs text-indigo-600 dark:text-indigo-400'
                                    : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <span
                                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                                  style={{ backgroundColor: b.color }}
                                >
                                  {b.shortName.slice(0, 3)}
                                </span>
                                <span className="text-[10px] truncate max-w-full font-bold">
                                  {b.shortName}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* All Indian Banks Dropdown List */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Or Select From All Indian Banks List
                          </label>
                          <select
                            value={selectedBank.id}
                            onChange={(e) => {
                              const found = INDIAN_BANKS.find((b) => b.id === e.target.value);
                              if (found) setSelectedBank(found);
                            }}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                          >
                            <optgroup label="Popular Indian Banks">
                              {INDIAN_BANKS.filter((b) => b.popular).map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.name}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Public Sector Banks">
                              {INDIAN_BANKS.filter((b) => b.category === 'Public Sector').map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.name}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Private Sector &amp; Others">
                              {INDIAN_BANKS.filter(
                                (b) => b.category === 'Private Sector' || b.category === 'Small Finance'
                              ).map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.name}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>

                        {/* Selected Bank Banner */}
                        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span
                              className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-black"
                              style={{ backgroundColor: selectedBank.color }}
                            >
                              {selectedBank.shortName.slice(0, 2)}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              Selected: {selectedBank.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                            Direct Bank Redirect
                          </span>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'Cash on Delivery' && gatewaySettings.cod?.extraFee > 0 && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px] border border-amber-200 dark:border-amber-800">
                        A convenience surcharge of {formatRupees(gatewaySettings.cod.extraFee)} applies for COD cash handling.
                      </div>
                    )}
                  </div>
                </div>

                {/* Order total & Submit */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span>Bag Subtotal</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatRupees(subtotal)}
                      </span>
                    </div>

                    {appliedCoupon && discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                        <span className="flex items-center space-x-1">
                          <Tag className="w-3 h-3" />
                          <span>Coupon Discount ({appliedCoupon.code})</span>
                        </span>
                        <span>- {formatRupees(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Express Delivery</span>
                      <span className="font-semibold text-emerald-600">
                        {shipping === 0 ? 'FREE' : formatRupees(shipping)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated GST (5%)</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatRupees(tax)}
                      </span>
                    </div>

                    {codExtra > 0 && (
                      <div className="flex justify-between text-amber-600 dark:text-amber-400">
                        <span>COD Cash Handling Fee</span>
                        <span className="font-semibold">{formatRupees(codExtra)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span>Total Due</span>
                      <span className="text-base text-indigo-600 dark:text-indigo-400">
                        {formatRupees(total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('cart')}
                      className="w-1/3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Back to Bag
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-2/3 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2"
                      style={{ backgroundColor: primaryColor || '#4f46e5' }}
                    >
                      {paymentMethod === 'UPI Dynamic QR' ? (
                        <>
                          <QrCode className="w-4 h-4" />
                          <span>Pay {formatRupees(total)} via UPI QR</span>
                        </>
                      ) : paymentMethod === 'Netbanking' ? (
                        <>
                          <Building2 className="w-4 h-4" />
                          <span>Proceed to {selectedBank.shortName} Netbanking</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>{isSubmitting ? 'Authorizing Gateway...' : `Pay ${formatRupees(total)}`}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: ORDER SUCCESS */}
            {step === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                    Order Successfully Placed!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Confirmation sent to <strong>{shippingForm.email}</strong> and SMS to <strong>{phoneCountryCode} {rawPhone}</strong>. Paid via <strong>{paymentMethod}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full text-xs space-y-1.5 font-mono text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{createdOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                      {paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Paid:</span>
                    <span className="font-bold text-indigo-600">{formatRupees(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Country Delivery:</span>
                    <span className="font-bold text-emerald-500">India ({phoneCountryCode})</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const mockPlacedOrder: Order = {
                        id: createdOrderId,
                        customer: shippingForm,
                        items: items.map((i) => ({
                          productId: i.product.id,
                          name: i.product.name,
                          brand: i.product.brand,
                          price: i.product.price,
                          quantity: i.quantity,
                          image: i.product.image,
                          selectedSize: i.selectedSize,
                          selectedColor: i.selectedColor,
                        })),
                        subtotal,
                        shipping,
                        tax,
                        total,
                        status: 'PROCESSING',
                        paymentMethod,
                        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID',
                        createdAt: new Date().toISOString(),
                        trackingNumber: `BBZ-${Math.floor(10000000 + Math.random() * 90000000)}`,
                      };
                      downloadOrderInvoice(mockPlacedOrder);
                    }}
                    className="w-full sm:w-1/2 py-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Download Invoice</span>
                  </button>

                  <button
                    onClick={() => {
                      setStep('cart');
                      onClose();
                    }}
                    className="w-full sm:w-1/2 py-3 rounded-xl text-xs font-bold text-white shadow-md transition-opacity hover:opacity-95 flex items-center justify-center space-x-1"
                    style={{ backgroundColor: primaryColor || '#4f46e5' }}
                  >
                    <span>Continue Shopping</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ITEM REMOVAL CONFIRMATION MODAL */}
      {itemPendingRemoval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Remove from Bag?
                </h4>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove this product?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center space-x-3">
              <img
                src={itemPendingRemoval.product.image}
                alt={itemPendingRemoval.product.name}
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {itemPendingRemoval.product.name}
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                  {itemPendingRemoval.selectedSize && <span>Size: {itemPendingRemoval.selectedSize}</span>}
                  <span>•</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatRupees(itemPendingRemoval.product.price)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setItemPendingRemoval(null)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Keep in Bag
              </button>
              <button
                type="button"
                onClick={() => {
                  onRemoveItem(
                    itemPendingRemoval.product.id,
                    itemPendingRemoval.selectedSize,
                    itemPendingRemoval.selectedColor
                  );
                  setItemPendingRemoval(null);
                }}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC UPI QR CODE POPUP MODAL */}
      <DynamicUpiQrModal
        isOpen={isUpiQrOpen}
        onClose={() => setIsUpiQrOpen(false)}
        amount={total}
        upiId={activeUpiId}
        merchantName={activeMerchantName}
        orderReference={createdOrderId || `BBZ-${Math.floor(1000 + Math.random() * 9000)}`}
        onPaymentSuccess={handleUpiPaymentSuccess}
        primaryColor={primaryColor}
      />

      {/* INDIAN BANK NETBANKING REDIRECT MODAL */}
      <IndianBankRedirectModal
        isOpen={isNetbankingModalOpen}
        onClose={() => setIsNetbankingModalOpen(false)}
        bank={selectedBank}
        amount={total}
        orderReference={createdOrderId || `BBZ-${Math.floor(1000 + Math.random() * 9000)}`}
        onPaymentSuccess={handleNetbankingSuccess}
        primaryColor={primaryColor}
      />

      {/* SECURE CARD PAYMENT MODAL */}
      <SecureCardPaymentModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        amount={total}
        orderReference={createdOrderId || `BBZ-${Math.floor(1000 + Math.random() * 9000)}`}
        onPaymentSuccess={handleCardPaymentSuccess}
        primaryColor={primaryColor}
      />
    </>
  );
};
