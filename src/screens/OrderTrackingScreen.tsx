import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Order } from '../types/order';
import { useOrders } from '../context/OrderContext';
import { Header } from '../components/common/Header';
import { TrackingTimeline } from '../components/order/TrackingTimeline';
import { formatINR } from '../components/common/PriceDisplay';
import { Button } from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

type RouteProps = RouteProp<RootStackParamList, 'OrderTracking'>;

export const OrderTrackingScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orderId } = route.params;
  const { getOrderById, cancelOrder } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await getOrderById(orderId);
      setOrder(res);
      setLoading(false);
    };
    fetch();
  }, [orderId, getOrderById]);

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? The refund will be credited back to your payment source in 3-5 business days.',
      [
        { text: 'Keep Order', style: 'cancel' },
        {
          text: 'Yes, Cancel Order',
          style: 'destructive',
          onPress: async () => {
            const success = await cancelOrder(orderId);
            if (success) {
              const updated = await getOrderById(orderId);
              setOrder(updated);
              Alert.alert('Order Cancelled', 'Your order has been cancelled successfully.');
            }
          },
        },
      ]
    );
  };

  const handleDownloadInvoice = () => {
    Alert.alert(
      'Tax Invoice Downloaded',
      `Invoice #${order?.orderNumber}.pdf has been saved to your local device storage.`
    );
  };

  if (loading || !order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header showBack title="Order Details" showLocation={false} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Fetching order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header showBack title={`Order Details`} showLocation={false} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Status Header Banner */}
        <View style={styles.statusBanner}>
          <View>
            <Text style={styles.orderNumText}>{order.orderNumber}</Text>
            <Text style={styles.placedOnText}>Placed on {formattedDate}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{order.status}</Text>
          </View>
        </View>

        {/* Visual Progress Timeline */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>DELIVERY TIMELINE</Text>
          <TrackingTimeline steps={order.trackingSteps} />
        </View>

        {/* Shipping Address */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>DELIVERY ADDRESS</Text>
            <View style={styles.badgeSm}>
              <Text style={styles.badgeSmText}>{order.shippingAddress.type}</Text>
            </View>
          </View>
          <Text style={styles.personName}>{order.shippingAddress.name}</Text>
          <Text style={styles.addressLine}>
            {order.shippingAddress.houseFlat}, {order.shippingAddress.street},{' '}
            {order.shippingAddress.area}
          </Text>
          <Text style={styles.addressLine}>
            {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
            {order.shippingAddress.pincode}
          </Text>
          <Text style={styles.phoneLine}>Mobile: {order.shippingAddress.mobile}</Text>
        </View>

        {/* Items In Order */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ITEMS IN THIS ORDER ({order.items.length})</Text>
          {order.items.map((cartItem) => (
            <TouchableOpacity
              key={cartItem.id}
              style={styles.itemRow}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('ProductDetails', { productId: cartItem.productId })
              }
            >
              <Image source={{ uri: cartItem.product.images[0] }} style={styles.itemImage} contentFit="cover" transition={200} />
              <View style={styles.itemDetails}>
                <Text style={styles.brandName}>{cartItem.product.brandName}</Text>
                <Text style={styles.productName} numberOfLines={1}>
                  {cartItem.product.name}
                </Text>
                <Text style={styles.variantDetails}>
                  Size: {cartItem.selectedSize} • Color: {cartItem.selectedColor.name} • Qty:{' '}
                  {cartItem.quantity}
                </Text>
                <Text style={styles.itemPrice}>
                  {formatINR(cartItem.product.price * cartItem.quantity)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>PAYMENT INFORMATION</Text>
          <View style={styles.payModeRow}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.valBold}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.payModeRow}>
            <Text style={styles.label}>Payment Status</Text>
            <Text
              style={[
                styles.valBold,
                order.paymentStatus === 'Paid' ? { color: COLORS.emerald } : { color: COLORS.amber },
              ]}
            >
              {order.paymentStatus}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.payModeRow}>
            <Text style={styles.label}>Total MRP</Text>
            <Text style={styles.val}>{formatINR(order.summary.mrpTotal)}</Text>
          </View>
          <View style={styles.payModeRow}>
            <Text style={styles.label}>Discount on MRP</Text>
            <Text style={[styles.val, styles.greenText]}>
              -{formatINR(order.summary.discountTotal)}
            </Text>
          </View>
          {order.summary.couponDiscount > 0 && (
            <View style={styles.payModeRow}>
              <Text style={styles.label}>Coupon Savings</Text>
              <Text style={[styles.val, styles.greenText]}>
                -{formatINR(order.summary.couponDiscount)}
              </Text>
            </View>
          )}
          <View style={styles.payModeRow}>
            <Text style={styles.label}>Delivery Fee</Text>
            <Text style={styles.val}>
              {order.summary.deliveryFee === 0 ? 'FREE' : formatINR(order.summary.deliveryFee)}
            </Text>
          </View>
          <View style={styles.payModeRow}>
            <Text style={styles.label}>Platform Fee</Text>
            <Text style={styles.val}>{formatINR(order.summary.platformFee)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.payModeRow}>
            <Text style={styles.grandTotalLabel}>Total Paid</Text>
            <Text style={styles.grandTotalVal}>{formatINR(order.summary.totalAmount)}</Text>
          </View>
        </View>

        {/* Actions (Download Invoice & Cancel Order) */}
        <View style={styles.actionsBox}>
          <TouchableOpacity
            style={styles.invoiceBtn}
            onPress={handleDownloadInvoice}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={18} color={COLORS.primary} />
            <Text style={styles.invoiceBtnText}>Download Tax Invoice</Text>
          </TouchableOpacity>

          {order.canCancel && (
            <Button
              title="CANCEL ORDER"
              variant="outline"
              size="md"
              onPress={handleCancelOrder}
              textStyle={{ color: COLORS.error }}
              style={{ borderColor: COLORS.error }}
            />
          )}
        </View>

        <View style={styles.bottomBuffer} />
      </ScrollView>
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
    padding: SPACING.base,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: RADIUS.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  orderNumText: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
  },
  placedOnText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  statusPillText: {
    ...TYPOGRAPHY.micro,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  badgeSm: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  badgeSmText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
  },
  personName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  addressLine: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  phoneLine: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  itemImage: {
    width: 60,
    height: 75,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSubtle,
  },
  itemDetails: {
    flex: 1,
  },
  brandName: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  productName: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  variantDetails: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  itemPrice: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  payModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  label: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  val: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  valBold: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  greenText: {
    color: COLORS.emerald,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 8,
  },
  grandTotalLabel: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
  },
  grandTotalVal: {
    ...TYPOGRAPHY.title1,
    color: COLORS.textPrimary,
  },
  actionsBox: {
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 48,
    borderRadius: RADIUS.md,
  },
  invoiceBtnText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  bottomBuffer: {
    height: 40,
  },
});
