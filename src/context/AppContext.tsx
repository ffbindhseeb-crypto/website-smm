import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { SmmOrder, PaymentDeposit, ToastMessage, OrderStatus } from '../types';
import { sounds } from '../utils/audio';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  balancePKR: number;
  addBalance: (amount: number) => void;
  orders: SmmOrder[];
  placeOrder: (orderData: Omit<SmmOrder, 'id' | 'createdAt' | 'status' | 'delivered' | 'currentCount'>) => { success: boolean; error?: string };
  requestRefill: (orderId: string) => void;
  speedUpOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  deposits: PaymentDeposit[];
  submitDeposit: (depositData: {
    method: 'easypaisa' | 'jazzcash' | 'usdt' | 'card';
    accountNumber: string;
    senderPhone: string;
    transactionId: string;
    amountPKR: number;
    screenshotNote?: string;
  }) => Promise<{ success: boolean; message: string }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  quickSelectServiceId: string | null;
  setQuickSelectServiceId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial mock orders across all platforms to showcase live tracker immediately
const INITIAL_ORDERS: SmmOrder[] = [
  {
    id: 'ORD-98241',
    platform: 'tiktok',
    serviceId: 'tk-viw-301',
    serviceName: 'TikTok Ultra High-Speed Video Views [100% Watch Time FYP]',
    category: 'tiktok_views',
    targetUrl: 'https://www.tiktok.com/@creative_creator/video/7348918293182',
    quantity: 15000,
    delivered: 11450,
    startCount: 840,
    currentCount: 12290,
    chargePKR: 420,
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    speedPerMin: 280,
    autoRefill: true,
    dripFeedEnabled: false,
  },
  {
    id: 'ORD-98239',
    platform: 'coins',
    serviceId: 'tk-coin-701',
    serviceName: 'TikTok Coins Direct Live Top-Up [1 Rs Per Coin Wholesale Rate]',
    category: 'tiktok_coins',
    targetUrl: '@haseeb_official_pk',
    quantity: 350,
    delivered: 350,
    startCount: 120,
    currentCount: 470,
    chargePKR: 350,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    speedPerMin: 100,
    autoRefill: false,
    dripFeedEnabled: false,
  },
  {
    id: 'ORD-98235',
    platform: 'instagram',
    serviceId: 'ig-fol-801',
    serviceName: 'Instagram High Quality Non-Drop Followers [365-Day Refill]',
    category: 'instagram_followers',
    targetUrl: 'https://www.instagram.com/viraltrends_pk',
    quantity: 1000,
    delivered: 780,
    startCount: 3410,
    currentCount: 4190,
    chargePKR: 350,
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    speedPerMin: 60,
    autoRefill: true,
    dripFeedEnabled: false,
  },
  {
    id: 'ORD-98232',
    platform: 'telegram',
    serviceId: 'tg-mem-901',
    serviceName: 'Telegram Channel & Group Members [Non-Drop 0% Drop Lifetime]',
    category: 'telegram_members',
    targetUrl: 'https://t.me/pak_crypto_signals',
    quantity: 1000,
    delivered: 1000,
    startCount: 520,
    currentCount: 1520,
    chargePKR: 290,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    speedPerMin: 120,
    autoRefill: true,
    dripFeedEnabled: false,
  },
  {
    id: 'ORD-98228',
    platform: 'whatsapp',
    serviceId: 'wa-chn-951',
    serviceName: 'WhatsApp Channel Real Followers [Global & Pakistani Audience]',
    category: 'whatsapp_channel_followers',
    targetUrl: 'https://whatsapp.com/channel/0029Va4K1z...',
    quantity: 500,
    delivered: 340,
    startCount: 85,
    currentCount: 425,
    chargePKR: 225,
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    speedPerMin: 35,
    autoRefill: true,
    dripFeedEnabled: false,
  }
];

const INITIAL_DEPOSITS: PaymentDeposit[] = [
  {
    id: 'DEP-8419',
    method: 'easypaisa',
    accountNumber: '03364180438',
    senderPhone: '03009482194',
    transactionId: '37372948102',
    amountPKR: 2500,
    bonusPKR: 125,
    totalCreditedPKR: 2625,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    screenshotNote: 'Approved via 3737 Easypaisa SMS Auto-Gate',
  },
  {
    id: 'DEP-8210',
    method: 'easypaisa',
    accountNumber: '03364180438',
    senderPhone: '03124509123',
    transactionId: '37371092841',
    amountPKR: 1000,
    bonusPKR: 0,
    totalCreditedPKR: 1000,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    screenshotNote: 'Instant Verification Confirmed',
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smm_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark';
    }
    return 'dark';
  });

  // Balance state (default generous PKR 2,850 for testing)
  const [balancePKR, setBalancePKR] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smm_balance');
      if (saved) return Number(saved);
    }
    return 3200;
  });

  // Orders state
  const [orders, setOrders] = useState<SmmOrder[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smm_orders_v2');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_ORDERS;
        }
      }
    }
    return INITIAL_ORDERS;
  });

  // Deposits state
  const [deposits, setDeposits] = useState<PaymentDeposit[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smm_deposits');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_DEPOSITS;
        }
      }
    }
    return INITIAL_DEPOSITS;
  });

  const [activeTab, setActiveTab] = useState<string>('order');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [quickSelectServiceId, setQuickSelectServiceId] = useState<string | null>(null);

  // Sync theme to HTML root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('smm_theme', theme);
  }, [theme]);

  // Sync balance to localStorage
  useEffect(() => {
    localStorage.setItem('smm_balance', balancePKR.toString());
  }, [balancePKR]);

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem('smm_orders_v2', JSON.stringify(orders));
  }, [orders]);

  // Sync deposits to localStorage
  useEffect(() => {
    localStorage.setItem('smm_deposits', JSON.stringify(deposits));
  }, [deposits]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sounds.enabled = enabled;
  };

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addBalance = (amount: number) => {
    setBalancePKR(prev => Math.round((prev + amount) * 100) / 100);
  };

  // Place new order
  const placeOrder = (orderData: Omit<SmmOrder, 'id' | 'createdAt' | 'status' | 'delivered' | 'currentCount'>) => {
    if (balancePKR < orderData.chargePKR) {
      addToast(
        'Insufficient Balance',
        `You need PKR ${Math.round(orderData.chargePKR - balancePKR).toLocaleString()} more to place this order. Please deposit via Easypaisa (03364180438).`,
        'error'
      );
      setIsDepositModalOpen(true);
      return { success: false, error: 'Insufficient balance' };
    }

    // Deduct balance
    setBalancePKR(prev => Math.round((prev - orderData.chargePKR) * 100) / 100);

    const newOrder: SmmOrder = {
      ...orderData,
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      delivered: 0,
      currentCount: orderData.startCount,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Positive chime & visual celebration
    sounds.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#25F4EE', '#FE2C55', '#10B981', '#6366F1']
    });

    addToast(
      'Order Submitted!',
      `Order #${newOrder.id} (${orderData.serviceName}) dispatched to automated processing pipeline.`,
      'success'
    );

    return { success: true };
  };

  // Automated order processing engine (real-time simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        let changed = false;
        const updated = prevOrders.map(order => {
          if (order.status === 'completed' || order.status === 'canceled') {
            return order;
          }

          // Pending -> Processing
          if (order.status === 'pending') {
            changed = true;
            return { ...order, status: 'processing' as OrderStatus };
          }

          // Processing -> In Progress
          if (order.status === 'processing') {
            changed = true;
            return { ...order, status: 'in_progress' as OrderStatus };
          }

          // In Progress -> deliver increments
          if (order.status === 'in_progress') {
            const remaining = order.quantity - order.delivered;
            if (remaining <= 0) {
              changed = true;
              return {
                ...order,
                delivered: order.quantity,
                currentCount: order.startCount + order.quantity,
                status: 'completed' as OrderStatus,
              };
            }

            // Calculate realistic step based on quantity
            const stepFraction = Math.max(1, Math.floor(order.quantity * 0.04));
            const randomAdd = Math.floor(stepFraction * (0.8 + Math.random() * 0.5));
            const deliveryIncrement = Math.min(remaining, Math.max(5, randomAdd));

            const newDelivered = order.delivered + deliveryIncrement;
            const isFinished = newDelivered >= order.quantity;

            changed = true;
            return {
              ...order,
              delivered: newDelivered,
              currentCount: order.startCount + newDelivered,
              status: (isFinished ? 'completed' : 'in_progress') as OrderStatus,
            };
          }

          return order;
        });

        return changed ? updated : prevOrders;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Request refill
  const requestRefill = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            refillRequested: true,
            refillLastDate: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    sounds.playSuccess();
    addToast(
      'Refill Activated',
      `Auto-refill verification initiated for Order #${orderId}. Check progress shortly.`,
      'success'
    );
  };

  // Speed up order
  const speedUpOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            speedPerMin: Math.round(ord.speedPerMin * 1.6),
          };
        }
        return ord;
      })
    );
    addToast('Turbo Speed Applied', `Priority API cluster assigned to #${orderId}.`, 'info');
  };

  // Cancel order
  const cancelOrder = (orderId: string) => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return;

    if (target.status === 'completed') {
      addToast('Cannot Cancel', 'This order is already completed.', 'warning');
      return;
    }

    const refundProportion = Math.max(0, (target.quantity - target.delivered) / target.quantity);
    const refundAmount = Math.round(target.chargePKR * refundProportion);

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'canceled' as OrderStatus } : o))
    );

    if (refundAmount > 0) {
      addBalance(refundAmount);
      addToast(
        'Order Canceled & Refunded',
        `PKR ${refundAmount.toLocaleString()} credited back to your balance for undelivered units.`,
        'info'
      );
    } else {
      addToast('Order Canceled', `Order #${orderId} has been canceled.`, 'info');
    }
  };

  // Submit deposit (Automated Easypaisa & other gateways)
  const submitDeposit = async (data: {
    method: 'easypaisa' | 'jazzcash' | 'usdt' | 'card';
    accountNumber: string;
    senderPhone: string;
    transactionId: string;
    amountPKR: number;
    screenshotNote?: string;
  }): Promise<{ success: boolean; message: string }> => {
    if (!data.transactionId || data.transactionId.trim().length < 6) {
      return { success: false, message: 'Please enter a valid Transaction ID (at least 6-11 digits).' };
    }
    if (data.amountPKR < 100) {
      return { success: false, message: 'Minimum deposit is PKR 100.' };
    }

    const exists = deposits.some(d => d.transactionId.toLowerCase() === data.transactionId.trim().toLowerCase());
    if (exists) {
      return { success: false, message: 'This Transaction ID has already been credited or submitted!' };
    }

    const bonusPKR = data.amountPKR >= 2500 ? Math.round(data.amountPKR * 0.05) : 0;
    const totalCreditedPKR = data.amountPKR + bonusPKR;

    const newDeposit: PaymentDeposit = {
      id: `DEP-${Math.floor(1000 + Math.random() * 9000)}`,
      method: data.method,
      accountNumber: data.accountNumber,
      senderPhone: data.senderPhone,
      transactionId: data.transactionId.trim(),
      amountPKR: data.amountPKR,
      bonusPKR,
      totalCreditedPKR,
      status: 'completed',
      createdAt: new Date().toISOString(),
      screenshotNote: data.screenshotNote || 'Verified via Easypaisa Merchant Gate',
    };

    setDeposits(prev => [newDeposit, ...prev]);
    addBalance(totalCreditedPKR);

    sounds.playCoinDeposit();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00F2FE', '#4ADE80', '#FE2C55']
    });

    return {
      success: true,
      message: `Deposit of PKR ${totalCreditedPKR.toLocaleString()} (including PKR ${bonusPKR} bonus) was approved and added to your balance!`,
    };
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        balancePKR,
        addBalance,
        orders,
        placeOrder,
        requestRefill,
        speedUpOrder,
        cancelOrder,
        deposits,
        submitDeposit,
        activeTab,
        setActiveTab,
        toasts,
        addToast,
        removeToast,
        isDepositModalOpen,
        setIsDepositModalOpen,
        soundEnabled,
        setSoundEnabled,
        quickSelectServiceId,
        setQuickSelectServiceId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
