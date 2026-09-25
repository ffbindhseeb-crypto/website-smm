import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
  QrCode,
  AlertCircle,
  FileCheck,
  HelpCircle,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { PaymentMethodType } from '../types';

export const AddFundsView: React.FC<{ isModal?: boolean; onCloseModal?: () => void }> = ({
  isModal = false,
  onCloseModal,
}) => {
  const { deposits, submitDeposit, addToast, balancePKR } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('easypaisa');
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(1000);
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);

  const EASYPAISA_NUMBER = '03364180438';
  const EASYPAISA_TITLE = 'Cheap SMM Panel / Muhammad Haseeb';

  const quickAmounts = [
    { value: 500, label: 'PKR 500' },
    { value: 1000, label: 'PKR 1,000', popular: true },
    { value: 2500, label: 'PKR 2,500', bonus: '+5% Bonus' },
    { value: 5000, label: 'PKR 5,000', bonus: '+5% Bonus' },
    { value: 10000, label: 'PKR 10,000', bonus: '+7% VIP Bonus' },
  ];

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    addToast('Copied to Clipboard', `Account ${text} copied.`, 'success');
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const calculateBonus = (amt: number) => {
    if (amt >= 10000) return Math.round(amt * 0.07);
    if (amt >= 2500) return Math.round(amt * 0.05);
    return 0;
  };

  const bonusAmount = calculateBonus(amount);
  const totalReceivable = amount + bonusAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) {
      addToast('Missing TRX ID', 'Please enter the 3737 Transaction ID received in SMS.', 'error');
      return;
    }
    if (!senderPhone.trim()) {
      addToast('Missing Sender Phone', 'Please provide your Easypaisa phone number for verification.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate automated bank/telecom gateway verification (1.8s)
      await new Promise(r => setTimeout(r, 1800));

      const res = await submitDeposit({
        method: selectedMethod,
        accountNumber: EASYPAISA_NUMBER,
        senderPhone: senderPhone.trim(),
        transactionId: trxId.trim(),
        amountPKR: amount,
        screenshotNote: note || 'Automated Instant Verification',
      });

      if (res.success) {
        addToast('Deposit Approved!', res.message, 'success');
        setTrxId('');
        setSenderPhone('');
        setNote('');
        if (onCloseModal) {
          onCloseModal();
        }
      } else {
        addToast('Verification Failed', res.message, 'error');
      }
    } catch {
      addToast('Network Error', 'Please check your connection and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-6 ${isModal ? 'p-1' : ''}`}>
      {/* Header */}
      {!isModal && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-500" />
              Deposit Funds & Payment Gateways
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Instant automated deposits powered by Easypaisa (03364180438), JazzCash & USDT Crypto.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block leading-none">
                Current Balance
              </span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                PKR {balancePKR.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setSelectedMethod('easypaisa')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
            selectedMethod === 'easypaisa'
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-500'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Easypaisa (Primary)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod('jazzcash')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
            selectedMethod === 'jazzcash'
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 shadow-sm ring-1 ring-amber-500'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>JazzCash Mobile</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod('usdt')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
            selectedMethod === 'usdt'
              ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 shadow-sm ring-1 ring-cyan-500'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
          <span>USDT (TRC-20)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod('card')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
            selectedMethod === 'card'
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-500'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          <span>Debit / Credit Card</span>
        </button>
      </div>

      {/* Main Content Area */}
      {selectedMethod === 'easypaisa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Official Account Details & Steps */}
          <div className="lg:col-span-6 space-y-4">
            {/* Verified Merchant Badge Card */}
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-linear-to-br from-emerald-500/10 via-slate-50 to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-950 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    EP
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Official Easypaisa Merchant
                    </h3>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Zero Fees · Instant Auto-Processing
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{showQR ? 'Hide QR' : 'Show QR'}</span>
                </button>
              </div>

              {/* Number and Copy Box */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Easypaisa Account Number:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Active & Verified
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-wider">
                    {EASYPAISA_NUMBER}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyAccount(EASYPAISA_NUMBER)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all active:scale-95"
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Account Title:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {EASYPAISA_TITLE}
                  </span>
                </div>
              </div>

              {/* QR Code expansion */}
              {showQR && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center animate-in fade-in duration-200">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Scan via Easypaisa App QR Scanner
                  </p>
                  <div className="inline-block p-3 bg-white rounded-lg border border-slate-200 shadow-inner">
                    {/* Visual QR representation */}
                    <div className="w-36 h-36 border-4 border-slate-900 rounded p-1 grid grid-cols-6 grid-rows-6 gap-0.5 bg-slate-900">
                      <div className="col-span-2 row-span-2 bg-white rounded-xs"></div>
                      <div className="col-span-2 bg-white"></div>
                      <div className="col-span-2 row-span-2 bg-white rounded-xs"></div>
                      <div className="col-span-1 bg-white"></div>
                      <div className="col-span-2 bg-white"></div>
                      <div className="col-span-1 bg-white"></div>
                      <div className="col-span-2 bg-white"></div>
                      <div className="col-span-2 bg-white"></div>
                      <div className="col-span-2 bg-white"></div>
                      <div className="col-span-2 row-span-2 bg-white rounded-xs"></div>
                      <div className="col-span-2 bg-white"></div>
                      <div className="col-span-2 row-span-2 bg-white rounded-xs"></div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 font-mono">
                    Recipient: {EASYPAISA_NUMBER}
                  </p>
                </div>
              )}

              {/* Step-by-Step Instructions */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  How to Deposit in 3 Simple Steps:
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-[11px]">
                      1
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      Open your <strong>Easypaisa App</strong> → tap <strong>Send Money</strong> →{' '}
                      <strong>Easypaisa Account</strong>.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-[11px]">
                      2
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      Enter mobile number{' '}
                      <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                        {EASYPAISA_NUMBER}
                      </strong>{' '}
                      and desired amount (Min PKR 100). Confirm recipient title.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-[11px]">
                      3
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      After sending, copy the <strong>3737 Transaction ID (TRX ID)</strong> from SMS
                      and submit in the form to the right for instant credit.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Verification & Deposit Form */}
          <div className="lg:col-span-6">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-500" />
                  Instant Automated Verification
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Min Deposit: PKR 100
                </span>
              </div>

              {/* Quick Amount Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Deposit Amount (PKR)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {quickAmounts.map(qa => (
                    <button
                      key={qa.value}
                      type="button"
                      onClick={() => setAmount(qa.value)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all relative ${
                        amount === qa.value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {qa.label}
                      {qa.bonus && (
                        <span className="block text-[9px] font-normal text-emerald-600 dark:text-emerald-400">
                          {qa.bonus}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Amount input */}
                <div className="relative mt-2">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                    PKR
                  </span>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={amount}
                    onChange={e => setAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-12 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    placeholder="Enter custom amount"
                    required
                  />
                </div>
              </div>

              {/* Bonus Notification Banner if applicable */}
              {bonusAmount > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Special Promo Bonus Applied!</span>
                  </div>
                  <span className="font-bold">+PKR {bonusAmount.toLocaleString()} Free</span>
                </div>
              )}

              {/* Sender Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Sender Easypaisa Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={senderPhone}
                    onChange={e => setSenderPhone(e.target.value)}
                    placeholder="e.g. 03001234567"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 3737 TRX ID */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    3737 Transaction ID (TRX ID)
                  </label>
                  <span className="text-[11px] text-slate-400">From Easypaisa SMS</span>
                </div>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={e => setTrxId(e.target.value)}
                  placeholder="e.g. 37378942104 or 284918239"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Optional note or proof */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reference Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Sent at 11:30 AM from Easypaisa app"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Summary box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Transfer Amount:</span>
                  <span>PKR {amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Bonus Credit:</span>
                  <span>+ PKR {bonusAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-800 text-sm">
                  <span>Total Credited:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    PKR {totalReceivable.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying with 3737 SMS Gateway...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Verify & Credit Deposit (PKR {totalReceivable.toLocaleString()})</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
                Automated validation runs in 30-90 seconds. Balance is credited instantly.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Alternative Gateways: JazzCash, USDT, Card */}
      {selectedMethod === 'jazzcash' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
              JC
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                JazzCash Mobile Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alternative domestic wallet transfer in Pakistan
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>JazzCash Receiver Account:</span>
              <span className="font-semibold text-amber-500">Linked to Easypaisa Gate</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                03364180438
              </span>
              <button
                type="button"
                onClick={() => handleCopyAccount('03364180438')}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                Copy Number
              </button>
            </div>
            <p className="text-xs text-slate-500">Title: Muhammad Haseeb (Easypaisa / JazzCash Switch)</p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            You can send from JazzCash to our Easypaisa account using <strong>Send Money → To Other Mobile Account / 1Link 03364180438</strong>. Enter the 8585/3737 TRX ID above under Easypaisa tab for automated processing.
          </p>
        </div>
      )}

      {selectedMethod === 'usdt' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm">
              ₮
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                USDT (Tether TRC-20 & BEP-20)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated crypto gateway for international clients (Rate: 1 USDT = 280 PKR)
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">TRC-20 Deposit Address:</span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate">
                TLm7wB4QY2Y9N6G1bJ5nK8mP4zX9vL3cQ1
              </span>
              <button
                type="button"
                onClick={() => handleCopyAccount('TLm7wB4QY2Y9N6G1bJ5nK8mP4zX9vL3cQ1')}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold shrink-0"
              >
                Copy Address
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'card' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Visa / Mastercard / 1Link Pay
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For fast instant zero-fee transfers within Pakistan, we strongly recommend using <strong>Easypaisa Mobile Account 03364180438</strong> which processes without bank fee deductions.
          </p>
          <button
            type="button"
            onClick={() => setSelectedMethod('easypaisa')}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
          >
            Switch to Easypaisa (03364180438)
          </button>
        </div>
      )}

      {/* Transaction History */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Recent Deposit Transactions
          </h3>
          <span className="text-xs text-slate-400">
            {deposits.length} transactions recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Sender Phone</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Bonus</th>
                <th className="py-2.5 px-3">Total Credited</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {deposits.map(dep => (
                <tr key={dep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {dep.transactionId}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">
                      {dep.method}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                    {dep.senderPhone}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    PKR {dep.amountPKR.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">
                    {dep.bonusPKR > 0 ? `+PKR ${dep.bonusPKR.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                    PKR {dep.totalCreditedPKR.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3 h-3" />
                      Approved
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {new Date(dep.createdAt).toLocaleDateString()} ·{' '}
                    {new Date(dep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
