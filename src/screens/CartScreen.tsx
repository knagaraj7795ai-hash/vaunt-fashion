import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Coupon } from '../types/cart';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { couponService } from '../services/couponService';
import { Header } from '../components/common/Header';
import { CartItemCard } from '../components/cart/CartItemCard';
import { PriceBreakdown } from '../components/cart/PriceBreakdown';
import { CouponSelectorModal } from '../components/cart/CouponSelectorModal';
import { EmptyState } from '../components/common/EmptyState';
import { formatINR } from '../components/common/PriceDisplay';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    items,
    appliedCoupon,
    summary,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { selectedAddress } = useAddress();

  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    couponService.getAvailableCoupons().then(setAvailableCoupons);
  }, []);

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  const amountNeededForFreeDelivery = Math.max(
    0,
    summary.freeDeliveryThreshold - (summary.mrpTotal - summary.discountTotal)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header showBack title={`Shopping Bag (${summary.itemCount})`} showCart={false} showLocation={false} />

      {items.length > 0 ? (
        <View style={styles.container}>
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Delivery Address Snapshot */}
            <View style={styles.addressSnapshot}>
              <View style={styles.addressLeft}>
                <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                <View style={styles.addressTextContainer}>
                  <Text style={styles.deliverToText}>
                    Deliver to: <Text style={styles.boldName}>{selectedAddress?.name || 'Aryan Sharma'}</Text>,{' '}
                    {selectedAddress?.pincode || '560102'}
                  </Text>
                  <Text style={styles.addressSub} numberOfLines={1}>
                    {selectedAddress
                      ? `${selectedAddress.houseFlat}, ${selectedAddress.area}, ${selectedAddress.city}`
                      : 'HSR Layout, Bengaluru'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddressManagement', { selectMode: true })}
              >
                <Text style={styles.changeAddressText}>CHANGE</Text>
              </TouchableOpacity>
            </View>

            {/* Free Delivery Callout Banner */}
            {amountNeededForFreeDelivery > 0 ? (
              <View style={styles.freeDeliveryBanner}>
                <Ionicons name="car-outline" size={16} color={COLORS.primary} />
                <Text style={styles.freeDeliveryText}>
                  Add {formatINR(amountNeededForFreeDelivery)} more to unlock{' '}
                  <Text style={styles.boldText}>FREE Express Delivery</Text>
                </Text>
              </View>
            ) : (
              <View style={[styles.freeDeliveryBanner, styles.freeDeliveryUnlocked]}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.emerald} />
                <Text style={[styles.freeDeliveryText, { color: COLORS.emerald }]}>
                  Yay! You have unlocked <Text style={styles.boldText}>FREE Delivery</Text>
                </Text>
              </View>
            )}

            {/* Cart Items List */}
            <View style={styles.itemsSection}>
              {items.map((cartItem) => (
                <CartItemCard
                  key={cartItem.id}
                  item={cartItem}
                  onUpdateQuantity={(qty) => updateQuantity(cartItem.id, qty)}
                  onRemove={() => removeFromCart(cartItem.id)}
                />
              ))}
            </View>

            {/* Price Breakdown Component */}
            <PriceBreakdown
              summary={summary}
              appliedCoupon={appliedCoupon}
              onRemoveCoupon={removeCoupon}
              onOpenCouponModal={() => setCouponModalVisible(true)}
            />

            {/* Trust & Safe Checkout Badges */}
            <View style={styles.trustBadgesRow}>
              <View style={styles.trustItem}>
                <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.textMuted} />
                <Text style={styles.trustText}>100% Original</Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="swap-horizontal-outline" size={18} color={COLORS.textMuted} />
                <Text style={styles.trustText}>14-Day Returns</Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} />
                <Text style={styles.trustText}>Secure Checkout</Text>
              </View>
            </View>

            <View style={styles.bottomBuffer} />
          </ScrollView>

          {/* Sticky Bottom Checkout Footer */}
          <View style={styles.stickyFooter}>
            <View style={styles.footerPriceCol}>
              <Text style={styles.footerTotalLabel}>Total Amount</Text>
              <Text style={styles.footerTotalPrice}>{formatINR(summary.totalPayable)}</Text>
              {summary.totalSavings > 0 && (
                <Text style={styles.footerSavings}>You save {formatINR(summary.totalSavings)}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutBtnText}>CHECKOUT</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="bag-outline"
            title="Hey, your bag is empty!"
            message="Looks like you haven't added anything to your cart yet. Explore our fresh collections today."
            buttonTitle="START EXPLORING"
            onButtonPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' } as any)}
          />
        </View>
      )}

      {/* Coupon Modal */}
      <CouponSelectorModal
        visible={couponModalVisible}
        coupons={availableCoupons}
        appliedCoupon={appliedCoupon}
        onClose={() => setCouponModalVisible(false)}
        onApplyCoupon={applyCoupon}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  scrollArea: {
    padding: SPACING.base,
  },
  addressSnapshot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  addressTextContainer: {
    flex: 1,
  },
  deliverToText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
  },
  boldName: {
    fontWeight: '700',
  },
  addressSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  changeAddressText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.accent,
    marginLeft: 8,
  },
  freeDeliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: RADIUS.md,
    marginBottom: 14,
  },
  freeDeliveryUnlocked: {
    backgroundColor: COLORS.emeraldLight,
  },
  freeDeliveryText: {
    ...TYPOGRAPHY.caption,
    color: '#78350F',
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
  },
  itemsSection: {
    marginBottom: 4,
  },
  trustBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SPACING.md,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  trustItem: {
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    fontSize: 10,
  },
  bottomBuffer: {
    height: 90,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  footerPriceCol: {
    flexDirection: 'column',
  },
  footerTotalLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  footerTotalPrice: {
    ...TYPOGRAPHY.title1,
    color: COLORS.textPrimary,
  },
  footerSavings: {
    ...TYPOGRAPHY.micro,
    color: COLORS.emerald,
    fontWeight: '700',
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
    height: 48,
    borderRadius: RADIUS.md,
  },
  checkoutBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    justifyContent: 'center',
    padding: SPACING.base,
  },
});
