export type NotificationCategory = 'All' | 'Orders' | 'Offers' | 'Drops';

export interface AppNotification {
  id: string;
  category: 'Orders' | 'Offers' | 'Drops';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRoute?: string;
  actionParams?: Record<string, any>;
  icon?: string;
}
