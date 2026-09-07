import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification } from '../types/notification';
import { notificationService } from '../services/notificationService';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refreshNotifications = async () => {
    const list = await notificationService.getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    await refreshNotifications();
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    await refreshNotifications();
  };

  const clearAll = async () => {
    await notificationService.clearAll();
    await refreshNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
