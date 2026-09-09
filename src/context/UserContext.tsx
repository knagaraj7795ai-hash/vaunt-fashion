import React, { createContext, useContext, useState, useEffect } from 'react';
import rawUser from '../data/users.json';
import { UserProfile } from '../types/user';
import { authService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@vaunt_user_profile_v1';
const AUTH_KEY = '@vaunt_is_authenticated';
const GUEST_KEY = '@vaunt_is_guest';

interface UserContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  addLoyaltyPoints: (points: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Guest User',
  email: '',
  phone: '',
  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
  joinedDate: new Date().toISOString(),
  loyaltyTier: 'Silver',
  loyaltyPoints: 0,
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(rawUser as UserProfile);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const [storedUser, authStatus, guestStatus] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(AUTH_KEY),
          AsyncStorage.getItem(GUEST_KEY),
        ]);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setIsAuthenticated(authStatus === 'true');
        setIsGuest(guestStatus === 'true');
      } catch (e) {
        console.warn('Failed to load session', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = async (emailOrPhone: string, password: string) => {
    const result = await authService.login(emailOrPhone, password);
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
      await AsyncStorage.setItem(AUTH_KEY, 'true');
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const result = await authService.register(name, email, phone, password);
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
      await AsyncStorage.setItem(AUTH_KEY, 'true');
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const loginAsGuest = async () => {
    setUser(GUEST_USER);
    setIsAuthenticated(true);
    setIsGuest(true);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(GUEST_USER));
    await AsyncStorage.setItem(AUTH_KEY, 'true');
    await AsyncStorage.setItem(GUEST_KEY, 'true');
  };

  const logout = async () => {
    setUser(rawUser as UserProfile);
    setIsAuthenticated(false);
    setIsGuest(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(AUTH_KEY);
    await AsyncStorage.removeItem(GUEST_KEY);
  };

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

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isGuest,
        isLoading,
        login,
        register,
        loginAsGuest,
        logout,
        updateProfile,
        addLoyaltyPoints,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
