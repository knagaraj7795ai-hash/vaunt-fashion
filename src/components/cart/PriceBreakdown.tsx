import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartSummary, Coupon } from '../../types/cart';
import { COLORS, RADIUS, TYPOGRAPHY, SPACING } from '../../constants/theme';
import { formatINR } from '../common/PriceDisplay';

interface PriceBreakdownProps {
  summary: CartSummary;
  appliedCoupon?: Coupon | null;
  onRemoveCoupon?: () => void;
  onOpenCouponModal?: () => void;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  summary,
  appliedCoupon,
  onRemoveCoupon,
  onOpenCouponModal,
}) => {
  return (
    <View style={styles.container}>
      {/* Coupon banner / action */}
      {appliedCoupon ? (
        <View style={styles.couponAppliedCard}>
          <View style={styles.couponLeft}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.emerald} />
            <View>
              <Text style={styles.couponCodeText}>Code: {appliedCoupon.code}</Text>
              <Text style={styles.couponSavingsText}>
                You save {formatINR(summary.couponDiscount)} with this code
              </Text>
            </View>
          </View>
          {onRemoveCoupon && (
            <TouchableOpacity onPress={onRemoveCoupon}>
              <Text style={styles.removeCouponText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : onOpenCouponModal ? (
        <TouchableOpacity
          style={styles.applyCouponTrigger}
          onPress={onOpenCouponModal}
          activeOpacity={0.8}
        >
          <View style={styles.couponLeft}>
            <Ionicons name="pricetag-outline" size={18} color={COLORS.primary} />
            <Text style={styles.applyCouponTitle}>Apply Coupon / Offers</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      ) : null}

      <View style={styles.priceCard}>
        <Text style={styles.sectionTitle}>PRICE DETAILS ({summary.itemCount} Items)</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Total MRP</Text>
          <Text style={styles.value}>{formatINR(summary.mrpTotal)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Discount on MRP</Text>
          <Text style={[styles.value, styles.discountGreen]}>
            -{formatINR(summary.discountTotal)}
          </Text>
        </View>

        {summary.couponDiscount > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Coupon Discount</Text>
            <Text style={[styles.value, styles.discountGreen]}>
              -{formatINR(summary.couponDiscount)}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <View style={styles.deliveryRow}>
            <Text style={styles.label}>Delivery Fee</Text>
            {summary.deliveryFee === 0 && (
              <Text style={styles.freePill}>FREE</Text>
            )}
          </View>
          <Text style={[styles.value, summary.deliveryFee === 0 && styles.discountGreen]}>
            {summary.deliveryFee === 0 ? 'FREE' : formatINR(summary.deliveryFee)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Platform Fee</Text>
          <Text style={styles.value}>{formatINR(summary.platformFee)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{formatINR(summary.totalPayable)}</Text>
        </View>
      </View>

      {summary.totalSavings > 0 && (
        <View style={styles.savingsBanner}>
          <Ionicons name="sparkles" size={16} color={COLORS.emerald} />
          <Text style={styles.savingsBannerText}>
            You will save {formatINR(summary.totalSavings)} on this order!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  applyCouponTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  applyCouponTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  couponAppliedCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldLight,
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.2)',
  },
  couponCodeText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.emerald,
    fontSize: 13,
  },
  couponSavingsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.emerald,
    fontSize: 11,
  },
  removeCouponText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.rose,
  },
  priceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  value: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  discountGreen: {
    color: COLORS.emerald,
    fontWeight: '700',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  freePill: {
    ...TYPOGRAPHY.micro,
    color: COLORS.emerald,
    backgroundColor: COLORS.emeraldLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
  },
  totalValue: {
    ...TYPOGRAPHY.title1,
    color: COLORS.textPrimary,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.emeraldLight,
    padding: 10,
    borderRadius: RADIUS.md,
    marginTop: 10,
    gap: 6,
  },
  savingsBannerText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.emerald,
  },
});
