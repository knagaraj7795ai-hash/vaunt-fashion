import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { Header } from '../components/common/Header';
import { ProductGrid } from '../components/product/ProductGrid';
import { EmptyState } from '../components/common/EmptyState';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

export const RecentlyViewedScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header showBack title="Recently Viewed" showLocation={false} />

      {recentlyViewed.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.topBar}>
            <Text style={styles.countText}>{recentlyViewed.length} items browsed</Text>
            <TouchableOpacity onPress={clearRecentlyViewed}>
              <Text style={styles.clearText}>Clear History</Text>
            </TouchableOpacity>
          </View>

          <ProductGrid products={recentlyViewed} />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="eye-off-outline"
            title="No Recently Viewed Items"
            message="Styles you explore while browsing will appear here for quick access."
            buttonTitle="BROWSE COLLECTION"
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
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  countText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textSecondary,
  },
  clearText: {
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
