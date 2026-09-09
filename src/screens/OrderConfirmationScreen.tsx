import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Order } from '../types/order';
import { useOrders } from '../context/OrderContext';
import { Button } from '../components/common/Button';
import { formatINR } from '../components/common/PriceDisplay';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

type RouteProps = RouteProp<RootStackParamList, 'OrderConfirmation'>;

export const OrderConfirmationScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orderId } = route.params;
  const { getOrderById } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    getOrderById(orderId).then(setOrder);
  }, [orderId, getOrderById]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      <View style={styles.container}>
        {/* Celebration Circle */}
        <View style={styles.glowRing}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-sharp" size={48} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.congratsTitle}>Order Placed Successfully!</Text>
        <Text style={styles.congratsSub}>
          Thank you for choosing VAUNT. Your bespoke style package is being prepared with care.
        </Text>

        {/* Order Details Card */}
        {order && (
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Order Number</Text>
              <Text style={styles.valBold}>{order.orderNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Total Amount Paid</Text>
              <Text style={styles.valBold}>{formatINR(order.summary.totalAmount)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.val}>{order.paymentMethod}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Estimated Delivery</Text>
              <Text style={[styles.valBold, { color: COLORS.emerald }]}>
                {order.estimatedDelivery}
              </Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.addressLine} numberOfLines={2}>
              Delivering to: {order.shippingAddress.name} ({order.shippingAddress.city},{' '}
              {order.shippingAddress.pincode})
            </Text>
          </View>
        )}

        <View style={styles.notificationNotice}>
          <Ionicons name="notifications-outline" size={18} color={COLORS.accent} />
          <Text style={styles.notificationText}>
            You will receive SMS & WhatsApp tracking updates as your shipment progresses.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="TRACK ORDER PROGRESS"
            variant="primary"
            size="lg"
            onPress={() => navigation.replace('OrderTracking', { orderId })}
            style={styles.actionBtn}
          />
          <Button
            title="CONTINUE SHOPPING"
            variant="outline"
            size="md"
            onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' } as any)}
            style={styles.actionBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  glowRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: COLORS.emeraldLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.emerald,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  congratsTitle: {
    ...TYPOGRAPHY.title1,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  congratsSub: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
    marginBottom: 24,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  val: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  valBold: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 8,
  },
  addressLine: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  notificationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: 24,
  },
  notificationText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.accent,
    flex: 1,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  actionBtn: {
    width: '100%',
  },
});
