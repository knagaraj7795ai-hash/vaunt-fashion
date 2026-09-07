export type LoyaltyTier = 'Silver' | 'Gold' | 'Platinum' | 'VAUNT Black';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
}
