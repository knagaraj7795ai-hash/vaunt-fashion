import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { PaymentMethod } from '../types/order';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { useOrders } from '../context/OrderContext';
import { Header } from '../components/common/Header';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { formatINR } from '../components/common/PriceDisplay';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

type CheckoutStep = 'address' | 'delivery' | 'payment' | 'review';

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, summary, clearCart } = useCart();
  const { addresses, selectedAddress, selectAddress } = useAddress();
  const { placeOrder } = useOrders();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [deliverySpeed, setDeliverySpeed] = useState<'Standard' | 'Express'>('Standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('aryan@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('412');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Address validation
  const effectiveAddress = selectedAddress || addresses[0];

  const handleNextStep = () => {
    if (currentStep === 'address') {
      if (!effectiveAddress) {
        Alert.alert('Address Required', 'Please select or add a shipping address.');
        return;
      }
      setCurrentStep('delivery');
    } else if (currentStep === 'delivery') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('review');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'review') setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('delivery');
    else if (currentStep === 'delivery') setCurrentStep('address');
    else navigation.goBack();
  };

  const handleFinalPlaceOrder = async () => {
    if (!effectiveAddress) return;

    setIsPlacingOrder(true);

    // Calculate delivery adjustment
    const deliveryCost = deliverySpeed === 'Express' ? 99 : summary.deliveryFee;
    const finalTotal = summary.totalPayable + (deliverySpeed === 'Express' ? 99 : 0);

    setTimeout(async () => {
      try {
        const createdOrder = await placeOrder({
          items,
          shippingAddress: effectiveAddress,
          paymentMethod,
          deliverySpeed,
          summary: {
            ...summary,
            deliveryFee: deliveryCost,
            totalAmount: finalTotal,
          },
        });

        clearCart();
        setIsPlacingOrder(false);
        navigation.replace('OrderConfirmation', { orderId: createdOrder.id });
      } catch (e) {
        setIsPlacingOrder(false);
        Alert.alert('Error', 'Failed to place simulated order. Please try again.');
      }
    }, 1200);
  };

  const renderStepsIndicator = () => {
    const steps: { id: CheckoutStep; label: string; number: number }[] = [
      { id: 'address', label: 'Address', number: 1 },
      { id: 'delivery', label: 'Delivery', number: 2 },
      { id: 'payment', label: 'Payment', number: 3 },
      { id: 'review', label: 'Review', number: 4 },
    ];

    const currentIdx = steps.findIndex((s) => s.id === currentStep);

    return (
      <View style={styles.stepperHeader}>
        {steps.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <React.Fragment key={step.id}>
              <View style={styles.stepIndicatorItem}>
                <View
                  style={[
                    styles.stepCircle,
                    isDone && styles.stepCircleDone,
                    isCurrent && styles.stepCircleCurrent,
                  ]}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumberText,
                        isCurrent && styles.stepNumberCurrent,
                      ]}
                    >
                      {step.number}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabelText,
                    isCurrent && styles.stepLabelCurrent,
                    isDone && styles.stepLabelDone,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
              {idx < steps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    idx < currentIdx && styles.stepLineDone,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header
        showBack
        title="Checkout"
        showCart={false}
        showSearch={false}
        showLocation={false}
      />

      {renderStepsIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* STEP 1: ADDRESS */}
        {currentStep === 'address' && (
          <View style={styles.stepSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.stepTitle}>Select Delivery Address</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddressManagement')}
              >
                <Text style={styles.addNewLink}>+ Add New</Text>
              </TouchableOpacity>
            </View>

            {addresses.map((addr) => {
              const isSelected = effectiveAddress?.id === addr.id;

              return (
                <TouchableOpacity
                  key={addr.id}
                  style={[styles.addressOptionCard, isSelected && styles.selectedAddressCard]}
                  onPress={() => selectAddress(addr)}
                  activeOpacity={0.8}
                >
                  <View style={styles.radioCol}>
                    <View style={[styles.radio, isSelected && styles.radioActive]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </View>
                  <View style={styles.addressInfo}>
                    <View style={styles.addressNameRow}>
                      <Text style={styles.addrName}>{addr.name}</Text>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>{addr.type}</Text>
                      </View>
                      {addr.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.addrStreet}>
                      {addr.houseFlat}, {addr.street}, {addr.area}
                    </Text>
                    <Text style={styles.addrCity}>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </Text>
                    <Text style={styles.addrPhone}>Phone: {addr.mobile}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* STEP 2: DELIVERY SPEED */}
        {currentStep === 'delivery' && (
          <View style={styles.stepSection}>
            <Text style={styles.stepTitle}>Choose Delivery Speed</Text>

            <TouchableOpacity
              style={[
                styles.deliveryOptionCard,
                deliverySpeed === 'Standard' && styles.selectedDeliveryCard,
              ]}
              onPress={() => setDeliverySpeed('Standard')}
              activeOpacity={0.8}
            >
              <View style={[styles.radio, deliverySpeed === 'Standard' && styles.radioActive]}>
                {deliverySpeed === 'Standard' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.deliveryDetails}>
                <View style={styles.deliveryTitleRow}>
                  <Text style={styles.deliveryName}>Standard Delivery</Text>
                  <Text style={styles.deliveryFeeText}>
                    {summary.deliveryFee === 0 ? 'FREE' : formatINR(summary.deliveryFee)}
                  </Text>
                </View>
                <Text style={styles.deliveryEstimate}>Estimated arrival: 3-4 Business Days</Text>
                <Text style={styles.deliveryDesc}>Eco-friendly consolidated dispatch</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deliveryOptionCard,
                deliverySpeed === 'Express' && styles.selectedDeliveryCard,
              ]}
              onPress={() => setDeliverySpeed('Express')}
              activeOpacity={0.8}
            >
              <View style={[styles.radio, deliverySpeed === 'Express' && styles.radioActive]}>
                {deliverySpeed === 'Express' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.deliveryDetails}>
                <View style={styles.deliveryTitleRow}>
                  <View style={styles.expressTitleRow}>
                    <Text style={styles.deliveryName}>Express Priority Delivery</Text>
                    <View style={styles.flashBadge}>
                      <Ionicons name="flash" size={10} color="#FFFFFF" />
                      <Text style={styles.flashBadgeText}>FAST</Text>
                    </View>
                  </View>
                  <Text style={styles.deliveryFeeText}>₹99</Text>
                </View>
                <Text style={styles.deliveryEstimate}>Estimated arrival: Tomorrow by 7 PM</Text>
                <Text style={styles.deliveryDesc}>Guaranteed priority warehouse packing and courier air-lift</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: PAYMENT METHOD SIMULATION */}
        {currentStep === 'payment' && (
          <View style={styles.stepSection}>
            <Text style={styles.stepTitle}>Select Payment Method</Text>
            <Text style={styles.simulatedNote}>
              🔒 Secure simulated sandbox payment. No actual funds will be charged.
            </Text>

            {/* UPI Option */}
            <TouchableOpacity
              style={[styles.paymentCard, paymentMethod === 'UPI' && styles.selectedPaymentCard]}
              onPress={() => setPaymentMethod('UPI')}
              activeOpacity={0.8}
            >
              <View style={styles.payHeader}>
                <View style={[styles.radio, paymentMethod === 'UPI' && styles.radioActive]}>
                  {paymentMethod === 'UPI' && <View style={styles.radioDot} />}
                </View>
                <Ionicons name="phone-portrait-outline" size={20} color={COLORS.primary} />
                <Text style={styles.payTitle}>UPI (Instant & Zero Fee)</Text>
              </View>
              {paymentMethod === 'UPI' && (
                <View style={styles.payExpandedArea}>
                  <Input
                    label="VPA / UPI ID"
                    value={upiId}
                    onChangeText={setUpiId}
                    placeholder="username@bank"
                    helperText="Supports Google Pay, PhonePe, Paytm & BHIM"
                  />
                </View>
              )}
            </TouchableOpacity>

            {/* Credit / Debit Card Option */}
            <TouchableOpacity
              style={[
                styles.paymentCard,
                paymentMethod === 'Credit/Debit Card' && styles.selectedPaymentCard,
              ]}
              onPress={() => setPaymentMethod('Credit/Debit Card')}
              activeOpacity={0.8}
            >
              <View style={styles.payHeader}>
                <View
                  style={[
                    styles.radio,
                    paymentMethod === 'Credit/Debit Card' && styles.radioActive,
                  ]}
                >
                  {paymentMethod === 'Credit/Debit Card' && <View style={styles.radioDot} />}
                </View>
                <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                <Text style={styles.payTitle}>Credit / Debit Card</Text>
              </View>
              {paymentMethod === 'Credit/Debit Card' && (
                <View style={styles.payExpandedArea}>
                  <Input
                    label="Card Number"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                  />
                  <View style={styles.cardTwoCol}>
                    <Input
                      label="Expiry (MM/YY)"
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      containerStyle={{ flex: 1 }}
                    />
                    <Input
                      label="CVV"
                      value={cardCvv}
                      onChangeText={setCardCvv}
                      secureTextEntry
                      keyboardType="numeric"
                      containerStyle={{ flex: 1 }}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Cash on Delivery */}
            <TouchableOpacity
              style={[
                styles.paymentCard,
                paymentMethod === 'Cash on Delivery' && styles.selectedPaymentCard,
              ]}
              onPress={() => setPaymentMethod('Cash on Delivery')}
              activeOpacity={0.8}
            >
              <View style={styles.payHeader}>
                <View
                  style={[
                    styles.radio,
                    paymentMethod === 'Cash on Delivery' && styles.radioActive,
                  ]}
                >
                  {paymentMethod === 'Cash on Delivery' && <View style={styles.radioDot} />}
                </View>
                <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
                <Text style={styles.payTitle}>Cash on Delivery</Text>
              </View>
              {paymentMethod === 'Cash on Delivery' && (
                <View style={styles.payExpandedArea}>
                  <Text style={styles.codNotice}>
                    Pay digitally or in cash upon receiving your package at your doorstep.
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Wallets */}
            <TouchableOpacity
              style={[styles.paymentCard, paymentMethod === 'Wallet' && styles.selectedPaymentCard]}
              onPress={() => setPaymentMethod('Wallet')}
              activeOpacity={0.8}
            >
              <View style={styles.payHeader}>
                <View style={[styles.radio, paymentMethod === 'Wallet' && styles.radioActive]}>
                  {paymentMethod === 'Wallet' && <View style={styles.radioDot} />}
                </View>
                <Ionicons name="wallet-outline" size={20} color={COLORS.primary} />
                <Text style={styles.payTitle}>Mobile Wallets (Paytm / Amazon Pay)</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 4: ORDER REVIEW */}
        {currentStep === 'review' && (
          <View style={styles.stepSection}>
            <Text style={styles.stepTitle}>Review & Confirm Order</Text>

            {/* Address snapshot */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewCardHeader}>
                <Text style={styles.reviewCardTitle}>SHIPPING ADDRESS</Text>
                <TouchableOpacity onPress={() => setCurrentStep('address')}>
                  <Text style={styles.editLink}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.reviewPersonName}>{effectiveAddress?.name}</Text>
              <Text style={styles.reviewAddressText}>
                {effectiveAddress?.houseFlat}, {effectiveAddress?.street}, {effectiveAddress?.area},{' '}
                {effectiveAddress?.city}, {effectiveAddress?.state} - {effectiveAddress?.pincode}
              </Text>
              <Text style={styles.reviewPhoneText}>Mobile: {effectiveAddress?.mobile}</Text>
            </View>

            {/* Delivery mode */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewCardHeader}>
                <Text style={styles.reviewCardTitle}>DELIVERY MODE</Text>
                <TouchableOpacity onPress={() => setCurrentStep('delivery')}>
                  <Text style={styles.editLink}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.reviewPersonName}>
                {deliverySpeed === 'Express' ? 'Express Priority (1-2 Days)' : 'Standard Delivery (3-4 Days)'}
              </Text>
            </View>

            {/* Payment Method */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewCardHeader}>
                <Text style={styles.reviewCardTitle}>PAYMENT METHOD</Text>
                <TouchableOpacity onPress={() => setCurrentStep('payment')}>
                  <Text style={styles.editLink}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.reviewPersonName}>{paymentMethod}</Text>
              {paymentMethod === 'UPI' && (
                <Text style={styles.reviewPhoneText}>VPA: {upiId}</Text>
              )}
            </View>

            {/* Items Summary */}
            <View style={styles.reviewCard}>
              <Text style={styles.reviewCardTitle}>ORDER ITEMS ({items.length})</Text>
              {items.map((cartItem) => (
                <View key={cartItem.id} style={styles.reviewItemRow}>
                  <View style={styles.itemTitleCol}>
                    <Text style={styles.revItemBrand}>{cartItem.product.brandName}</Text>
                    <Text style={styles.revItemName} numberOfLines={1}>
                      {cartItem.product.name}
                    </Text>
                    <Text style={styles.revItemVariant}>
                      Size: {cartItem.selectedSize} • Qty: {cartItem.quantity}
                    </Text>
                  </View>
                  <Text style={styles.revItemPrice}>
                    {formatINR(cartItem.product.price * cartItem.quantity)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Total summary */}
            <View style={styles.reviewCard}>
              <Text style={styles.reviewCardTitle}>PAYMENT SUMMARY</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total MRP</Text>
                <Text style={styles.summaryVal}>{formatINR(summary.mrpTotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount on MRP</Text>
                <Text style={[styles.summaryVal, styles.greenText]}>
                  -{formatINR(summary.discountTotal)}
                </Text>
              </View>
              {summary.couponDiscount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Coupon Savings</Text>
                  <Text style={[styles.summaryVal, styles.greenText]}>
                    -{formatINR(summary.couponDiscount)}
                  </Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryVal}>
                  {deliverySpeed === 'Express'
                    ? '₹99'
                    : summary.deliveryFee === 0
                    ? 'FREE'
                    : formatINR(summary.deliveryFee)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Platform Fee</Text>
                <Text style={styles.summaryVal}>{formatINR(summary.platformFee)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.finalTotalLabel}>Grand Total</Text>
                <Text style={styles.finalTotalVal}>
                  {formatINR(
                    summary.totalPayable + (deliverySpeed === 'Express' ? 99 : 0)
                  )}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomBuffer} />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.backStepBtn}
          onPress={handlePreviousStep}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>

        {currentStep !== 'review' ? (
          <Button
            title="CONTINUE"
            variant="primary"
            size="md"
            onPress={handleNextStep}
            style={styles.continueBtn}
          />
        ) : (
          <Button
            title="PLACE ORDER"
            variant="accent"
            size="md"
            loading={isPlacingOrder}
            onPress={handleFinalPlaceOrder}
            style={styles.continueBtn}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  stepperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  stepIndicatorItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: COLORS.emerald,
    borderColor: COLORS.emerald,
  },
  stepCircleCurrent: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  stepNumberText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  stepNumberCurrent: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  stepLabelText: {
    ...TYPOGRAPHY.micro,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  stepLabelCurrent: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  stepLabelDone: {
    color: COLORS.emerald,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
    marginBottom: 14,
  },
  stepLineDone: {
    backgroundColor: COLORS.emerald,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    padding: SPACING.base,
  },
  stepSection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepTitle: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  addNewLink: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.accent,
  },
  addressOptionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  selectedAddressCard: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  radioCol: {
    marginRight: 12,
    paddingTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  addressInfo: {
    flex: 1,
  },
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  addrName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  typeBadge: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  typeBadgeText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
  },
  defaultBadge: {
    backgroundColor: COLORS.amberLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  defaultBadgeText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.amber,
    fontWeight: '800',
  },
  addrStreet: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  addrCity: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  addrPhone: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  deliveryOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  selectedDeliveryCard: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  deliveryDetails: {
    flex: 1,
  },
  deliveryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliveryName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  flashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    gap: 2,
  },
  flashBadgeText: {
    ...TYPOGRAPHY.micro,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  deliveryFeeText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.emerald,
  },
  deliveryEstimate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  deliveryDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  simulatedNote: {
    ...TYPOGRAPHY.caption,
    color: COLORS.emerald,
    backgroundColor: COLORS.emeraldLight,
    padding: 10,
    borderRadius: RADIUS.sm,
    marginBottom: 14,
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  selectedPaymentCard: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  payHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  payTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  payExpandedArea: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  cardTwoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  codNotice: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewCardTitle: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  editLink: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.accent,
  },
  reviewPersonName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  reviewAddressText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  reviewPhoneText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  reviewItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  itemTitleCol: {
    flex: 1,
    marginRight: 10,
  },
  revItemBrand: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  revItemName: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  revItemVariant: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 11,
  },
  revItemPrice: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryVal: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  greenText: {
    color: COLORS.emerald,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  finalTotalLabel: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
  },
  finalTotalVal: {
    ...TYPOGRAPHY.title1,
    color: COLORS.textPrimary,
  },
  bottomBuffer: {
    height: 80,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.base,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  backStepBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtn: {
    flex: 1,
    height: 48,
  },
});
