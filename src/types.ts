export type PlatformType = 'tiktok' | 'instagram' | 'telegram' | 'whatsapp' | 'coins';

export type ServiceCategory =
  | 'all'
  // TikTok categories
  | 'tiktok_followers'
  | 'tiktok_likes'
  | 'tiktok_views'
  | 'tiktok_shares'
  | 'tiktok_comments'
  | 'tiktok_coins'
  // Instagram categories
  | 'instagram_followers'
  | 'instagram_likes'
  | 'instagram_views'
  | 'instagram_comments'
  // Telegram categories
  | 'telegram_members'
  | 'telegram_views'
  | 'telegram_reactions'
  // WhatsApp categories
  | 'whatsapp_members'
  | 'whatsapp_reactions'
  | 'whatsapp_channel_followers';

export type ServiceTargetType =
  | 'tiktok_profile'
  | 'tiktok_video'
  | 'tiktok_username_coins'
  | 'instagram_profile'
  | 'instagram_post'
  | 'telegram_channel'
  | 'telegram_post'
  | 'whatsapp_group_link'
  | 'whatsapp_channel_link';

export interface SmmService {
  id: string;
  platform: PlatformType;
  name: string;
  category: ServiceCategory;
  ratePer1000PKR: number; // For coins: rate per unit or rate per 100 coins
  min: number;
  max: number;
  speedText: string;
  startText: string;
  refillDays: number;
  description: string;
  targetType: ServiceTargetType;
  popular?: boolean;
  guarantee: string;
  qualityBadge: string;
  unitLabel?: string; // e.g. "coins" or "units"
}

export type OrderStatus = 'pending' | 'processing' | 'in_progress' | 'completed' | 'partial' | 'canceled';

export interface SmmOrder {
  id: string;
  platform: PlatformType;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  targetUrl: string;
  quantity: number;
  delivered: number;
  startCount: number;
  currentCount: number;
  chargePKR: number;
  status: OrderStatus;
  createdAt: string;
  speedPerMin: number;
  autoRefill: boolean;
  dripFeedEnabled: boolean;
  dripRuns?: number;
  dripInterval?: number;
  comments?: string[];
  refillRequested?: boolean;
  refillLastDate?: string;
}

export type PaymentMethodType = 'easypaisa' | 'jazzcash' | 'usdt' | 'card';

export interface PaymentDeposit {
  id: string;
  method: PaymentMethodType;
  accountNumber: string;
  senderPhone: string;
  transactionId: string;
  amountPKR: number;
  bonusPKR: number;
  totalCreditedPKR: number;
  status: 'completed' | 'processing' | 'rejected';
  createdAt: string;
  screenshotNote?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface AnalyticsMetric {
  date: string;
  views: number;
  likes: number;
  followers: number;
  shares: number;
  spendPKR: number;
}
