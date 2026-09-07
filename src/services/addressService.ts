import rawAddresses from '../data/addresses.json';
import { Address } from '../types/address';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@vaunt_addresses_v1';

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read addresses from storage', e);
    }
    return [...(rawAddresses as Address[])];
  },

  async saveAddresses(addresses: Address[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    } catch (e) {
      console.warn('Failed to save addresses to storage', e);
    }
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    const list = await this.getAddresses();
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}`,
    };

    if (newAddress.isDefault || list.length === 0) {
      newAddress.isDefault = true;
      list.forEach((a) => (a.isDefault = false));
    }

    list.unshift(newAddress);
    await this.saveAddresses(list);
    return newAddress;
  },

  async updateAddress(address: Address): Promise<Address> {
    const list = await this.getAddresses();
    const index = list.findIndex((a) => a.id === address.id);
    if (index !== -1) {
      if (address.isDefault) {
        list.forEach((a) => (a.isDefault = false));
      }
      list[index] = address;
      await this.saveAddresses(list);
    }
    return address;
  },

  async deleteAddress(id: string): Promise<void> {
    let list = await this.getAddresses();
    list = list.filter((a) => a.id !== id);
    if (list.length > 0 && !list.some((a) => a.isDefault)) {
      list[0].isDefault = true;
    }
    await this.saveAddresses(list);
  },

  async setDefaultAddress(id: string): Promise<void> {
    const list = await this.getAddresses();
    list.forEach((a) => {
      a.isDefault = a.id === id;
    });
    await this.saveAddresses(list);
  },
};
