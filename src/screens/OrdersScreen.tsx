import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useOrders } from '../context/OrderContext';
import { Header } from '../components/common/Header';
import { OrderCard } from '../components/order/OrderCard';
import { EmptyState } from '../components/common/EmptyState';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';

type FilterTab = 'All' | 'Active' | 'Delivered' | 'Cancelled';

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orders, refreshOrders } = useOrders();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshOrders();
    setRefreshing(false);
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') {
      return o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Returned';
    }
    if (activeTab === 'Delivered') return o.status === 'Delivered';
    if (activeTab === 'Cancelled') return o.status === 'Cancelled' || o.status === 'Returned';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header showBack title="My Orders" showLocation={false} />

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {(['All', 'Active', 'Delivered', 'Cancelled'] as FilterTab[]).map((tab) => {
          const isActive = activeTab === tab;

          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, isActive && styles.activeTabBtn]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabBtnText, isActive && styles.activeTabBtnText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filteredOrders.length > 0 ? (
        <ScrollView
          style={styles.ordersList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        >
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="cube-outline"
            title={`No ${activeTab !== 'All' ? activeTab.toLowerCase() : ''} orders`}
            message="You have not placed any orders matching this category."
            buttonTitle="EXPLORE FASHION"
            onButtonPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' } as any)}
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
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
  },
  activeTabBtn: {
    backgroundColor: COLORS.primary,
  },
  tabBtnText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  activeTabBtnText: {
    color: '#FFFFFF',
  },
  ordersList: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    justifyContent: 'center',
    padding: SPACING.base,
  },
});
