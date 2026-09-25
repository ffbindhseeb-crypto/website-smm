import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Activity,
  CreditCard,
  ListFilter,
  BarChart3,
  Layers,
  Sparkles,
  ShieldCheck,
  Coins,
} from 'lucide-react';

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { activeTab, setActiveTab, orders } = useApp();

  const activeOrdersCount = orders.filter(
    o => o.status === 'in_progress' || o.status === 'processing' || o.status === 'pending'
  ).length;

  const navItems = [
    {
      id: 'order',
      label: 'New Order',
      icon: ShoppingBag,
      description: 'TikTok, IG, TG, WA & Coins',
    },
    {
      id: 'tracker',
      label: 'Campaign Tracker',
      icon: Activity,
      description: 'Real-time live progress',
      badge: activeOrdersCount > 0 ? `${activeOrdersCount} live` : undefined,
      pulse: activeOrdersCount > 0,
    },
    {
      id: 'funds',
      label: 'Add Funds (Easypaisa)',
      icon: CreditCard,
      description: '03364180438 Instant Gate',
      highlight: true,
    },
    {
      id: 'services',
      label: 'Services & Rates',
      icon: ListFilter,
      description: 'Cheap wholesale price list',
    },
    {
      id: 'analytics',
      label: 'Analytics & Insights',
      icon: BarChart3,
      description: 'Multi-platform delivery trends',
    },
    {
      id: 'mass_order',
      label: 'Mass / Bulk Order',
      icon: Layers,
      description: 'Multi-link batch launcher',
    },
    {
      id: 'calculator',
      label: 'FYP & Growth Calculator',
      icon: Sparkles,
      description: 'Algorithm score & coin estimator',
    },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-16 z-30 w-64 shrink-0 h-[calc(100vh-4rem)] border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 flex flex-col justify-between p-4 transition-transform duration-200 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          <div className="px-2 py-1 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Navigation
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Cheap Rates
            </span>
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                } ${item.highlight && !isActive ? 'border border-emerald-500/30 bg-emerald-500/5' : ''}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-cyan-400 dark:text-cyan-400'
                        : item.highlight
                        ? 'text-emerald-500'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <div className="truncate">
                    <div className="font-semibold leading-tight flex items-center gap-1.5">
                      {item.label}
                      {item.pulse && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Easypaisa Quick Info & Trust Box */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Official Easypaisa Gate</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Mobile Account Number:
            </p>
            <div className="mt-1 font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              03364180438
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>Instant Credit</span>
              <span>·</span>
              <span>0% Fees</span>
              <span>·</span>
              <span>Auto 3737</span>
            </div>
          </div>

          <div className="text-[11px] text-center text-slate-400 dark:text-slate-500">
            Cheap SMM Panel · 24/7 API Cluster
          </div>
        </div>
      </aside>
    </>
  );
};
