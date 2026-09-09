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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Coupon } from '../types/cart';
import { couponService } from '../services/couponService';
import { Header } from '../components/common/Header';
import { formatINR } from '../components/common/PriceDisplay';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export const OffersScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    couponService.getAvailableCoupons().then(setCoupons);
  }, []);

  const handleCopyCode = (code: string) => {
    Alert.alert('Code Copied!', `Coupon code "${code}" is ready to paste in your cart.`);
  };

  const handleShopWithCode = () => {
    navigation.navigate('MainTabs', { screen: 'HomeTab' } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header showBack title="Offers & Coupons" showLocation={false} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Bank Partner Banner */}
        <View style={styles.bankBanner}>
          <View style={styles.bankHeader}>
            <Ionicons name="card" size={20} color={COLORS.amber} />
            <Text style={styles.bankTitle}>PARTNER BANK PERKS</Text>
          </View>
          <Text style={styles.bankText}>
            • 10% Instant Discount up to ₹1,500 on HDFC & ICICI Credit Cards
          </Text>
          <Text style={styles.bankText}>
            • Flat ₹500 Cashback on UPI payments above ₹3,000 via Google Pay
          </Text>
          <Text style={styles.bankText}>
            • No-Cost EMI available on orders above ₹4,999
          </Text>
        </View>

        <Text style={styles.heading}>PROMO CODES</Text>

        {/* Coupons List */}
        <View style={styles.couponsList}>
          {coupons.map((c) => (
            <View key={c.code} style={styles.couponCard}>
              <View style={styles.topRow}>
                <View style={styles.codeTag}>
                  <Text style={styles.codeText}>{c.code}</Text>
                </View>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => handleCopyCode(c.code)}
                >
                  <Ionicons name="copy-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.copyText}>COPY CODE</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.couponTitle}>{c.title}</Text>
              <Text style={styles.couponDesc}>{c.description}</Text>

              <View style={styles.termsBox}>
                <Text style={styles.termsText}>
                  • Minimum spend: {formatINR(c.minimumOrder)}
                </Text>
                {c.maximumDiscount && (
                  <Text style={styles.termsText}>
                    • Max discount: {formatINR(c.maximumDiscount)}
                  </Text>
                )}
                <Text style={styles.termsText}>• Valid until: {c.expiryDate}</Text>
              </View>

              <TouchableOpacity
                style={styles.shopNowBtn}
                onPress={handleShopWithCode}
                activeOpacity={0.8}
              >
                <Text style={styles.shopNowText}>USE IN STORE</Text>
                <Ionicons name="arrow-forward" size={14} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
          ))}
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
  bankBanner: {
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  bankTitle: {
    ...TYPOGRAPHY.micro,
    color: '#78350F',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bankText: {
    ...TYPOGRAPHY.caption,
    color: '#78350F',
    lineHeight: 18,
    marginBottom: 2,
  },
  heading: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginVertical: 10,
  },
  couponsList: {
    gap: 12,
  },
  couponCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeTag: {
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  codeText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.primary,
    fontWeight: '700',
  },
  couponTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  couponDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  termsBox: {
    backgroundColor: COLORS.canvas,
    padding: 8,
    borderRadius: RADIUS.sm,
    marginBottom: 10,
  },
  termsText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    fontSize: 10,
  },
  shopNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  shopNowText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.accent,
    fontWeight: '800',
  },
  bottomBuffer: {
    height: 40,
  },
});
