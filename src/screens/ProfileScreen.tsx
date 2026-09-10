import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { useUser } from '../context/UserContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useUser();
  const { orders } = useOrders();
  const { wishlist } = useWishlist();

  const [policyModal, setPolicyModal] = useState<{ title: string; content: string } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  const openAboutBrand = () => {
    setPolicyModal({
      title: 'About VAUNT',
      content:
        'VAUNT is an original contemporary fashion and lifestyle house founded on architectural tailoring, sustainable natural fibers, and uncompromising craft. Inspired by minimalism and progressive streetwear, VAUNT rejects fast-fashion disposability in favor of timeless heirloom essentials designed for everyday distinction.',
    });
  };

  const openHelpSupport = () => {
    setPolicyModal({
      title: 'Help & Customer Care',
      content:
        'Our concierge is available 7 days a week from 9 AM to 9 PM IST.\n\n• Concierge Desk: 1800-419-VAUNT (82868)\n• Email Support: care@vauntstudio.com\n• WhatsApp Updates: +91 98765 43210\n• Average Response Time: Under 15 minutes',
    });
  };

  const openPrivacyPolicy = () => {
    setPolicyModal({
      title: 'Privacy Policy',
      content:
        'At VAUNT, your personal privacy and data safety are paramount. All transaction simulations and account details are stored locally on your device storage. We never sell, track, or share your shopping preferences with third-party advertising brokers.',
    });
  };

  const openTerms = () => {
    setPolicyModal({
      title: 'Terms of Service',
      content:
        'By accessing the VAUNT mobile marketplace, you enjoy a seamless 14-day return and exchange guarantee on unworn garments with original security tags attached. Standard delivery takes 2-4 business days across major Indian metros.',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header title="My Account" showLocation={false} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <TouchableOpacity style={styles.userCard} onPress={() => navigation.navigate('EditProfile')} activeOpacity={0.8}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} contentFit="cover" transition={200} />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.nameRowRight}>
                <View style={styles.tierPill}>
                  <Ionicons name="sparkles" size={10} color="#FFFFFF" />
                  <Text style={styles.tierText}>{user.loyaltyTier}</Text>
                </View>
                <Ionicons name="create-outline" size={18} color={COLORS.accent} />
              </View>
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>

            <View style={styles.pointsBadge}>
              <Ionicons name="diamond-outline" size={12} color={COLORS.amber} />
              <Text style={styles.pointsText}>
                {user.loyaltyPoints} VAUNT Luxe Reward Points
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Shortcuts */}
        <View style={styles.shortcutsGrid}>
          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate('Orders')}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIcon, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="cube-outline" size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.shortcutTitle}>Orders</Text>
            <Text style={styles.shortcutSub}>{orders.length} placed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate('MainTabs', { screen: 'WishlistTab' } as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIcon, { backgroundColor: COLORS.roseLight }]}>
              <Ionicons name="heart-outline" size={20} color={COLORS.rose} />
            </View>
            <Text style={styles.shortcutTitle}>Wishlist</Text>
            <Text style={styles.shortcutSub}>{wishlist.length} saved</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate('Offers')}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIcon, { backgroundColor: COLORS.emeraldLight }]}>
              <Ionicons name="pricetag-outline" size={20} color={COLORS.emerald} />
            </View>
            <Text style={styles.shortcutTitle}>Coupons</Text>
            <Text style={styles.shortcutSub}>5 active</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.amber} />
            </View>
            <Text style={styles.shortcutTitle}>Alerts</Text>
            <Text style={styles.shortcutSub}>Updates</Text>
          </TouchableOpacity>
        </View>

        {/* Account Management Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuHeading}>ACCOUNT SETTINGS</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AddressManagement')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="location-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.menuLabel}>Saved Delivery Addresses</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('RecentlyViewed')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="eye-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.menuLabel}>Recently Viewed Items</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Offers')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="gift-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.menuLabel}>Coupons & Bank Offers</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Support & Brand Information */}
        <View style={styles.menuSection}>
          <Text style={styles.menuHeading}>SUPPORT & LEGAL</Text>

          <TouchableOpacity style={styles.menuItem} onPress={openHelpSupport}>
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.menuLabel}>Help & 24/7 Concierge</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={openAboutBrand}>
            <View style={styles.menuLeft}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.menuLabel}>About VAUNT Studio</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={openPrivacyPolicy}>
            <View style={styles.menuLeft}>
              <Ionicons name="shield-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.menuLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={openTerms}>
            <View style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.menuLabel}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout / Switch Session */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.rose} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.appVersion}>VAUNT Mobile v1.0.0 (Build 2026.09) • Offline First</Text>

        <View style={styles.bottomBuffer} />
      </ScrollView>

      {/* Info / Policy Modal */}
      {policyModal && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.policyDialog}>
              <Text style={styles.dialogTitle}>{policyModal.title}</Text>
              <ScrollView style={styles.dialogScroll}>
                <Text style={styles.dialogContent}>{policyModal.content}</Text>
              </ScrollView>
              <Button
                title="CLOSE"
                variant="primary"
                size="md"
                onPress={() => setPolicyModal(null)}
                style={styles.dialogCloseBtn}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Logout Confirmation Modal */}
      <Modal visible={showLogoutConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.policyDialog}>
            <Text style={styles.dialogTitle}>Logout</Text>
            <Text style={styles.dialogContent}>Are you sure you want to logout?</Text>
            <View style={styles.logoutConfirmRow}>
              <Button
                title="Cancel"
                variant="outline"
                size="md"
                onPress={() => setShowLogoutConfirm(false)}
                style={styles.logoutConfirmBtn}
              />
              <Button
                title="Logout"
                variant="primary"
                size="md"
                onPress={confirmLogout}
                style={[styles.logoutConfirmBtn, { backgroundColor: COLORS.rose }]}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 14,
    ...SHADOWS.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surfaceSubtle,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  nameRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 'auto',
  },
  userName: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  tierText: {
    ...TYPOGRAPHY.micro,
    color: '#FFFFFF',
    fontSize: 9,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  userPhone: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: '#FEF3C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  pointsText: {
    ...TYPOGRAPHY.micro,
    color: '#78350F',
    fontWeight: '800',
  },
  shortcutsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.md,
  },
  shortcutItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  shortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  shortcutTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
  },
  shortcutSub: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 1,
  },
  menuSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  menuHeading: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.roseLight,
    marginBottom: 16,
  },
  logoutText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.rose,
  },
  appVersion: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSubtle,
    textAlign: 'center',
    fontSize: 11,
  },
  bottomBuffer: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  policyDialog: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    maxHeight: '80%',
  },
  dialogTitle: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  dialogScroll: {
    marginBottom: 16,
  },
  dialogContent: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  dialogCloseBtn: {
    width: '100%',
  },
  logoutConfirmRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  logoutConfirmBtn: {
    flex: 1,
  },
});
