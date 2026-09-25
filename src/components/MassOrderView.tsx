import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_SERVICES } from '../data/services';
import { Layers, Zap, AlertCircle, CheckCircle2, Play, Info } from 'lucide-react';

export const MassOrderView: React.FC = () => {
  const { placeOrder, balancePKR, addToast, setActiveTab, setIsDepositModalOpen } = useApp();

  const [massInput, setMassInput] = useState<string>(
    'tk-coin-701 | @my_tiktok_id | 350\n' +
    'tk-viw-301 | https://www.tiktok.com/@creator/video/7391827401 | 5000\n' +
    'ig-fol-801 | https://www.instagram.com/my_brand | 1000\n' +
    'tg-mem-901 | https://t.me/crypto_signals | 500\n' +
    'wa-chn-951 | https://whatsapp.com/channel/0029Va... | 300'
  );

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Parse lines
  const parseLines = () => {
    const rawLines = massInput.split('\n').filter(l => l.trim().length > 0);
    const parsed = rawLines.map((line, idx) => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length < 3) {
        return { index: idx + 1, valid: false, error: 'Expected 3 parts separated by | (service_id | link | quantity)' };
      }

      const [svcId, url, qtyStr] = parts;
      const svc = ALL_SERVICES.find(s => s.id === svcId);
      if (!svc) {
        return { index: idx + 1, valid: false, error: `Service ID "${svcId}" not found in catalog` };
      }

      const qty = parseInt(qtyStr, 10);
      if (isNaN(qty) || qty < svc.min || qty > svc.max) {
        return { index: idx + 1, valid: false, error: `Quantity must be between ${svc.min} and ${svc.max}` };
      }

      if (url.length < 2) {
        return { index: idx + 1, valid: false, error: 'Target URL or username is too short' };
      }

      const cost = Math.round((qty / 1000) * svc.ratePer1000PKR);

      return {
        index: idx + 1,
        valid: true,
        service: svc,
        url,
        quantity: qty,
        cost,
      };
    });

    return parsed;
  };

  const parsedItems = parseLines();
  const validItems = parsedItems.filter(p => p.valid);
  const totalCostPKR = validItems.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  const handleBulkSubmit = async () => {
    if (validItems.length === 0) {
      addToast('No Valid Lines', 'Please correct the errors in your mass order lines.', 'error');
      return;
    }

    if (balancePKR < totalCostPKR) {
      addToast(
        'Insufficient Balance',
        `You need PKR ${(totalCostPKR - balancePKR).toLocaleString()} more to place ${validItems.length} orders. Deposit via Easypaisa (03364180438).`,
        'error'
      );
      setIsDepositModalOpen(true);
      return;
    }

    setIsProcessing(true);

    let placedCount = 0;
    for (const item of validItems) {
      if (item.valid && item.service) {
        placeOrder({
          platform: item.service.platform,
          serviceId: item.service.id,
          serviceName: item.service.name,
          category: item.service.category,
          targetUrl: item.url!,
          quantity: item.quantity!,
          startCount: 0,
          chargePKR: item.cost!,
          speedPerMin: 120,
          autoRefill: true,
          dripFeedEnabled: false,
        });
        placedCount++;
      }
    }

    setIsProcessing(false);
    addToast('Bulk Campaign Dispatched', `Successfully dispatched ${placedCount} orders!`, 'success');
    setActiveTab('tracker');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-500" />
            Cheap SMM Panel — Mass / Bulk Order Tool
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Batch-order across TikTok, TikTok Coins, Instagram, Telegram & WhatsApp links simultaneously.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Textarea */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
              <Info className="w-4 h-4 text-emerald-500" />
              <span>Mass Order Format:</span>
            </div>
            <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
              service_id | link_or_username | quantity
            </p>
            <p className="text-[11px] text-slate-400">
              One order per line. Works across all services including TikTok Coins, Instagram, Telegram & WhatsApp.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Enter Multiple Order Lines:
            </label>
            <textarea
              rows={11}
              value={massInput}
              onChange={e => setMassInput(e.target.value)}
              placeholder="tk-viw-301 | https://www.tiktok.com/@creator/video/123 | 5000"
              className="w-full p-4 text-xs font-mono rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Right: Real-time Parser & Batch Checkout */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Batch Validation Review</span>
              <span className="text-xs text-slate-400">
                {validItems.length} valid / {parsedItems.length} lines
              </span>
            </h3>

            {/* Syntax checks list */}
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-xs">
              {parsedItems.map(item => (
                <div
                  key={item.index}
                  className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                    item.valid
                      ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200'
                      : 'border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400'
                  }`}
                >
                  <span className="font-mono font-bold shrink-0">#{item.index}</span>
                  <div className="flex-1 min-w-0">
                    {item.valid ? (
                      <div className="truncate">
                        <span className="font-bold">{item.service?.name}</span>
                        <div className="text-[11px] text-slate-500">
                          Qty: {item.quantity?.toLocaleString()} · PKR {item.cost?.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="font-semibold">{item.error}</span>
                      </div>
                    )}
                  </div>
                  {item.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Valid Orders to Dispatch:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {validItems.length} orders
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Your Balance:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  PKR {balancePKR.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 dark:text-white text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Batch Cost:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-base">
                  PKR {totalCostPKR.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBulkSubmit}
              disabled={validItems.length === 0 || isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Dispatching Batch Orders...'
                  : `Launch ${validItems.length} Orders (PKR ${totalCostPKR.toLocaleString()})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
