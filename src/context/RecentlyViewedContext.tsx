import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@vaunt_recently_viewed_v1';
const MAX_ITEMS = 20;

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addProductToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setRecentlyViewed(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load recently viewed', e);
      }
    };
    load();
  }, []);

  const addProductToRecentlyViewed = async (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch((e) =>
        console.warn('Failed to persist recently viewed', e)
      );
      return updated;
    });
  };

  const clearRecentlyViewed = async () => {
    setRecentlyViewed([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <RecentlyViewedContext.Provider
      value={{ recentlyViewed, addProductToRecentlyViewed, clearRecentlyViewed }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return context;
};
