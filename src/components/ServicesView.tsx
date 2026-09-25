import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_SERVICES } from '../data/services';
import { PlatformType } from '../types';
import {
  ListFilter,
  Search,
  Zap,
  Clock,
  ShieldCheck,
  Coins,
  Send,
  Phone,
  Camera,
} from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { setQuickSelectServiceId, setActiveTab } = useApp();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'all'>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = ALL_SERVICES.filter(svc => {
    const matchesPlat = selectedPlatform === 'all' || svc.platform === selectedPlatform;
    const matchesSearch =
      search.trim() === '' ||
      svc.name.toLowerCase().includes(search.toLowerCase()) ||
      svc.id.toLowerCase().includes(search.toLowerCase()) ||
      svc.description.toLowerCase().includes(search.toLowerCase());
    return matchesPlat && matchesSearch;
  });

  const handleOrder = (serviceId: string) => {
    setQuickSelectServiceId(serviceId);
    setActiveTab('order');
  };

  const getPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'coins':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Coins className="w-3 h-3 text-amber-500" />
            TikTok Coins
          </span>
        );
      case 'tiktok':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            TikTok
          </span>
        );
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
            <Camera className="w-3 h-3 text-pink-500" />
            Instagram
          </span>
        );
      case 'telegram':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Send className="w-3 h-3 text-cyan-500" />
            Telegram
          </span>
        );
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Phone className="w-3 h-3 text-emerald-500" />
            WhatsApp
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ListFilter className="w-6 h-6 text-emerald-500" />
            Cheap SMM Panel — Services & Wholesale Rates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official wholesale prices in Pakistani Rupees (PKR) for TikTok, Coins, Instagram, Telegram & WhatsApp.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedPlatform('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedPlatform === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Services ({ALL_SERVICES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlatform('coins')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              selectedPlatform === 'coins'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>TikTok Coins</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlatform('tiktok')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedPlatform === 'tiktok'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            TikTok
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlatform('instagram')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              selectedPlatform === 'instagram'
                ? 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-pink-500" />
            <span>Instagram</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlatform('telegram')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              selectedPlatform === 'telegram'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-cyan-500" />
            <span>Telegram</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlatform('whatsapp')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              selectedPlatform === 'whatsapp'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search service name, ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">ID</th>
                <th className="py-3 px-4 font-bold">Platform</th>
                <th className="py-3 px-4 font-bold">Service Package</th>
                <th className="py-3 px-4 font-bold">Rate / 1K (PKR)</th>
                <th className="py-3 px-4 font-bold">Min / Max</th>
                <th className="py-3 px-4 font-bold">Speed</th>
                <th className="py-3 px-4 font-bold">Refill Guard</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(svc => (
                <tr
                  key={svc.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500 dark:text-slate-400">
                    {svc.id}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getPlatformBadge(svc.platform)}
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {svc.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {svc.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm whitespace-nowrap">
                    PKR {svc.ratePer1000PKR}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {svc.min.toLocaleString()} / {svc.max.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                    {svc.speedText}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {svc.guarantee}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleOrder(svc.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                    >
                      Order Now
                    </button>
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
