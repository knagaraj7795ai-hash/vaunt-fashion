import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { COLORS, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getContainerStyles = () => {
    const s: ViewStyle[] = [styles.baseButton];

    // Size
    if (size === 'sm') s.push(styles.btnSm);
    else if (size === 'lg') s.push(styles.btnLg);
    else s.push(styles.btnMd);

    // Variant
    switch (variant) {
      case 'accent':
        s.push({ backgroundColor: COLORS.accent });
        break;
      case 'secondary':
        s.push({ backgroundColor: COLORS.surfaceSubtle });
        break;
      case 'outline':
        s.push({
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: COLORS.primary,
        });
        break;
      case 'ghost':
        s.push({ backgroundColor: 'transparent' });
        break;
      case 'danger':
        s.push({ backgroundColor: COLORS.error });
        break;
      case 'primary':
      default:
        s.push({ backgroundColor: COLORS.primary });
        break;
    }

    if (fullWidth) s.push(styles.fullWidth);
    if (disabled) s.push(styles.disabled);

    return s;
  };

  const getTextStyles = () => {
    const t: TextStyle[] = [styles.baseText];

    if (size === 'sm') t.push(styles.textSm);
    else if (size === 'lg') t.push(styles.textLg);
    else t.push(styles.textMd);

    switch (variant) {
      case 'secondary':
        t.push({ color: COLORS.textPrimary });
        break;
      case 'outline':
        t.push({ color: COLORS.primary });
        break;
      case 'ghost':
        t.push({ color: COLORS.primary });
        break;
      case 'accent':
      case 'danger':
      case 'primary':
      default:
        t.push({ color: COLORS.textInverse });
        break;
    }

    return t;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[...getContainerStyles(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.textInverse}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[...getTextStyles(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnSm: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  btnMd: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  btnLg: {
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: 12,
  },
  textMd: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 16,
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
});
