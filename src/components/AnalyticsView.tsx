import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Users,
  Coins,
  ArrowUpRight,
  Send,
  Phone,
  Camera,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { orders, balancePKR } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // Calculate totals from orders
  const totalViews = orders
    .filter(o => o.category.includes('views'))
    .reduce((sum, o) => sum + o.delivered, 0);

  const totalLikes = orders
    .filter(o => o.category.includes('likes') || o.category.includes('reactions'))
    .reduce((sum, o) => sum + o.delivered, 0);

  const totalFollowers = orders
    .filter(o => o.category.includes('followers') || o.category.includes('members'))
    .reduce((sum, o) => sum + o.delivered, 0);

  const totalCoins = orders
    .filter(o => o.category === 'tiktok_coins')
    .reduce((sum, o) => sum + o.delivered, 0);

  const totalSpentPKR = orders.reduce((sum, o) => sum + o.chargePKR, 0);

  // Mock 7-day trend series for realistic SVG graph
  const trendDays = [
    { day: 'Mon', total: 18200, tiktok: 12000, instagram: 3500, tg_wa: 2700 },
    { day: 'Tue', total: 24500, tiktok: 16000, instagram: 5200, tg_wa: 3300 },
    { day: 'Wed', total: 31800, tiktok: 21000, instagram: 6800, tg_wa: 4000 },
    { day: 'Thu', total: 39000, tiktok: 25000, instagram: 8500, tg_wa: 5500 },
    { day: 'Fri', total: 48000, tiktok: 31000, instagram: 11000, tg_wa: 6000 },
    { day: 'Sat', total: 62000, tiktok: 40000, instagram: 14000, tg_wa: 8000 },
    { day: 'Sun', total: 75000, tiktok: 49000, instagram: 17000, tg_wa: 9000 },
  ];

  const maxTotal = Math.max(...trendDays.map(d => d.total));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-500" />
            Cheap SMM Panel — Growth Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time cross-platform delivery metrics for TikTok, TikTok Coins, Instagram, Telegram & WhatsApp.
          </p>
        </div>

        {/* Time range switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              timeRange === '7d'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              timeRange === '30d'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Video & Post Views</span>
            <Eye className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalViews.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>TikTok & IG Reels Reach</span>
          </div>
        </div>

        {/* Total Followers & Members */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Followers & Members</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalFollowers.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>TK, IG, TG, WA</span>
          </div>
        </div>

        {/* TikTok Coins Dispatched */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>TikTok Coins Top-Ups</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {totalCoins > 0 ? totalCoins.toLocaleString() : '350'} Coins
          </div>
          <div className="mt-1 flex items-center text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Instant User ID Delivery</span>
          </div>
        </div>

        {/* Total Spent / Balance */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Campaign Spend</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            PKR {totalSpentPKR.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Balance: PKR {balancePKR.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Multi-Platform Delivery Trend Chart */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Cross-Platform Delivery Cadence (7-Day Overview)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulated metric delivery throughput across TikTok, Instagram, Telegram & WhatsApp
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-400">TikTok Growth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-pink-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Instagram</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Telegram/WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Bar chart representation */}
        <div className="pt-6">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 border-b border-slate-200 dark:border-slate-800 pb-2">
            {trendDays.map(item => {
              const heightPercent = Math.max(15, Math.round((item.total / maxTotal) * 100));

              return (
                <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-mono text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(item.total / 1000).toFixed(1)}k
                  </div>

                  <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end relative h-full">
                    <div
                      className="w-full bg-linear-to-t from-emerald-600 to-cyan-400 rounded-t transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Platform Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <span>TikTok & Coins</span>
            <span className="text-amber-500">Fastest</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            Views, Likes, Followers & Official Top-Ups
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <span>Instagram</span>
            <span className="text-pink-500">Explorer FYP</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            Non-drop followers, viral reels views & likes
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <span>Telegram</span>
            <span className="text-cyan-500">0% Drop</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            Channel members, post views & emoji reactions
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <span>WhatsApp</span>
            <span className="text-emerald-500">Organic</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            Channel followers, group members & updates
          </p>
        </div>
      </div>
    </div>
  );
};
