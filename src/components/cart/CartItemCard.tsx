import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '../../types/cart';
import { COLORS, RADIUS, TYPOGRAPHY, SPACING, SHADOWS } from '../../constants/theme';
import { PriceDisplay } from '../common/PriceDisplay';
import { useWishlist } from '../../context/WishlistContext';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(item.productId);

  const handleMoveToWishlist = () => {
    if (!wishlisted) {
      toggleWishlist(item.product);
    }
    onRemove();
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Image source={{ uri: item.product.images[0] }} style={styles.thumbnail} />

        <View style={styles.detailsArea}>
          <View style={styles.brandRow}>
            <Text style={styles.brandName} numberOfLines={1}>
              {item.product.brandName}
            </Text>
            <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {item.product.name}
          </Text>

          {/* Size and Color Pill */}
          <View style={styles.variantRow}>
            <View style={styles.variantPill}>
              <Text style={styles.variantLabel}>Size: </Text>
              <Text style={styles.variantValue}>{item.selectedSize}</Text>
            </View>
            <View style={styles.variantPill}>
              <View style={[styles.colorDot, { backgroundColor: item.selectedColor.hex }]} />
              <Text style={styles.variantValue}>{item.selectedColor.name}</Text>
            </View>
          </View>

          <PriceDisplay
            price={item.product.price}
            originalPrice={item.product.originalPrice}
            discount={item.product.discount}
            size="sm"
            style={styles.priceRow}
          />
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.wishlistAction} onPress={handleMoveToWishlist}>
          <Ionicons name="bookmark-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.wishlistActionText}>Move to Wishlist</Text>
        </TouchableOpacity>

        {/* Quantity Stepper */}
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => onUpdateQuantity(item.quantity - 1)}
          >
            <Ionicons name="remove" size={14} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => onUpdateQuantity(item.quantity + 1)}
          >
            <Ionicons name="add" size={14} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbnail: {
    width: 80,
    height: 105,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSubtle,
  },
  detailsArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandName: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  variantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  variantPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  variantLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  variantValue: {
    ...TYPOGRAPHY.captionBold,
    fontSize: 10,
    color: COLORS.textPrimary,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  priceRow: {
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  wishlistAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  wishlistActionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSubtle,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    ...TYPOGRAPHY.captionBold,
    paddingHorizontal: 8,
    color: COLORS.textPrimary,
  },
});
