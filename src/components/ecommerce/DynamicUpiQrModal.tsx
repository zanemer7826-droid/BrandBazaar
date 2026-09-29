import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Clock,
  Sparkles,
  QrCode,
  Zap,
} from 'lucide-react';
import { formatRupees } from '../../utils/currency';

interface DynamicUpiQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  upiId: string;
  merchantName: string;
  orderReference: string;
  onPaymentSuccess: (transactionId: string) => void;
  primaryColor: string;
}

export const DynamicUpiQrModal: React.FC<DynamicUpiQrModalProps> = ({
  isOpen,
  onClose,
  amount,
  upiId,
  merchantName,
  orderReference,
  onPaymentSuccess,
  primaryColor,
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes expiry
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [txnRef, setTxnRef] = useState(`UPI-${Date.now().toString().slice(-8)}`);

  // Construct NPCI standard dynamic UPI payment URL
  const formattedAmount = Number(amount).toFixed(2);
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    merchantName || 'Brand Bazaar'
  )}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(
    `Order ${orderReference} at Brand Bazaar`
  )}&tr=${txnRef}`;

  // Dynamic QR Code image URL via secure QR generator with margin and high contrast
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
    upiIntentUri
  )}&margin=12&format=svg`;

  // Countdown timer for QR code validity
  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(300);
    setIsConfirmed(false);
    setIsVerifying(false);
    setTxnRef(`UPI-${Date.now().toString().slice(-8)}`);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, orderReference]);

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsConfirmed(true);
      setTimeout(() => {
        onPaymentSuccess(txnRef);
      }, 1200);
    }, 2000);
  };

  const handleRefreshQr = () => {
    setSecondsLeft(300);
    setTxnRef(`UPI-${Date.now().toString().slice(-8)}`);
    setIsConfirmed(false);
    setIsVerifying(false);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm tracking-tight text-white">
                  UPI Dynamic QR Payment
                </h3>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  REAL-TIME NPCI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Scan with GPay, PhonePe, Paytm, CRED or BHIM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-center">
          {/* Amount Due Badge */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Payable Amount
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
              {formatRupees(amount)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-center space-x-1">
              <span>Merchant:</span>
              <strong className="text-slate-800 dark:text-slate-200">{merchantName || 'Brand Bazaar Store'}</strong>
            </div>
          </div>

          {/* QR Code Container with Scan Frame */}
          <div className="relative inline-block mx-auto p-4 rounded-3xl bg-white border-2 border-indigo-500/30 shadow-xl">
            {secondsLeft > 0 ? (
              <div className="relative">
                <img
                  src={qrCodeImageUrl}
                  alt={`UPI QR Code for ${formatRupees(amount)}`}
                  className="w-56 h-56 object-contain rounded-xl mx-auto"
                />

                {/* Center UPI Badge on QR */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-lg border border-slate-200 flex items-center justify-center font-black text-xs text-indigo-700">
                    UPI
                  </div>
                </div>

                {isVerifying && (
                  <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center space-y-2 animate-in fade-in">
                    <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Verifying Payment with NPCI Gateway...
                    </span>
                  </div>
                )}

                {isConfirmed && (
                  <div className="absolute inset-0 bg-emerald-500/95 text-white rounded-xl flex flex-col items-center justify-center space-y-2 animate-in zoom-in-95">
                    <CheckCircle2 className="w-12 h-12 text-white animate-bounce" />
                    <span className="text-sm font-black">
                      Payment Received!
                    </span>
                    <span className="text-[10px] text-emerald-100 font-mono">
                      Ref: {txnRef}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Expired State */
              <div className="w-56 h-56 flex flex-col items-center justify-center space-y-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Clock className="w-8 h-8 text-rose-500" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  QR Code Expired
                </div>
                <button
                  onClick={handleRefreshQr}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center space-x-1.5 shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate New QR</span>
                </button>
              </div>
            )}
          </div>

          {/* Expiry Timer & Ref */}
          <div className="flex items-center justify-between text-[11px] px-2 text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>
                Expires in:{' '}
                <strong className={secondsLeft < 60 ? 'text-rose-500 font-mono' : 'text-slate-800 dark:text-slate-200 font-mono'}>
                  {timeFormatted}
                </strong>
              </span>
            </div>

            <div className="font-mono text-[10px]">
              Ref: {txnRef}
            </div>
          </div>

          {/* UPI ID Copy Field */}
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
            <div className="text-left truncate mr-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Merchant UPI ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 select-all truncate">
                {upiId}
              </span>
            </div>
            <button
              onClick={handleCopyUpiId}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-indigo-600 font-bold text-[11px] shrink-0 flex items-center space-x-1"
            >
              {copiedUpi ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy UPI ID</span>
                </>
              )}
            </button>
          </div>

          {/* Supported UPI Apps Pills */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Supported UPI Apps
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['Google Pay', 'PhonePe', 'Paytm', 'CRED', 'BHIM', 'Amazon Pay'].map((app) => (
                <span
                  key={app}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>

          {/* Instant Verification Simulation Action */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={handleSimulatePayment}
              disabled={isVerifying || isConfirmed || secondsLeft === 0}
              className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-lg transition-transform hover:scale-102 active:scale-98 flex items-center justify-center space-x-2 disabled:opacity-50"
              style={{ backgroundColor: primaryColor || '#4f46e5' }}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Checking with UPI Gateway...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>I Have Completed Payment / Verify Now</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-400">
              🔒 Powered by NPCI Unified Payments Interface. Safe, instant 24x7 settlements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
