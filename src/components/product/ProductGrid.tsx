import React from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  ListRenderItemInfo,
} from 'react-native';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../common/EmptyState';
import { SPACING, COLORS } from '../../constants/theme';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  hasMore?: boolean;
  ListHeaderComponent?: React.ReactElement | null;
  emptyTitle?: string;
  emptyMessage?: string;
  onEmptyAction?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  hasMore = false,
  ListHeaderComponent,
  emptyTitle = 'No products found',
  emptyMessage = 'Try adjusting your search terms or filters.',
  onEmptyAction,
}) => {
  const renderItem = ({ item }: ListRenderItemInfo<Product>) => {
    return <ProductCard product={item} />;
  };

  const renderFooter = () => {
    if (!hasMore && !loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyState
        iconName="search-outline"
        title={emptyTitle}
        message={emptyMessage}
        buttonTitle={onEmptyAction ? 'Reset Filters' : undefined}
        onButtonPress={onEmptyAction}
      />
    );
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContent}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: SPACING.base,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: SPACING.base,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
