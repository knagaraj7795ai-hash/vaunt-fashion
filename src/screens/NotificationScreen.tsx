import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { AppNotification, NotificationCategory } from '../types/notification';
import { useNotifications } from '../context/NotificationContext';
import { Header } from '../components/common/Header';
import { EmptyState } from '../components/common/EmptyState';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';

export const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearAll,
    refreshNotifications,
  } = useNotifications();

  const [category, setCategory] = useState<NotificationCategory>('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshNotifications();
    setRefreshing(false);
  };

  const filtered = notifications.filter((n) => {
    if (category === 'All') return true;
    return n.category === category;
  });

  const handleNotificationPress = async (n: AppNotification) => {
    await markAsRead(n.id);
    if (n.actionRoute) {
      if (n.actionRoute === 'OrderTracking' && n.actionParams?.orderId) {
        navigation.navigate('OrderTracking', { orderId: n.actionParams.orderId });
      } else if (n.actionRoute === 'Offers') {
        navigation.navigate('Offers');
      } else if (n.actionRoute === 'ProductListing') {
        navigation.navigate('ProductListing', n.actionParams as any);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header showBack title="Notifications" showNotification={false} showLocation={false} />

      {/* Categories Bar */}
      <View style={styles.catBar}>
        {(['All', 'Orders', 'Offers', 'Drops'] as NotificationCategory[]).map((cat) => {
          const isActive = category === cat;

          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, isActive && styles.catPillActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catPillText, isActive && styles.catPillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}

        {notifications.length > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {filtered.length > 0 ? (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        >
          {filtered.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.notifCard, !n.read && styles.unreadCard]}
              onPress={() => handleNotificationPress(n)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.iconBox,
                  n.category === 'Orders'
                    ? { backgroundColor: '#DBEAFE' }
                    : n.category === 'Offers'
                    ? { backgroundColor: COLORS.emeraldLight }
                    : { backgroundColor: '#FEF3C7' },
                ]}
              >
                <Ionicons
                  name={(n.icon as any) || 'notifications-outline'}
                  size={20}
                  color={
                    n.category === 'Orders'
                      ? COLORS.accent
                      : n.category === 'Offers'
                      ? COLORS.emerald
                      : COLORS.amber
                  }
                />
              </View>

              <View style={styles.details}>
                <View style={styles.topRow}>
                  <Text style={[styles.title, !n.read && styles.unreadTitle]}>{n.title}</Text>
                  {!n.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.message}>{n.message}</Text>
                <Text style={styles.timestamp}>{n.timestamp}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.clearAllBtn} onPress={clearAll}>
            <Text style={styles.clearAllText}>Clear all notifications</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="notifications-off-outline"
            title="All caught up!"
            message="You don't have any notifications in this section right now."
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  catBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
  },
  catPillActive: {
    backgroundColor: COLORS.primary,
  },
  catPillText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  catPillTextActive: {
    color: '#FFFFFF',
  },
  markAllBtn: {
    marginLeft: 'auto',
  },
  markAllText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.accent,
    fontSize: 11,
  },
  list: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 40,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  unreadCard: {
    borderColor: COLORS.accent,
    backgroundColor: '#FFFFFF',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  unreadTitle: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  message: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  timestamp: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
  },
  clearAllBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  clearAllText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.rose,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    justifyContent: 'center',
    padding: SPACING.base,
  },
});
