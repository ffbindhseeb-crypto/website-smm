import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Moon,
  Wallet,
  PlusCircle,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Coins,
} from 'lucide-react';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const {
    theme,
    toggleTheme,
    balancePKR,
    setIsDepositModalOpen,
    soundEnabled,
    setSoundEnabled,
    setActiveTab,
    setQuickSelectServiceId,
  } = useApp();

  const handleCoinsClick = () => {
    setQuickSelectServiceId('tk-coin-701');
    setActiveTab('order');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            {/* Cheap SMM Panel Icon Mark */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-cyan-500 text-white font-black text-xs shadow-sm shadow-emerald-500/20 select-none">
              <span>SMM</span>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Cheap SMM Panel
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30">
                  #1 Wholesale
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                TikTok · Coins · Instagram · Telegram · WhatsApp · Easypaisa 03364180438
              </p>
            </div>
          </div>
        </div>

        {/* Right side tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick TikTok Coins Deal Button */}
          <button
            onClick={handleCoinsClick}
            className="hidden md:flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-all shadow-xs"
          >
            <Coins className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>TikTok Coins Top-Up</span>
          </button>

          {/* Easypaisa Live Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">Easypaisa 03364180438</span>
          </div>

          {/* Balance card */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-1 pl-3 shadow-inner">
            <div className="flex items-center gap-1.5 mr-2">
              <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 leading-none">
                  Balance
                </span>
                <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  PKR {balancePKR.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              title="Deposit via Easypaisa (03364180438)"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Deposit</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
