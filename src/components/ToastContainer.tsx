import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-cyan-500 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-500/30 bg-emerald-950/20',
          error: 'border-rose-500/30 bg-rose-950/20',
          warning: 'border-amber-500/30 bg-amber-950/20',
          info: 'border-cyan-500/30 bg-cyan-950/20',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 ${borders[toast.type]} transition-all animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                {toast.title}
              </h4>
              <p className="text-xs mt-0.5 leading-relaxed text-slate-700 dark:text-slate-200">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
