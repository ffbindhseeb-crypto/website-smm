import React from 'react';
import { useApp } from '../context/AppContext';
import { AddFundsView } from './AddFundsView';
import { X } from 'lucide-react';

export const AddFundsModal: React.FC = () => {
  const { isDepositModalOpen, setIsDepositModalOpen } = useApp();

  if (!isDepositModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Deposit Funds & Instant Easypaisa Gateway
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Account: 03364180438 · Zero Fees · 30-90s Automated Verification
            </p>
          </div>
          <button
            onClick={() => setIsDepositModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <AddFundsView isModal={true} onCloseModal={() => setIsDepositModalOpen(false)} />
        </div>
      </div>
    </div>
  );
};
