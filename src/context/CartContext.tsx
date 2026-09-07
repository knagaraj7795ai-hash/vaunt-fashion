import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductColor } from '../types/product';
import { CartItem, CartSummary, Coupon } from '../types/cart';
import { couponService } from '../services/couponService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@vaunt_cart_items_v1';
const COUPON_STORAGE_KEY = '@vaunt_applied_coupon_v1';
const FREE_DELIVERY_THRESHOLD = 999;
const STANDARD_DELIVERY_FEE = 99;
const PLATFORM_FEE = 20;

interface CartContextType {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  summary: CartSummary;
  addToCart: (product: Product, selectedSize: string, selectedColor: ProductColor, quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isItemInCart: (productId: string, size?: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedItems) {
          setItems(JSON.parse(storedItems));
        }
        const storedCoupon = await AsyncStorage.getItem(COUPON_STORAGE_KEY);
        if (storedCoupon) {
          setAppliedCoupon(JSON.parse(storedCoupon));
        }
      } catch (e) {
        console.warn('Failed to load cart', e);
      }
    };
    loadCart();
  }, []);

  const saveItems = async (cartItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart items', e);
    }
  };

  const saveCoupon = async (coupon: Coupon | null) => {
    try {
      if (coupon) {
        await AsyncStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
      } else {
        await AsyncStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save coupon', e);
    }
  };

  const isItemInCart = (productId: string, size?: string): boolean => {
    if (size) {
      return items.some((item) => item.productId === productId && item.selectedSize === size);
    }
    return items.some((item) => item.productId === productId);
  };

  const addToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: ProductColor,
    quantity = 1
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === product.id &&
          i.selectedSize === selectedSize &&
          i.selectedColor.name === selectedColor.name
      );

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: `${product.id}_${selectedSize}_${selectedColor.name}_${Date.now()}`,
          productId: product.id,
          product,
          selectedSize,
          selectedColor,
          quantity,
          addedAt: new Date().toISOString(),
        };
        updated = [newItem, ...prev];
      }
      saveItems(updated);
      return updated;
    });
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    setItems((prev) => {
      let updated: CartItem[];
      if (newQuantity <= 0) {
        updated = prev.filter((i) => i.id !== cartItemId);
      } else {
        updated = prev.map((i) => (i.id === cartItemId ? { ...i, quantity: newQuantity } : i));
      }
      saveItems(updated);
      return updated;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== cartItemId);
      saveItems(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    saveItems([]);
    saveCoupon(null);
  };

  // Pricing calculations
  const mrpTotal = items.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);
  const sellingTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountTotal = mrpTotal - sellingTotal;

  let couponDiscount = 0;
  if (appliedCoupon && sellingTotal > 0) {
    if (sellingTotal >= appliedCoupon.minimumOrder) {
      if (appliedCoupon.discountType === 'flat') {
        couponDiscount = appliedCoupon.discountValue;
      } else {
        const calc = Math.round((sellingTotal * appliedCoupon.discountValue) / 100);
        couponDiscount = appliedCoupon.maximumDiscount ? Math.min(calc, appliedCoupon.maximumDiscount) : calc;
      }
    }
  }

  const deliveryFee = items.length === 0 ? 0 : sellingTotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const platformFee = items.length === 0 ? 0 : PLATFORM_FEE;
  const totalPayable = Math.max(0, sellingTotal - couponDiscount + deliveryFee + platformFee);
  const totalSavings = discountTotal + couponDiscount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const summary: CartSummary = {
    mrpTotal,
    discountTotal,
    couponDiscount,
    deliveryFee,
    platformFee,
    totalPayable,
    totalSavings,
    itemCount,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (items.length === 0) {
      return { success: false, message: 'Your cart is empty. Add items to apply coupon.' };
    }

    const res = await couponService.validateCoupon(code, sellingTotal);
    if (res.isValid && res.coupon) {
      setAppliedCoupon(res.coupon);
      await saveCoupon(res.coupon);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    saveCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        summary,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        isItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
