import rawNotifications from '../data/notifications.json';
import { AppNotification } from '../types/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@vaunt_notifications_v1';

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load notifications from storage', e);
    }
    return [...(rawNotifications as AppNotification[])];
  },

  async saveNotifications(notifs: AppNotification[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
    } catch (e) {
      console.warn('Failed to save notifications to storage', e);
    }
  },

  async markAsRead(id: string): Promise<void> {
    const list = await this.getNotifications();
    const item = list.find((n) => n.id === id);
    if (item) {
      item.read = true;
      await this.saveNotifications(list);
    }
  },

  async markAllAsRead(): Promise<void> {
    const list = await this.getNotifications();
    list.forEach((n) => (n.read = true));
    await this.saveNotifications(list);
  },

  async clearAll(): Promise<void> {
    await this.saveNotifications([]);
  },
};
