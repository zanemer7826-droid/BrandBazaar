import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Building2,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { IndianBank } from '../../data/indianBanks';
import { formatRupees } from '../../utils/currency';

interface IndianBankRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  bank: IndianBank;
  amount: number;
  orderReference: string;
  onPaymentSuccess: (bankTxnRef: string, bank: IndianBank) => void;
  primaryColor?: string;
}

export const IndianBankRedirectModal: React.FC<IndianBankRedirectModalProps> = ({
  isOpen,
  onClose,
  bank,
  amount,
  orderReference,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<'redirecting' | 'portal' | 'success'>('redirecting');
  const [otp, setOtp] = useState('782910');
  const [userId, setUserId] = useState('USER_98201_RETAIL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bankTxnRef, setBankTxnRef] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setStep('redirecting');
    setIsProcessing(false);
    const ref = `${bank.code}${Date.now().toString().slice(-8)}`;
    setBankTxnRef(ref);

    // Simulate 1.6s secure redirect to bank netbanking gateway
    const timer = setTimeout(() => {
      setStep('portal');
    }, 1600);

    return () => clearTimeout(timer);
  }, [isOpen, bank]);

  if (!isOpen) return null;

  const handleAuthorizePayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');

      // Auto redirect back to store after 1.8 seconds
      setTimeout(() => {
        onPaymentSuccess(bankTxnRef, bank);
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={step === 'portal' ? onClose : undefined}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Top Bank Header Bar */}
        <div
          className="p-5 text-white flex items-center justify-between shadow-md"
          style={{ backgroundColor: bank.color || '#1e293b' }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-black text-white text-base shadow-inner border border-white/20">
              {bank.shortName.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  {bank.name}
                </h3>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/20 text-white">
                  NetBanking
                </span>
              </div>
              <p className="text-[11px] text-white/80 flex items-center space-x-1 mt-0.5">
                <Lock className="w-3 h-3 text-emerald-300" />
                <span>RBI Certified Secure Payment Gateway (256-Bit SSL)</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Cancel Netbanking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: INITIAL REDIRECT ANIMATION */}
        {step === 'redirecting' && (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-25"
                style={{ backgroundColor: bank.color }}
              />
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl"
                style={{ backgroundColor: bank.color }}
              >
                <Building2 className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Connecting to {bank.name}...
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Handshaking with Indian Banking Network. Please do not refresh or close this window.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-xs mx-auto text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Amount:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {formatRupees(amount)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Merchant:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Brand Bazaar</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Establishing encrypted session...</span>
            </div>
          </div>
        )}

        {/* STEP 2: BANK NETBANKING AUTHENTICATION PORTAL */}
        {step === 'portal' && (
          <form onSubmit={handleAuthorizePayment} className="p-6 space-y-5">
            {/* Merchant Details Strip */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Merchant</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Brand Bazaar Flagship
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Payable Amount</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                  {formatRupees(amount)}
                </span>
              </div>
              <div className="pt-1 border-t border-slate-200 dark:border-slate-700 col-span-2 flex justify-between text-[11px] text-slate-500">
                <span>Order Ref: {orderReference}</span>
                <span>Bank Txn: {bankTxnRef}</span>
              </div>
            </div>

            {/* Account Info Simulation */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Customer NetBanking User ID</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Verified Customer
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-medium focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Select Debit Account
                </label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
                  <option>
                    Savings A/c No: ••••••••8492 (Available Bal: ₹1,42,500.00)
                  </option>
                  <option>
                    Current A/c No: ••••••••3910 (Available Bal: ₹5,80,000.00)
                  </option>
                </select>
              </div>

              {/* OTP Simulation */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>One-Time Password (OTP)</span>
                  </div>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400">
                    Sent to +91 98201 *****
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-center font-mono font-bold tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setOtp('782910')}
                    className="px-2.5 py-2 text-[10px] font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>
                <p className="text-[10px] text-amber-800/80 dark:text-amber-400/80">
                  Demo code <strong>782910</strong> pre-filled for smooth test checkout.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-60"
                style={{ backgroundColor: bank.color || '#280071' }}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Contacting {bank.shortName} Core Banking...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize &amp; Pay {formatRupees(amount)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold transition-colors"
              >
                Cancel and return to Brand Bazaar
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PAYMENT AUTHORIZATION SUCCESS */}
        {step === 'success' && (
          <div className="p-8 sm:p-10 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                Payment Authorized!
              </h4>
              <p className="text-xs text-slate-500">
                Transaction approved by {bank.name} NetBanking system.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 font-mono text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Bank Ref:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{bankTxnRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-bold text-emerald-600">{formatRupees(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-500">SUCCESS &bull; 00 APPROVED</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Redirecting you back to Brand Bazaar store...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
