import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calculator, Zap, ArrowRight, Coins, CheckCircle2 } from 'lucide-react';

export const TikTokCalculatorView: React.FC = () => {
  const { setActiveTab, setQuickSelectServiceId } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'fyp' | 'coins'>('fyp');

  // TikTok FYP engagement calculator state
  const [followers, setFollowers] = useState<number>(4500);
  const [avgViews, setAvgViews] = useState<number>(1800);
  const [avgLikes, setAvgLikes] = useState<number>(140);
  const [avgComments, setAvgComments] = useState<number>(12);
  const [avgShares, setAvgShares] = useState<number>(8);

  // TikTok Coins saving calculator state
  const [targetCoins, setTargetCoins] = useState<number>(1400);

  // Engagement calculation
  const totalInteractions = avgLikes + avgComments + avgShares;
  const engagementRate = avgViews > 0 ? (totalInteractions / avgViews) * 100 : 0;

  // Viral index (0 - 100)
  const viralScore = Math.min(100, Math.round(engagementRate * 8.5 + (avgShares / (avgLikes || 1)) * 30));

  const getScoreRating = (score: number) => {
    if (score >= 80) return { label: 'Viral Ready 🔥', color: 'text-emerald-500' };
    if (score >= 50) return { label: 'Good Growth ⚡', color: 'text-cyan-500' };
    return { label: 'Needs Engagement Push ⚠️', color: 'text-amber-500' };
  };

  const rating = getScoreRating(viralScore);

  // Coins cost comparison
  // Official TikTok in-app rate in Pakistan is approx 3.85 PKR / coin
  // Cheap SMM Panel rate is now 1.0 PKR / coin (1 Rs = 1 Coin)
  const inAppCostPKR = Math.round(targetCoins * 3.85);
  const panelCostPKR = Math.round(targetCoins * 1.0);
  const savedPKR = inAppCostPKR - panelCostPKR;

  const handleLaunchBooster = () => {
    setQuickSelectServiceId('tk-viw-301');
    setActiveTab('order');
  };

  const handleBuyCoins = () => {
    setQuickSelectServiceId('tk-coin-701');
    setActiveTab('order');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Cheap SMM Panel — Growth & Coins Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulate FYP algorithm performance scores or calculate huge savings on TikTok LIVE Coins.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTabSub('fyp')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTabSub === 'fyp'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            FYP Viral Calculator
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSub('coins')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeTabSub === 'coins'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>Coins Savings</span>
          </button>
        </div>
      </div>

      {activeTabSub === 'fyp' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Parameters */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-500" />
                Account Baseline Metrics
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Followers:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={followers}
                    onChange={e => setFollowers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Average Video Views:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={avgViews}
                    onChange={e => setAvgViews(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Avg Likes:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={avgLikes}
                      onChange={e => setAvgLikes(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Avg Comments:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={avgComments}
                      onChange={e => setAvgComments(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Avg Shares:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={avgShares}
                      onChange={e => setAvgShares(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results & Recommendation */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Algorithmic FYP Diagnostic
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                    Engagement Rate
                  </span>
                  <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono mt-1 block">
                    {engagementRate.toFixed(2)}%
                  </span>
                  <span className="text-[10px] text-slate-400">Target: 8% - 12%</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                    Viral Score
                  </span>
                  <span className={`text-2xl font-black font-mono mt-1 block ${rating.color}`}>
                    {viralScore} / 100
                  </span>
                  <span className="text-[10px] font-semibold">{rating.label}</span>
                </div>
              </div>

              {/* Recommended Combo */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Recommended FYP Growth Pack:
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                  <li>• 10,000 High-Retention Views (100% watch-time simulation)</li>
                  <li>• 1,000 Instant FYP Likes</li>
                  <li>• 150 FYP Shares & Bookmarks</li>
                </ul>
                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between font-bold">
                  <span>Affordable Wholesale Pack Cost:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">~PKR 129</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLaunchBooster}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Deploy Growth Pack on New Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TikTok Coins Savings Calculator */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                TikTok Coins Recharge Calculator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare Cheap SMM Panel wholesale rates against standard in-app recharge prices.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Desired Coins Quantity:
                </label>
                <input
                  type="number"
                  min="70"
                  max="100000"
                  step="50"
                  value={targetCoins}
                  onChange={e => setTargetCoins(Math.max(70, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[70, 350, 700, 1400, 3500, 7000].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setTargetCoins(cnt)}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-semibold ${
                      targetCoins === cnt
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cnt.toLocaleString()} Coins
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl border-2 border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/20 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Price Comparison & Savings</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Save ~25% - 30%
                </span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">TikTok App / In-App Store:</span>
                  <span className="font-bold text-slate-600 dark:text-slate-400 line-through">
                    PKR {inAppCostPKR.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 font-bold">
                  <span className="text-emerald-800 dark:text-emerald-300">
                    Cheap SMM Panel Wholesale Price:
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-base">
                    PKR {panelCostPKR.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <span className="font-bold text-amber-800 dark:text-amber-300">
                    Your Total Savings:
                  </span>
                  <span className="font-black text-amber-600 dark:text-amber-400 font-mono text-base">
                    +PKR {savedPKR.toLocaleString()} (Saved)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBuyCoins}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4" />
                <span>Recharge {targetCoins.toLocaleString()} Coins for PKR {panelCostPKR.toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
