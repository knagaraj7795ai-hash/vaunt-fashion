import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types/navigation';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import { useAddress } from '../../context/AddressContext';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  showSearch?: boolean;
  showCart?: boolean;
  showNotification?: boolean;
  showLocation?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  title,
  showSearch = true,
  showCart = true,
  showNotification = true,
  showLocation = true,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { summary } = useCart();
  const { unreadCount } = useNotifications();
  const { selectedAddress } = useAddress();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        ) : null}

        {title ? (
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View style={styles.brandContainer}>
            <Text style={styles.brandLogo}>VAUNT</Text>
            {showLocation && (
              <TouchableOpacity
                style={styles.locationPill}
                onPress={() => navigation.navigate('AddressManagement', { selectMode: true })}
                activeOpacity={0.7}
              >
                <Ionicons name="location-sharp" size={11} color={COLORS.accent} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {selectedAddress
                    ? `${selectedAddress.city} ${selectedAddress.pincode}`
                    : 'Bangalore 560102'}
                </Text>
                <Ionicons name="chevron-down" size={10} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.rightIcons}>
        {showSearch && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'SearchTab' } as any)}
          >
            <Ionicons name="search-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}

        {showNotification && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
            {unreadCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {showCart && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="bag-handle-outline" size={22} color={COLORS.textPrimary} />
            {summary.itemCount > 0 && (
              <View style={[styles.badgeContainer, { backgroundColor: COLORS.accent }]}>
                <Text style={styles.badgeText}>
                  {summary.itemCount > 9 ? '9+' : summary.itemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingBottom: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  titleText: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  brandContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandLogo: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: COLORS.primary,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  locationText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    maxWidth: 120,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  iconBtn: {
    position: 'relative',
    padding: 6,
  },
  badgeContainer: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.rose,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
