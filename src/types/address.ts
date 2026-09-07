export type AddressType = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  name: string;
  mobile: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  type: AddressType;
  isDefault: boolean;
}
