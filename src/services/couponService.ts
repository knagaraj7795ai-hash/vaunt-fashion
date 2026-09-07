import rawCoupons from '../data/coupons.json';
import { Coupon } from '../types/cart';

const coupons: Coupon[] = rawCoupons as Coupon[];

export interface CouponValidationResult {
  isValid: boolean;
  message: string;
  coupon?: Coupon;
  discountAmount: number;
}

export const couponService = {
  async getAvailableCoupons(): Promise<Coupon[]> {
    return Promise.resolve([...coupons]);
  },

  async validateCoupon(code: string, cartTotal: number): Promise<CouponValidationResult> {
    const formattedCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === formattedCode);

    if (!coupon) {
      return Promise.resolve({
        isValid: false,
        message: `Invalid coupon code "${code}". Please check and try again.`,
        discountAmount: 0,
      });
    }

    // Expiry check
    const today = new Date().toISOString().split('T')[0];
    if (coupon.expiryDate < today) {
      return Promise.resolve({
        isValid: false,
        message: `Coupon code "${coupon.code}" has expired on ${coupon.expiryDate}.`,
        discountAmount: 0,
      });
    }

    // Minimum order check
    if (cartTotal < coupon.minimumOrder) {
      return Promise.resolve({
        isValid: false,
        message: `Add ₹${coupon.minimumOrder - cartTotal} more to apply code "${coupon.code}". (Min order ₹${coupon.minimumOrder})`,
        discountAmount: 0,
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'flat') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'percentage') {
      const calculated = Math.round((cartTotal * coupon.discountValue) / 100);
      discountAmount = coupon.maximumDiscount ? Math.min(calculated, coupon.maximumDiscount) : calculated;
    }

    return Promise.resolve({
      isValid: true,
      message: `Yay! "${coupon.code}" applied successfully. You save ₹${discountAmount}!`,
      coupon,
      discountAmount,
    });
  },
};
