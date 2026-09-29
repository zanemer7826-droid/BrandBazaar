import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Lock,
  User,
  Gift,
  FileText,
} from 'lucide-react';
import { UserProfile } from '../../types/ecommerce';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onViewOrderHistory?: () => void;
  primaryColor?: string;
  storeName?: string;
}

const COUNTRY_OPTIONS = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onViewOrderHistory,
  primaryColor,
  storeName,
}) => {
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [stage, setStage] = useState<'input' | 'otp'>('input');

  // Mobile state - default country code +91 India
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('98201 55678');
  const [fullName, setFullName] = useState('Ananya Verma');

  // Email state
  const [emailAddress, setEmailAddress] = useState('ananya.verma@example.in');

  // OTP state
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (method === 'mobile') {
      const cleanNum = mobileNumber.replace(/\D/g, '');
      if (cleanNum.length < 8) {
        setErrorMsg('Please enter a valid mobile number');
        return;
      }
    } else {
      if (!emailAddress.includes('@') || !emailAddress.includes('.')) {
        setErrorMsg('Please enter a valid email address');
        return;
      }
    }

    setIsSendingOtp(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    setTimeout(() => {
      setIsSendingOtp(false);
      setGeneratedOtp(newOtp);
      setOtp(newOtp); // Pre-fill for instant demo friction-free login
      setStage('otp');
      setTimer(60);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otp !== generatedOtp && otp !== '123456') {
      setErrorMsg('Invalid OTP. Please check the code or try 123456.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const name = fullName.trim() || (method === 'mobile' ? 'VIP Shopper' : emailAddress.split('@')[0]);

      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: method === 'email' ? emailAddress : `${mobileNumber.replace(/\s/g, '')}@bazaarcustomer.in`,
        phone: method === 'mobile' ? `${countryCode} ${mobileNumber}` : '+91 98201 55678',
        countryCode: countryCode,
        isVip: true,
        vipSince: '2026',
        loginMethod: method === 'mobile' ? 'mobile_otp' : 'email_otp',
      };

      onLogin(newUser);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md font-bold"
              style={{ backgroundColor: primaryColor || '#4f46e5' }}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {currentUser ? 'My Shopper Account' : `Sign In to ${storeName || 'Brand Bazaar'}`}
              </h3>
              <p className="text-xs text-slate-400">
                {currentUser
                  ? 'Manage your orders, VIP perks & address'
                  : 'Fast passwordless login with secure OTP'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ALREADY LOGGED IN VIEW */}
        {currentUser ? (
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </h4>
                  {currentUser.isVip && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>VIP CLUB</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{currentUser.email}</p>
                <p className="text-xs text-slate-500 mt-0.5">{currentUser.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  Active Member
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Auth Method</span>
                <span className="font-extrabold text-slate-900 dark:text-white uppercase">
                  {currentUser.loginMethod === 'mobile_otp' ? 'Mobile OTP' : 'Email OTP'}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {onViewOrderHistory && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewOrderHistory();
                  }}
                  className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors flex items-center justify-center space-x-2 shadow-xs"
                >
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>View Past Orders &amp; Invoices</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-opacity hover:opacity-95"
                style={{ backgroundColor: primaryColor || '#4f46e5' }}
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setStage('input');
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                Sign Out of Account
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN FLOW: MOBILE OR EMAIL WITH OTP */
          <div className="p-6 space-y-5">
            {stage === 'input' && (
              <>
                {/* Method selector tabs: Mobile Number vs Email */}
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod('mobile');
                      setErrorMsg('');
                    }}
                    className={`py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
                      method === 'mobile'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Mobile Number</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMethod('email');
                      setErrorMsg('');
                    }}
                    className={`py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
                      method === 'email'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address</span>
                  </button>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Verma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {method === 'mobile' ? (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>Mobile Number</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                          Default: +91 India
                        </span>
                      </label>
                      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="bg-slate-100 dark:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs px-2.5 py-2.5 border-r border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
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
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="98201 55678"
                          className="w-full px-3.5 py-2.5 bg-transparent text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        We will send a 6-digit verification OTP code via SMS to this number.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <p className="text-[10px] text-slate-400">
                        We will send a 6-digit one-time password to your email inbox.
                      </p>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3 rounded-2xl font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-60"
                    style={{ backgroundColor: primaryColor || '#4f46e5' }}
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating Secure OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Get One-Time Password (OTP)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center space-x-2 text-[11px] text-amber-900 dark:text-amber-300">
                    <Gift className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Signing in automatically enrolls you into our VIP SMS &amp; Email Club for 15% off!</span>
                  </div>
                </form>
              </>
            )}

            {/* STAGE 2: ENTER OTP CODE */}
            {stage === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>OTP Dispatched Successfully</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Sent to{' '}
                    <strong>
                      {method === 'mobile' ? `${countryCode} ${mobileNumber}` : emailAddress}
                    </strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="••••••"
                    className="w-full py-3 rounded-2xl border-2 border-indigo-500 bg-white dark:bg-slate-800 text-center font-mono font-black text-xl tracking-widest text-slate-900 dark:text-white focus:outline-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span>Code active for 10 minutes</span>
                    <button
                      type="button"
                      onClick={() => setOtp(generatedOtp)}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Auto-fill ({generatedOtp})
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 rounded-2xl font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-60"
                    style={{ backgroundColor: primaryColor || '#4f46e5' }}
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying OTP &amp; Logging In...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Verify OTP &amp; Access Account</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStage('input');
                      setErrorMsg('');
                    }}
                    className="w-full py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-xs font-semibold"
                  >
                    Change {method === 'mobile' ? 'Mobile Number' : 'Email'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
