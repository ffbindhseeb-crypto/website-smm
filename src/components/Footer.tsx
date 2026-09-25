import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Zap, Lock, Coins } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsDepositModalOpen, setActiveTab, setQuickSelectServiceId } = useApp();

  const handleServiceClick = (serviceId: string) => {
    setQuickSelectServiceId(serviceId);
    setActiveTab('order');
  };

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xs text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                Cheap SMM Panel
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                Official Easypaisa Gate
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-md text-slate-600 dark:text-slate-400">
              Pakistan's leading wholesale Cheap SMM Panel providing the lowest market rates for TikTok likes, views, followers, TikTok Coins recharge, Instagram followers & likes, Telegram members, and WhatsApp channels. Instant automated processing via Easypaisa 03364180438.
            </p>
            <div className="flex items-center gap-3 pt-1 text-slate-700 dark:text-slate-300 font-mono text-xs">
              <span className="text-slate-400">Deposit Merchant:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">03364180438</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-900 dark:text-white">
              Popular Services
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleServiceClick('tk-coin-701')}
                  className="hover:text-amber-500 transition-colors flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400"
                >
                  <Coins className="w-3 h-3" />
                  <span>TikTok Coins Top-Up</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleServiceClick('tk-viw-301')}
                  className="hover:text-cyan-500 transition-colors"
                >
                  TikTok Views (PKR 8/1K)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleServiceClick('ig-fol-801')}
                  className="hover:text-pink-500 transition-colors"
                >
                  Instagram Followers Non-Drop
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleServiceClick('tg-mem-901')}
                  className="hover:text-cyan-500 transition-colors"
                >
                  Telegram Channel Members
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleServiceClick('wa-chn-951')}
                  className="hover:text-emerald-500 transition-colors"
                >
                  WhatsApp Channel Followers
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Guarantees */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-900 dark:text-white">
              Guarantees & Support
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>365-Day Refill Guarantee Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>Secure Easypaisa 03364180438</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Automated API Cluster Execution</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            © 2026 Cheap SMM Panel. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Easypaisa Account: 03364180438</span>
            <span>·</span>
            <span>Zero Processing Fees</span>
            <span>·</span>
            <span>Instant Balance Credit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
