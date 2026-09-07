import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, RADIUS, TYPOGRAPHY, SPACING, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ToastProps {
  message: string;
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onDismiss,
  actionLabel,
  onAction,
  duration = 3200,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <View style={styles.container}>
      <View style={styles.toastCard}>
        <Ionicons name="checkmark-circle" size={20} color={COLORS.emerald} />
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        {actionLabel && onAction && (
          <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: SPACING.base,
    right: SPACING.base,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastCard: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    gap: 10,
    width: '100%',
    ...SHADOWS.lg,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: '#FFFFFF',
    flex: 1,
    fontSize: 13,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: RADIUS.xs,
  },
  actionText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.amber,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
