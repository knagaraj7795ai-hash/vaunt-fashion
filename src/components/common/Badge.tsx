import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'outline' | 'neutral' | 'discount';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
      case 'discount':
        return { bg: COLORS.emeraldLight, text: COLORS.emerald, border: 'transparent' };
      case 'warning':
        return { bg: COLORS.amberLight, text: COLORS.amber, border: 'transparent' };
      case 'error':
        return { bg: COLORS.roseLight, text: COLORS.rose, border: 'transparent' };
      case 'outline':
        return { bg: 'transparent', text: COLORS.textPrimary, border: COLORS.borderDark };
      case 'neutral':
        return { bg: COLORS.surfaceSubtle, text: COLORS.textSecondary, border: 'transparent' };
      case 'primary':
      default:
        return { bg: COLORS.primary, text: COLORS.textInverse, border: 'transparent' };
    }
  };

  const c = getColors();

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
        { backgroundColor: c.bg, borderColor: c.border, borderWidth: c.border !== 'transparent' ? 1 : 0 },
        style,
      ]}
    >
      <Text
        style={[
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: c.text },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: RADIUS.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  textSm: {
    ...TYPOGRAPHY.micro,
    fontSize: 10,
    fontWeight: '700',
  },
  textMd: {
    ...TYPOGRAPHY.captionBold,
    fontSize: 11,
  },
});
