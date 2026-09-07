import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Coupon } from '../../types/cart';
import { COLORS, RADIUS, TYPOGRAPHY, SPACING } from '../../constants/theme';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { formatINR } from '../common/PriceDisplay';

interface CouponSelectorModalProps {
  visible: boolean;
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  onClose: () => void;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
}

export const CouponSelectorModal: React.FC<CouponSelectorModalProps> = ({
  visible,
  coupons,
  appliedCoupon,
  onClose,
  onApplyCoupon,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ isError: boolean; message: string } | null>(null);

  const handleApply = async (code: string) => {
    setLoading(true);
    setFeedback(null);
    const res = await onApplyCoupon(code);
    setLoading(false);

    if (res.success) {
      setFeedback({ isError: false, message: res.message });
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      setFeedback({ isError: true, message: res.message });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Apply Coupon</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Manual input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Input
                placeholder="ENTER COUPON CODE"
                autoCapitalize="characters"
                value={manualCode}
                onChangeText={(t) => {
                  setManualCode(t);
                  setFeedback(null);
                }}
                containerStyle={styles.inputStyle}
              />
              <Button
                title="APPLY"
                variant="primary"
                size="sm"
                onPress={() => handleApply(manualCode)}
                disabled={!manualCode.trim() || loading}
                loading={loading}
                style={styles.applyBtn}
              />
            </View>
          </View>

          {feedback && (
            <View
              style={[
                styles.feedbackBox,
                feedback.isError ? styles.feedbackError : styles.feedbackSuccess,
              ]}
            >
              <Ionicons
                name={feedback.isError ? 'alert-circle' : 'checkmark-circle'}
                size={16}
                color={feedback.isError ? COLORS.error : COLORS.emerald}
              />
              <Text
                style={[
                  styles.feedbackText,
                  feedback.isError ? styles.feedbackTextError : styles.feedbackTextSuccess,
                ]}
              >
                {feedback.message}
              </Text>
            </View>
          )}

          <Text style={styles.sectionHeading}>AVAILABLE OFFERS</Text>

          <ScrollView style={styles.couponList} showsVerticalScrollIndicator={false}>
            {coupons.map((c) => {
              const isApplied = appliedCoupon?.code === c.code;

              return (
                <View key={c.code} style={[styles.couponCard, isApplied && styles.appliedCard]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.codeTag}>
                      <Text style={styles.codeText}>{c.code}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleApply(c.code)}
                      disabled={isApplied || loading}
                    >
                      <Text style={[styles.cardApplyText, isApplied && styles.appliedText]}>
                        {isApplied ? 'APPLIED' : 'APPLY'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.couponTitle}>{c.title}</Text>
                  <Text style={styles.couponDesc}>{c.description}</Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.termsText}>
                      Min order: {formatINR(c.minimumOrder)} • Expires {c.expiryDate}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  inputStyle: {
    flex: 1,
    marginBottom: 0,
  },
  applyBtn: {
    height: 48,
    paddingHorizontal: 16,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: RADIUS.sm,
    marginBottom: 14,
  },
  feedbackError: {
    backgroundColor: COLORS.roseLight,
  },
  feedbackSuccess: {
    backgroundColor: COLORS.emeraldLight,
  },
  feedbackText: {
    ...TYPOGRAPHY.caption,
    flex: 1,
    fontWeight: '600',
  },
  feedbackTextError: {
    color: COLORS.error,
  },
  feedbackTextSuccess: {
    color: COLORS.emerald,
  },
  sectionHeading: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  couponList: {
    maxHeight: 380,
  },
  couponCard: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 12,
    backgroundColor: COLORS.surfaceSubtle,
  },
  appliedCard: {
    borderColor: COLORS.emerald,
    backgroundColor: COLORS.emeraldLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  codeTag: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  codeText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  cardApplyText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.accent,
  },
  appliedText: {
    color: COLORS.emerald,
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
  },
  cardFooter: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  termsText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
});
