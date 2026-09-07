import React, { createContext, useContext, useState, useEffect } from 'react';
import { Address } from '../types/address';
import { addressService } from '../services/addressService';

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  selectAddress: (address: Address) => void;
  addAddress: (addr: Omit<Address, 'id'>) => Promise<Address>;
  updateAddress: (addr: Address) => Promise<Address>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  refreshAddresses: () => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const refreshAddresses = async () => {
    const list = await addressService.getAddresses();
    setAddresses(list);
    const defaultAddr = list.find((a) => a.isDefault) || list[0] || null;
    setSelectedAddress((prev) => (prev ? list.find((a) => a.id === prev.id) || defaultAddr : defaultAddr));
  };

  useEffect(() => {
    refreshAddresses();
  }, []);

  const selectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  const addAddress = async (addr: Omit<Address, 'id'>): Promise<Address> => {
    const created = await addressService.addAddress(addr);
    await refreshAddresses();
    if (created.isDefault || !selectedAddress) {
      setSelectedAddress(created);
    }
    return created;
  };

  const updateAddress = async (addr: Address): Promise<Address> => {
    const updated = await addressService.updateAddress(addr);
    await refreshAddresses();
    return updated;
  };

  const deleteAddress = async (id: string): Promise<void> => {
    await addressService.deleteAddress(id);
    await refreshAddresses();
  };

  const setDefaultAddress = async (id: string): Promise<void> => {
    await addressService.setDefaultAddress(id);
    await refreshAddresses();
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        selectAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        refreshAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) throw new Error('useAddress must be used within AddressProvider');
  return context;
};
