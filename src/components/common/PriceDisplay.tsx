import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../constants/theme';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSavings?: boolean;
  style?: ViewStyle;
}

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  discount,
  size = 'md',
  showSavings = false,
  style,
}) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent =
    discount || (hasDiscount ? Math.round(((originalPrice! - price) / originalPrice!) * 100) : 0);

  const getTextStyles = () => {
    switch (size) {
      case 'sm':
        return {
          priceText: { fontSize: 13, fontWeight: '700' as const },
          originalText: { fontSize: 11 },
          discountText: { fontSize: 10, fontWeight: '700' as const },
        };
      case 'lg':
        return {
          priceText: { fontSize: 20, fontWeight: '800' as const },
          originalText: { fontSize: 14 },
          discountText: { fontSize: 13, fontWeight: '700' as const },
        };
      case 'xl':
        return {
          priceText: { fontSize: 26, fontWeight: '800' as const },
          originalText: { fontSize: 16 },
          discountText: { fontSize: 14, fontWeight: '700' as const },
        };
      case 'md':
      default:
        return {
          priceText: { fontSize: 15, fontWeight: '700' as const },
          originalText: { fontSize: 12 },
          discountText: { fontSize: 11, fontWeight: '700' as const },
        };
    }
  };

  const ts = getTextStyles();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.priceRow}>
        <Text style={[styles.currentPrice, ts.priceText]}>{formatINR(price)}</Text>
        {hasDiscount && (
          <Text style={[styles.originalPrice, ts.originalText]}>{formatINR(originalPrice!)}</Text>
        )}
        {hasDiscount && discountPercent > 0 && (
          <Text style={[styles.discountPercent, ts.discountText]}>({discountPercent}% OFF)</Text>
        )}
      </View>
      {showSavings && hasDiscount && (
        <Text style={styles.savingsText}>You save {formatINR(originalPrice! - price)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 6,
  },
  currentPrice: {
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  originalPrice: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  discountPercent: {
    color: COLORS.emerald,
  },
  savingsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.emerald,
    marginTop: 2,
    fontWeight: '600',
  },
});
