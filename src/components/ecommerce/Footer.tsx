import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Lock,
  ArrowRight,
  Phone,
  MapPin,
  CheckCircle2,
  Copy,
  Gift,
} from 'lucide-react';
import { CategoryFilter, StoreBrandingSettings, StoreOffersSettings } from '../../types/ecommerce';

interface FooterProps {
  onSelectCategory: (cat: CategoryFilter) => void;
  onOpenAdmin?: () => void;
  branding: StoreBrandingSettings;
  primaryColor: string;
  onOpenClientServices?: (tab: 'faq' | 'track' | 'returns') => void;
  offers?: StoreOffersSettings;
  onRegisterVip?: (member: { phone: string; countryCode: string; date: string; code: string }) => void;
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'US / CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
];

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAdmin,
  branding,
  primaryColor,
  onOpenClientServices,
  offers,
  onRegisterVip,
}) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [alreadyRegisteredNotice, setAlreadyRegisteredNotice] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const activeCoupon = offers?.coupons?.find((c) => c.enabled) || offers?.coupons?.[0];
  const vipDiscountCode = activeCoupon ? activeCoupon.code : 'BAZAAR-VIP15';
  const vipDiscountText = activeCoupon
    ? activeCoupon.discountType === 'percentage'
      ? `${activeCoupon.discountValue}% discount code (${activeCoupon.code})`
      : `₹${activeCoupon.discountValue} discount code (${activeCoupon.code})`
    : '15% discount code (BAZAAR-VIP15)';

  const handleJoinVip = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.trim().replace(/\D/g, '');
    if (cleanNumber.length < 7) {
      setPhoneError('Please enter a valid mobile number with at least 7 digits.');
      return;
    }
    setPhoneError('');

    try {
      const savedMembers = JSON.parse(localStorage.getItem('bb_vip_members') || '[]');
      const isAlreadyReg = savedMembers.some(
        (m: any) => m.phone === cleanNumber && m.countryCode === countryCode
      );

      if (isAlreadyReg) {
        setAlreadyRegisteredNotice(true);
        setIsJoined(true);
        return;
      }

      const newMember = {
        phone: cleanNumber,
        countryCode,
        date: new Date().toISOString(),
        code: vipDiscountCode,
      };
      savedMembers.push(newMember);
      localStorage.setItem('bb_vip_members', JSON.stringify(savedMembers));
      if (onRegisterVip) onRegisterVip(newMember);
    } catch {}

    setAlreadyRegisteredNotice(false);
    setIsJoined(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(vipDiscountCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      {/* Upper VIP Club Join via Mobile Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>Exclusive SMS VIP Membership</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Join {branding.storeName || 'Brand Bazaar'} VIP Club via Mobile
            </h3>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              Drop your mobile phone number below to receive instant SMS text alerts for limited product drops, secret flash sales, and an immediate <strong className="text-amber-300">{vipDiscountText}</strong>.
            </p>
          </div>

          <div className="lg:col-span-6">
            {!isJoined ? (
              <form onSubmit={handleJoinVip} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                  {/* Country code picker */}
                  <div className="flex items-center bg-slate-800/80 rounded-xl px-2.5 py-2 shrink-0 border border-slate-700/60">
                    <span className="mr-1 text-sm">
                      {COUNTRY_CODES.find((c) => c.code === countryCode)?.flag || '📱'}
                    </span>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer pr-1"
                    >
                      {COUNTRY_CODES.map((item) => (
                        <option key={item.code} value={item.code} className="bg-slate-900 text-white">
                          {item.flag} {item.code} ({item.country})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone input */}
                  <div className="flex-1 flex items-center px-3 py-1">
                    <Phone className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setPhoneError('');
                      }}
                      placeholder="e.g. 98201 55678"
                      className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center space-x-1.5"
                    style={{ backgroundColor: primaryColor || '#4f46e5' }}
                  >
                    <span>Join VIP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {phoneError ? (
                  <p className="text-[11px] text-rose-400 font-medium px-2">{phoneError}</p>
                ) : (
                  <p className="text-[10px] text-slate-500 px-2">
                    🔒 By joining, you consent to receive VIP SMS alerts. Standard rates apply. Reply STOP anytime.
                  </p>
                )}
              </form>
            ) : (
              /* Success banner after joining with mobile number */
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-white text-xs sm:text-sm">
                        {alreadyRegisteredNotice
                          ? "You're already registered in our VIP Club!"
                          : "You're officially on the VIP SMS List!"}
                      </h4>
                      <p className="text-[11px] text-emerald-300">
                        {alreadyRegisteredNotice
                          ? `This mobile number (${countryCode} ${phoneNumber}) has already claimed the joining offer (one offer per mobile number). Here is your active code:`
                          : `Confirmation SMS dispatched to ${countryCode} ${phoneNumber}. Here is your welcome code:`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsJoined(false);
                      setPhoneNumber('');
                    }}
                    className="text-[10px] text-slate-400 hover:text-white underline"
                  >
                    Change Number
                  </button>
                </div>

                {/* VIP Coupon Card */}
                <div className="bg-slate-900/90 rounded-xl p-3 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Your VIP 15% Voucher</span>
                    <div className="font-mono text-sm font-black text-amber-400 tracking-wider">
                      {vipDiscountCode}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center space-x-1 transition-all"
                  >
                    {copiedCode ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info with Dynamic Logo */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              {branding.logoType === 'image' && branding.logoImageUrl ? (
                <img
                  src={branding.logoImageUrl}
                  alt={branding.storeName}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-700 shadow-md"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md"
                  style={{ backgroundColor: branding.primaryColor || '#4f46e5' }}
                >
                  {branding.logoText || 'B'}
                </div>
              )}

              <div>
                <span className="text-lg font-black tracking-tight text-white block leading-tight">
                  {branding.storeName || 'BRAND BAZAAR'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  {branding.storeTagline || 'The Everything Premium Marketplace'}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier destination for authenticated luxury goods, designer apparel, cutting-edge electronics, and lifestyle pieces.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  <strong>Address:</strong> Brand Bazaar, Gundalpet - Chamarajanagar Main road, Near old RTO office, Chamarajanagar - 571313.
                </span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs">
                  <strong>Contact:</strong> <a href="tel:9916962786" className="text-white font-bold hover:underline">9916962786</a>
                </span>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="w-full h-40 sm:h-44 rounded-2xl overflow-hidden border border-slate-800 shadow-lg mt-3">
              <iframe
                title="Brand Bazaar Store Location - Chamarajanagar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=11.921082302843816,76.93544978631483&z=17&output=embed"
              ></iframe>
            </div>
          </div>

          {/* Department Links */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-white">
              Departments
            </h4>
            <ul className="space-y-1.5">
              {(['Fashion', 'Footwear', 'Electronics', 'Accessories', 'Beauty', 'Home & Living'] as CategoryFilter[]).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-white">
              Client Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenClientServices?.('track')}
                  className="hover:text-white transition-colors text-left flex items-center space-x-1.5"
                >
                  <span>Track Your Order</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenClientServices?.('returns')}
                  className="hover:text-white transition-colors text-left flex items-center space-x-1.5"
                >
                  <span>Easy Exchange Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenClientServices?.('faq')}
                  className="hover:text-white transition-colors text-left flex items-center space-x-1.5 text-indigo-400 font-semibold"
                >
                  <span>Help Center &amp; FAQ</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-white">
              Trust &amp; Security
            </h4>
            <div className="space-y-2 pt-1">
              <div className="flex items-center space-x-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine Brands</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Truck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Express Insured Transit</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <RotateCcw className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Easy 24h Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {branding.storeName || 'Brand Bazaar'} Inc. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-slate-400">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
