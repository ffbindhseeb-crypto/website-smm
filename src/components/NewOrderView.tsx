import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_SERVICES } from '../data/services';
import { SmmService, PlatformType } from '../types';
import {
  Users,
  Heart,
  Eye,
  Share2,
  MessageSquare,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coins,
  Send,
  Phone,
  Camera,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

export const NewOrderView: React.FC = () => {
  const {
    balancePKR,
    placeOrder,
    setActiveTab,
    setIsDepositModalOpen,
    quickSelectServiceId,
    setQuickSelectServiceId,
  } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('coins');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('tk-coin-701');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(350);
  const [startCount, setStartCount] = useState<number>(0);
  const [dripFeed, setDripFeed] = useState<boolean>(false);
  const [dripRuns, setDripRuns] = useState<number>(5);
  const [dripInterval, setDripInterval] = useState<number>(60);
  const [autoRefill, setAutoRefill] = useState<boolean>(true);
  const [customComments, setCustomComments] = useState<string>(
    'Great video! 🔥\nLoved this content keep it up 🙌\nBest post of the day ❤️\nViral hit!'
  );
  const [urlStatus, setUrlStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [urlMessage, setUrlMessage] = useState<string>('');

  // Handle pre-selected service if user came from Services view or Navbar
  useEffect(() => {
    if (quickSelectServiceId) {
      const match = ALL_SERVICES.find(s => s.id === quickSelectServiceId);
      if (match) {
        setSelectedPlatform(match.platform);
        setSelectedServiceId(match.id);
        setQuantity(Math.max(match.min, Math.min(1000, match.max)));
      }
      setQuickSelectServiceId(null);
    }
  }, [quickSelectServiceId, setQuickSelectServiceId]);

  // Current service object
  const currentService: SmmService =
    ALL_SERVICES.find(s => s.id === selectedServiceId) || ALL_SERVICES[0];

  // Filter services by platform
  const filteredServices = ALL_SERVICES.filter(s => s.platform === selectedPlatform);

  // Validate Link / Target based on platform & targetType
  useEffect(() => {
    if (!targetUrl.trim()) {
      setUrlStatus('idle');
      setUrlMessage('');
      return;
    }

    const trimmed = targetUrl.trim();

    if (currentService.platform === 'coins') {
      if (trimmed.length >= 2) {
        setUrlStatus('valid');
        setUrlMessage('Valid TikTok username for Coins direct credit');
      } else {
        setUrlStatus('invalid');
        setUrlMessage('Enter a valid TikTok username (e.g. @username)');
      }
    } else if (currentService.platform === 'tiktok') {
      if (currentService.targetType === 'tiktok_profile') {
        if (trimmed.startsWith('@') || trimmed.includes('tiktok.com/@')) {
          setUrlStatus('valid');
          setUrlMessage('Valid TikTok profile target');
        } else {
          setUrlStatus('invalid');
          setUrlMessage('Enter TikTok profile (e.g. @username or tiktok.com/@username)');
        }
      } else {
        if (
          trimmed.includes('/video/') ||
          trimmed.includes('vm.tiktok.com') ||
          trimmed.includes('vt.tiktok.com') ||
          trimmed.includes('tiktok.com/@')
        ) {
          setUrlStatus('valid');
          setUrlMessage('Valid TikTok video link detected');
        } else {
          setUrlStatus('invalid');
          setUrlMessage('Enter a valid TikTok video URL (e.g. https://www.tiktok.com/@user/video/...)');
        }
      }
    } else if (currentService.platform === 'instagram') {
      if (currentService.targetType === 'instagram_profile') {
        if (trimmed.startsWith('@') || trimmed.includes('instagram.com/')) {
          setUrlStatus('valid');
          setUrlMessage('Valid Instagram profile target');
        } else {
          setUrlStatus('invalid');
          setUrlMessage('Enter Instagram username or profile URL (e.g. @username)');
        }
      } else {
        if (trimmed.includes('instagram.com/p/') || trimmed.includes('instagram.com/reel/')) {
          setUrlStatus('valid');
          setUrlMessage('Valid Instagram Reel/Post link detected');
        } else {
          setUrlStatus('invalid');
          setUrlMessage('Enter Instagram Post or Reel URL (e.g. instagram.com/reel/...)');
        }
      }
    } else if (currentService.platform === 'telegram') {
      if (trimmed.includes('t.me/') || trimmed.startsWith('@')) {
        setUrlStatus('valid');
        setUrlMessage('Valid Telegram channel or post link detected');
      } else {
        setUrlStatus('invalid');
        setUrlMessage('Enter Telegram link (e.g. https://t.me/channel or @channel)');
      }
    } else if (currentService.platform === 'whatsapp') {
      if (trimmed.includes('whatsapp.com/channel/') || trimmed.includes('chat.whatsapp.com/')) {
        setUrlStatus('valid');
        setUrlMessage('Valid WhatsApp Channel / Group link detected');
      } else {
        setUrlStatus('invalid');
        setUrlMessage('Enter WhatsApp Channel (whatsapp.com/channel/...) or Group invite link');
      }
    }
  }, [targetUrl, currentService]);

  // Sync comments count if custom comments service
  useEffect(() => {
    if (currentService.id === 'tk-cmt-501' || currentService.id === 'ig-cmt-804') {
      const lines = customComments
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);
      if (lines.length > 0) {
        setQuantity(lines.length);
      }
    }
  }, [customComments, currentService.id]);

  // Platform switch
  const handlePlatformChange = (plat: PlatformType) => {
    setSelectedPlatform(plat);
    const firstInPlat = ALL_SERVICES.find(s => s.platform === plat);
    if (firstInPlat) {
      setSelectedServiceId(firstInPlat.id);
      if (plat === 'coins') {
        setQuantity(350); // standard popular pack
      } else {
        setQuantity(Math.max(firstInPlat.min, Math.min(1000, firstInPlat.max)));
      }
    }
  };

  // Service switch
  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const svc = ALL_SERVICES.find(s => s.id === serviceId);
    if (svc) {
      if (quantity < svc.min) setQuantity(svc.min);
      if (quantity > svc.max) setQuantity(svc.max);
    }
  };

  // Cost calculation
  const totalCostPKR = Math.round((quantity / 1000) * currentService.ratePer1000PKR * 100) / 100;
  const isBalanceSufficient = balancePKR >= totalCostPKR;

  const handleQuickAddQty = (add: number) => {
    const next = Math.min(currentService.max, quantity + add);
    setQuantity(next);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetUrl.trim()) {
      return;
    }

    if (quantity < currentService.min || quantity > currentService.max) {
      return;
    }

    const commentsList =
      currentService.id === 'tk-cmt-501' || currentService.id === 'ig-cmt-804'
        ? customComments.split('\n').filter(c => c.trim().length > 0)
        : undefined;

    const res = placeOrder({
      platform: currentService.platform,
      serviceId: currentService.id,
      serviceName: currentService.name,
      category: currentService.category,
      targetUrl: targetUrl.trim(),
      quantity,
      startCount,
      chargePKR: totalCostPKR,
      speedPerMin: currentService.platform === 'coins' ? 100 : 150,
      autoRefill,
      dripFeedEnabled: dripFeed,
      dripRuns: dripFeed ? dripRuns : undefined,
      dripInterval: dripFeed ? dripInterval : undefined,
      comments: commentsList,
    });

    if (res.success) {
      setTargetUrl('');
      setActiveTab('tracker');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Cheap SMM Panel — New Order
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Cheapest Rates in PK
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Order TikTok Likes, Views, Followers, TikTok Coins, Instagram, Telegram & WhatsApp. Instant automated processing with Easypaisa (03364180438).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Live Campaign Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Platform Selection & Form */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Platform Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
              1. Choose Platform / Service Type:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {/* TikTok Coins (Special highlight) */}
              <button
                type="button"
                onClick={() => handlePlatformChange('coins')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all relative ${
                  selectedPlatform === 'coins'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 shadow-md ring-2 ring-amber-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-amber-400'
                }`}
              >
                <span className="absolute -top-2 right-2 text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
                  HOT
                </span>
                <Coins className="w-5 h-5 mb-1 text-amber-500" />
                <span>TikTok Coins</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                  Live Top-Up
                </span>
              </button>

              {/* TikTok (Standard) */}
              <button
                type="button"
                onClick={() => handlePlatformChange('tiktok')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                  selectedPlatform === 'tiktok'
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 shadow-md ring-2 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-rose-300'
                }`}
              >
                <div className="w-5 h-5 mb-1 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                  TK
                </div>
                <span>TikTok</span>
                <span className="text-[10px] text-slate-400 font-normal">Likes/Views/Fol</span>
              </button>

              {/* Instagram */}
              <button
                type="button"
                onClick={() => handlePlatformChange('instagram')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                  selectedPlatform === 'instagram'
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 shadow-md ring-2 ring-pink-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-pink-300'
                }`}
              >
                <Camera className="w-5 h-5 mb-1 text-pink-500" />
                <span>Instagram</span>
                <span className="text-[10px] text-slate-400 font-normal">Reels & Follow</span>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={() => handlePlatformChange('telegram')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                  selectedPlatform === 'telegram'
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 shadow-md ring-2 ring-cyan-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-cyan-300'
                }`}
              >
                <Send className="w-5 h-5 mb-1 text-cyan-500" />
                <span>Telegram</span>
                <span className="text-[10px] text-slate-400 font-normal">Members/Views</span>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => handlePlatformChange('whatsapp')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                  selectedPlatform === 'whatsapp'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shadow-md ring-2 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-emerald-300'
                }`}
              >
                <Phone className="w-5 h-5 mb-1 text-emerald-500" />
                <span>WhatsApp</span>
                <span className="text-[10px] text-slate-400 font-normal">Channels & Grps</span>
              </button>
            </div>
          </div>

          {/* Service Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              2. Select Package Tier:
            </label>
            <select
              value={selectedServiceId}
              onChange={e => handleServiceChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              {filteredServices.map(svc => (
                <option key={svc.id} value={svc.id}>
                  {svc.name} — PKR {svc.ratePer1000PKR}/1K [{svc.qualityBadge}]
                </option>
              ))}
            </select>
          </div>

          {/* Target URL or TikTok Username */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>
                  {currentService.platform === 'coins'
                    ? 'TikTok Profile @Username (For Instant Coins Credit):'
                    : currentService.targetType.includes('profile')
                    ? 'Profile Link or @Username:'
                    : currentService.targetType.includes('channel')
                    ? 'Channel Link or Invite URL:'
                    : currentService.targetType.includes('whatsapp')
                    ? 'WhatsApp Link (Channel or Group Invite):'
                    : 'Target Post or Video Link:'}
                </span>
              </label>
              {urlStatus === 'valid' && (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {urlMessage}
                </span>
              )}
              {urlStatus === 'invalid' && (
                <span className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {urlMessage}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                placeholder={
                  currentService.platform === 'coins'
                    ? '@your_tiktok_username (No password needed!)'
                    : currentService.platform === 'whatsapp'
                    ? 'https://whatsapp.com/channel/...'
                    : currentService.platform === 'telegram'
                    ? 'https://t.me/your_channel'
                    : currentService.platform === 'instagram'
                    ? 'https://www.instagram.com/reel/...'
                    : 'https://www.tiktok.com/@creator/video/...'
                }
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            {currentService.platform === 'coins' && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                🔒 Safe Top-Up: 100% legal TikTok coins added directly to your TikTok account balance. No login password required.
              </p>
            )}
          </div>

          {/* Custom Comments textarea if applicable */}
          {(currentService.id === 'tk-cmt-501' || currentService.id === 'ig-cmt-804') && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Custom Comments (1 per line):
                </label>
                <span className="text-xs text-slate-400">
                  Lines: {customComments.split('\n').filter(l => l.trim()).length}
                </span>
              </div>
              <textarea
                rows={4}
                value={customComments}
                onChange={e => setCustomComments(e.target.value)}
                placeholder="Enter comments line by line..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          )}

          {/* Quantity Input & Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quantity {currentService.unitLabel ? `(${currentService.unitLabel})` : '(Units)'}:
              </label>
              <div className="text-[11px] text-slate-400">
                Min: {currentService.min.toLocaleString()} · Max: {currentService.max.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={currentService.min}
                max={currentService.max}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>

            {/* Quick Quantity Chips based on platform */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentService.platform === 'coins' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setQuantity(70)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                  >
                    70 Coins (PKR 70)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(350)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
                  >
                    350 Coins (PKR 350) 1 Rs Rate
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(700)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                  >
                    700 Coins (PKR 700)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(1400)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                  >
                    1,400 Coins (PKR 1,400)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(3500)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                  >
                    3,500 Coins (PKR 3,500)
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickAddQty(500)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                  >
                    +500
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddQty(1000)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                  >
                    +1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddQty(5000)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                  >
                    +5,000
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity(currentService.min)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500"
                  >
                    Min ({currentService.min.toLocaleString()})
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Starting Count (for social channels/views) */}
          {currentService.platform !== 'coins' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Starting Count (Initial Metric):
                </label>
                <span className="text-[11px] text-slate-400">
                  Used for verified delivery tracking
                </span>
              </div>
              <input
                type="number"
                min="0"
                value={startCount}
                onChange={e => setStartCount(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Advanced Controls: Refill & Drip feed */}
          {currentService.refillDays > 0 && (
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {currentService.refillDays}-Day Auto Refill Protection
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Protected by Cheap SMM Panel guarantee. Refill button available anytime if count drops.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoRefill}
                  onChange={e => setAutoRefill(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-5 space-y-4">
          {/* Service Specs Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {currentService.qualityBadge}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
                  {currentService.name}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block">Rate / 1K:</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  PKR {currentService.ratePer1000PKR}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentService.description}
            </p>

            {/* Service Guarantee attributes */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
                  <Clock className="w-3 h-3 text-cyan-500" />
                  <span>Start Time</span>
                </div>
                <div className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                  {currentService.startText}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Speed</span>
                </div>
                <div className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                  {currentService.speedText}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>Refill Policy</span>
                </div>
                <div className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                  {currentService.guarantee}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
                  <Layers className="w-3 h-3 text-indigo-500" />
                  <span>Min / Max</span>
                </div>
                <div className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                  {currentService.min.toLocaleString()} – {currentService.max.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Checkout & Submit Box */}
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-slate-50 dark:bg-slate-900 p-5 shadow-md space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Order Cost Summary
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Selected Service:</span>
                <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                  {currentService.name}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Quantity:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {quantity.toLocaleString()} {currentService.unitLabel || 'units'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Rate per 1,000:</span>
                <span>PKR {currentService.ratePer1000PKR}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Available Balance:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  PKR {balancePKR.toLocaleString()}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm font-bold">
                <span className="text-slate-900 dark:text-white">Total Charge:</span>
                <span className="text-xl text-emerald-600 dark:text-emerald-400 font-mono">
                  PKR {totalCostPKR.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Balance check warning if insufficient */}
            {!isBalanceSufficient && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-400 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Insufficient Balance</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  You need PKR {Math.round(totalCostPKR - balancePKR).toLocaleString()} more. Deposit instantly with 0% fees via Easypaisa (03364180438).
                </p>
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(true)}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  Deposit via Easypaisa (03364180438)
                </button>
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="button"
              onClick={handleOrderSubmit}
              disabled={!targetUrl.trim() || quantity < currentService.min}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                !targetUrl.trim() || quantity < currentService.min
                  ? 'bg-slate-400 dark:bg-slate-800 cursor-not-allowed text-slate-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {!targetUrl.trim()
                  ? 'Enter Target Link / Username First'
                  : `Launch Campaign (PKR ${totalCostPKR.toLocaleString()})`}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cheap SMM Panel · 24/7 Automated Fulfillment · 03364180438</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
