import { Product, ProductColor } from './product';

export interface CartItem {
  id: string; // unique cart item id (e.g. productId_size_color)
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
  addedAt: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minimumOrder: number;
  maximumDiscount?: number;
  expiryDate: string;
  applicableCategories?: string[];
}

export interface CartSummary {
  mrpTotal: number;
  discountTotal: number;
  couponDiscount: number;
  deliveryFee: number;
  platformFee: number;
  totalPayable: number;
  totalSavings: number;
  itemCount: number;
  freeDeliveryThreshold: number;
}
