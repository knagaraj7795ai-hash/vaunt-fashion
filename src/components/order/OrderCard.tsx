import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Order, OrderStatus } from '../../types/order';
import { COLORS, RADIUS, TYPOGRAPHY, SPACING, SHADOWS } from '../../constants/theme';
import { formatINR } from '../common/PriceDisplay';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return { bg: COLORS.emeraldLight, text: COLORS.emerald };
      case 'Out for Delivery':
      case 'Shipped':
        return { bg: '#DBEAFE', text: COLORS.accent };
      case 'Cancelled':
      case 'Returned':
        return { bg: COLORS.roseLight, text: COLORS.rose };
      case 'Order Placed':
      case 'Confirmed':
      case 'Packed':
      default:
        return { bg: COLORS.amberLight, text: COLORS.amber };
    }
  };

  const statusColors = getStatusColor(order.status);
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleTrack = () => {
    navigation.navigate('OrderTracking', { orderId: order.id });
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>Placed on {formattedDate}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusColors.bg }]}>
          <Text style={[styles.statusText, { color: statusColors.text }]}>{order.status}</Text>
        </View>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsRow}>
        <View style={styles.imagesContainer}>
          {order.items.slice(0, 3).map((item, idx) => (
            <Image
              key={idx}
              source={{ uri: item.product.images[0] }}
              style={[styles.itemThumbnail, idx > 0 && { marginLeft: -16 }]}
            />
          ))}
          {order.items.length > 3 && (
            <View style={styles.moreItemsBadge}>
              <Text style={styles.moreItemsText}>+{order.items.length - 3}</Text>
            </View>
          )}
        </View>

        <View style={styles.itemSummary}>
          <Text style={styles.firstItemName} numberOfLines={1}>
            {order.items[0]?.product.name || 'Fashion items'}
          </Text>
          <Text style={styles.itemMeta}>
            {order.items.reduce((s, i) => s + i.quantity, 0)} Items • Total: {formatINR(order.summary.totalAmount)}
          </Text>
        </View>
      </View>

      {/* Footer / CTA */}
      <View style={styles.footer}>
        <View style={styles.deliveryEstimate}>
          <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.deliveryText}>
            {order.status === 'Delivered'
              ? `Delivered on ${order.actualDelivery || 'Aug 2026'}`
              : `Est: ${order.estimatedDelivery}`}
          </Text>
        </View>

        <TouchableOpacity style={styles.trackBtn} onPress={handleTrack} activeOpacity={0.8}>
          <Text style={styles.trackBtnText}>TRACK ORDER</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  orderDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  statusText: {
    ...TYPOGRAPHY.micro,
    fontWeight: '800',
    fontSize: 10,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemThumbnail: {
    width: 48,
    height: 60,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  moreItemsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  moreItemsText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  itemSummary: {
    flex: 1,
  },
  firstItemName: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  itemMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  deliveryEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  trackBtnText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.primary,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
