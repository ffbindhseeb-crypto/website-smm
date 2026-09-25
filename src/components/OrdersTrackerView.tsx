import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SmmOrder, OrderStatus, PlatformType } from '../types';
import {
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCw,
  Search,
  Zap,
  ShieldCheck,
  Copy,
  Check,
  XCircle,
  Play,
  TrendingUp,
  RefreshCw,
  Coins,
  Camera,
  Send,
  Phone,
} from 'lucide-react';

export const OrdersTrackerView: React.FC = () => {
  const {
    orders,
    requestRefill,
    speedUpOrder,
    cancelOrder,
    setActiveTab,
    setQuickSelectServiceId,
    addToast,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute live summary stats
  const totalOrders = orders.length;
  const inProgressOrders = orders.filter(o => o.status === 'in_progress').length;
  const processingOrders = orders.filter(o => o.status === 'processing' || o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalDelivered = orders.reduce((acc, curr) => acc + curr.delivered, 0);

  // Filter list
  const filteredOrders = orders.filter(order => {
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? order.status === 'in_progress' || order.status === 'processing' || order.status === 'pending'
        : order.status === filterStatus;

    const matchesPlatform =
      filterPlatform === 'all' ? true : order.platform === filterPlatform;

    const matchesQuery =
      searchQuery.trim() === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.targetUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPlatform && matchesQuery;
  });

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addToast('Target Copied', 'Target URL or username copied to clipboard.', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReorder = (serviceId: string) => {
    setQuickSelectServiceId(serviceId);
    setActiveTab('order');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Delivering Live
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 px-2.5 py-1 rounded-full">
            <RotateCw className="w-3 h-3 animate-spin" />
            Connecting API
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            Queued
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Completed
          </span>
        );
      case 'canceled':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 px-2.5 py-1 rounded-full">
            <XCircle className="w-3 h-3" />
            Canceled
          </span>
        );
      default:
        return null;
    }
  };

  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'coins':
        return <Coins className="w-3.5 h-3.5 text-amber-500" />;
      case 'tiktok':
        return <span className="font-bold text-[10px] text-rose-500">TK</span>;
      case 'instagram':
        return <Camera className="w-3.5 h-3.5 text-pink-500" />;
      case 'telegram':
        return <Send className="w-3.5 h-3.5 text-cyan-500" />;
      case 'whatsapp':
        return <Phone className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Live Status bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-500" />
            Real-Time Campaign & Delivery Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live automated fulfillment for TikTok, TikTok Coins, Instagram, Telegram & WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('order')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>New Order</span>
        </button>
      </div>

      {/* Real-time KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Delivering */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Active Delivering
            </span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {inProgressOrders}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              +{processingOrders} queued
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cheap SMM automated API processing</p>
        </div>

        {/* Delivered Units */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Delivered
            </span>
            <TrendingUp className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
              {totalDelivered.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Likes, views, coins & members</p>
        </div>

        {/* Completed Campaigns */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Completed Orders
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {completedOrders}
            </span>
            <span className="text-[11px] text-slate-400">of {totalOrders} total</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">99.8% successful automated dispatch</p>
        </div>

        {/* Auto Refill Protection */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Auto Refill Protection
            </span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              Guaranteed
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cheap SMM zero-drop warranty</p>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Interactive Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Status ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              filterStatus === 'active'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Live ({inProgressOrders + processingOrders})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterStatus === 'completed'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Completed ({completedOrders})
          </button>
        </div>

        {/* Platform filter & Search input */}
        <div className="flex items-center gap-2">
          <select
            value={filterPlatform}
            onChange={e => setFilterPlatform(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none"
          >
            <option value="all">All Platforms</option>
            <option value="coins">TikTok Coins</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="telegram">Telegram</option>
            <option value="whatsapp">WhatsApp</option>
          </select>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search order ID, link..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Orders List / Live Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No matching campaigns found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery ? 'Try clearing your search query' : 'Create your first campaign now'}
            </p>
            <button
              onClick={() => setActiveTab('order')}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              Start New Order
            </button>
          </div>
        ) : (
          filteredOrders.map(order => {
            const percent = Math.min(100, Math.round((order.delivered / order.quantity) * 100));

            return (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Header row: ID, Platform, Service, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {order.id}
                    </span>
                    <span className="p-1 rounded bg-slate-100 dark:bg-slate-800">
                      {getPlatformIcon(order.platform)}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {order.serviceName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.refillRequested && (
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">
                        Refill Active
                      </span>
                    )}
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Target Link row */}
                <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] uppercase font-bold text-slate-400 shrink-0">
                      Target:
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                      {order.targetUrl}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(order.targetUrl, order.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                      title="Copy URL"
                    >
                      {copiedId === order.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {order.targetUrl.includes('http') && (
                      <a
                        href={order.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                        title="Open target in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Live Progress Bar & Counter */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {order.delivered.toLocaleString()} / {order.quantity.toLocaleString()} delivered
                      </span>
                      <span className="text-slate-400">({percent}%)</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      {order.platform !== 'coins' && (
                        <>
                          <span>Start: {order.startCount.toLocaleString()}</span>
                          <span>·</span>
                          <span>Current: {order.currentCount.toLocaleString()}</span>
                        </>
                      )}
                      {order.status === 'in_progress' && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            ~{order.speedPerMin}/min
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress bar container */}
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        order.status === 'completed'
                          ? 'bg-emerald-500'
                          : 'bg-linear-to-r from-emerald-500 via-cyan-400 to-[#FE2C55]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Footer details & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                    <span>Charge: PKR {order.chargePKR.toLocaleString()}</span>
                    <span>·</span>
                    <span>Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>·</span>
                    <span>{order.autoRefill ? 'Refill Protection' : 'Standard'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => speedUpOrder(order.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500/20 text-[11px]"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Turbo Speed</span>
                      </button>
                    )}

                    {order.status === 'completed' && order.autoRefill && (
                      <button
                        type="button"
                        onClick={() => requestRefill(order.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-500/20 text-[11px]"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Refill</span>
                      </button>
                    )}

                    {(order.status === 'pending' || order.status === 'in_progress') && (
                      <button
                        type="button"
                        onClick={() => cancelOrder(order.id)}
                        className="px-2.5 py-1 rounded-lg text-rose-500 hover:bg-rose-500/10 font-semibold text-[11px]"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleReorder(order.serviceId)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-[11px]"
                    >
                      Re-Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
