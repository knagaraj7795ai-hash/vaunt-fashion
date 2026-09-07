import { CartItem } from './cart';
import { Address } from './address';

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentMethod = 'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Cash on Delivery' | 'Wallet';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  deliverySpeed: 'Standard' | 'Express';
  estimatedDelivery: string;
  actualDelivery?: string;
  summary: {
    mrpTotal: number;
    discountTotal: number;
    couponDiscount: number;
    couponCode?: string;
    deliveryFee: number;
    platformFee: number;
    totalAmount: number;
  };
  trackingSteps: TrackingStep[];
  canCancel: boolean;
}
