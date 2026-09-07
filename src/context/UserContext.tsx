import React, { createContext, useContext, useState, useEffect } from 'react';
import rawUser from '../data/users.json';
import { UserProfile } from '../types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@vaunt_user_profile_v1';

interface UserContextType {
  user: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  addLoyaltyPoints: (points: number) => Promise<void>;
  resetUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(rawUser as UserProfile);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load user', e);
      }
    };
    loadUser();
  }, []);

  const updateProfile = async (updated: Partial<UserProfile>) => {
    const nextUser = { ...user, ...updated };
    setUser(nextUser);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch (e) {
      console.warn('Failed to persist user profile', e);
    }
  };

  const addLoyaltyPoints = async (points: number) => {
    await updateProfile({ loyaltyPoints: user.loyaltyPoints + points });
  };

  const resetUser = async () => {
    setUser(rawUser as UserProfile);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider value={{ user, updateProfile, addLoyaltyPoints, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
