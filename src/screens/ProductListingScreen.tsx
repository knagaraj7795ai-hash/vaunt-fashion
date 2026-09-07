import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Product, FilterState, SortOption } from '../types/product';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Header } from '../components/common/Header';
import { ProductGrid } from '../components/product/ProductGrid';
import { FilterModal } from '../components/filter/FilterModal';
import { SortModal } from '../components/filter/SortModal';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';

type RouteProps = RouteProp<RootStackParamList, 'ProductListing'>;

export const ProductListingScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const { title, categoryId, subCategoryId, brandId, tag, searchQuery, isDeal } = route.params || {};

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [sort, setSort] = useState<SortOption>('recommended');
  const [filters, setFilters] = useState<Partial<FilterState>>({});
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  // Load brands for filter modal
  useEffect(() => {
    const fetchBrands = async () => {
      const bList = await categoryService.getBrands();
      setBrands(bList.map((b) => ({ id: b.id, name: b.name })));
    };
    fetchBrands();
  }, []);

  const fetchProducts = useCallback(
    async (currentPage = 1, isRefresh = false) => {
      if (currentPage === 1 && !isRefresh) setLoading(true);
      try {
        const res = await productService.filterAndSortProducts({
          categoryId,
          subCategoryId,
          brandId,
          tag,
          searchQuery,
          filters: {
            ...filters,
            ...(isDeal ? { minDiscount: 45 } : {}),
          },
          sort,
          page: currentPage,
          limit: 12,
        });

        if (currentPage === 1) {
          setProducts(res.products);
        } else {
          setProducts((prev) => [...prev, ...res.products.slice(prev.length)]);
        }
        setTotal(res.total);
        setHasMore(res.hasMore);
      } catch (e) {
        console.warn('Failed to fetch products', e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [categoryId, subCategoryId, brandId, tag, searchQuery, filters, sort, isDeal]
  );

  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchProducts(1, true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  // Calculate active filter count
  const activeFilterCount =
    (filters.brandIds?.length || 0) +
    (filters.genders?.length || 0) +
    (filters.sizes?.length || 0) +
    (filters.colors?.length || 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.minDiscount ? 1 : 0) +
    (filters.fits?.length || 0) +
    (filters.occasions?.length || 0);

  const removeFilterChip = (type: keyof FilterState, val?: any) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (Array.isArray(next[type])) {
        const arr = (next[type] as any[]).filter((x) => x !== val);
        (next as any)[type] = arr.length > 0 ? arr : undefined;
      } else {
        delete (next as any)[type];
      }
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header showBack title={title || 'Catalog'} showLocation={false} />

      {/* Sticky Sort & Filter Bar */}
      <View style={styles.sortFilterBar}>
        <TouchableOpacity
          style={styles.barButton}
          onPress={() => setSortModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="swap-vertical" size={16} color={COLORS.textPrimary} />
          <Text style={styles.barButtonText}>SORT</Text>
        </TouchableOpacity>

        <View style={styles.barDivider} />

        <TouchableOpacity
          style={styles.barButton}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="funnel-outline" size={16} color={COLORS.textPrimary} />
          <Text style={styles.barButtonText}>FILTER</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filter Chips Scroll */}
      {activeFilterCount > 0 && (
        <View style={styles.chipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {filters.sizes?.map((sz) => (
              <TouchableOpacity
                key={`sz_${sz}`}
                style={styles.chip}
                onPress={() => removeFilterChip('sizes', sz)}
              >
                <Text style={styles.chipText}>Size: {sz}</Text>
                <Ionicons name="close-circle" size={14} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}

            {filters.colors?.map((col) => (
              <TouchableOpacity
                key={`col_${col}`}
                style={styles.chip}
                onPress={() => removeFilterChip('colors', col)}
              >
                <Text style={styles.chipText}>{col}</Text>
                <Ionicons name="close-circle" size={14} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}

            {filters.minRating && (
              <TouchableOpacity
                style={styles.chip}
                onPress={() => removeFilterChip('minRating')}
              >
                <Text style={styles.chipText}>{filters.minRating}★ & above</Text>
                <Ionicons name="close-circle" size={14} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}

            {filters.minDiscount && (
              <TouchableOpacity
                style={styles.chip}
                onPress={() => removeFilterChip('minDiscount')}
              >
                <Text style={styles.chipText}>{filters.minDiscount}%+ Off</Text>
                <Ionicons name="close-circle" size={14} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}

            {filters.priceRange && (
              <TouchableOpacity
                style={styles.chip}
                onPress={() => removeFilterChip('priceRange')}
              >
                <Text style={styles.chipText}>
                  ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </Text>
                <Ionicons name="close-circle" size={14} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.chip, styles.clearAllChip]}
              onPress={() => setFilters({})}
            >
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Result Count Banner */}
      <View style={styles.resultsInfoRow}>
        <Text style={styles.resultsText}>
          {total} {total === 1 ? 'Product' : 'Products'} Available
        </Text>
      </View>

      {/* 2-Column Product Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        hasMore={hasMore}
        onEmptyAction={() => setFilters({})}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        filters={filters}
        brands={brands}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        onClose={() => setFilterModalVisible(false)}
      />

      {/* Sort Modal */}
      <SortModal
        visible={sortModalVisible}
        currentSort={sort}
        onSelectSort={(newSort) => setSort(newSort)}
        onClose={() => setSortModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  sortFilterBar: {
    flexDirection: 'row',
    height: 46,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  barButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  barButtonText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textPrimary,
    letterSpacing: 1,
    fontWeight: '800',
  },
  barDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
  },
  filterCountBadge: {
    backgroundColor: COLORS.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  filterCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  chipsContainer: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  chipsScroll: {
    paddingHorizontal: SPACING.base,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  clearAllChip: {
    backgroundColor: COLORS.roseLight,
    borderColor: 'transparent',
  },
  clearAllText: {
    ...TYPOGRAPHY.captionBold,
    fontSize: 11,
    color: COLORS.rose,
  },
  resultsInfoRow: {
    paddingHorizontal: SPACING.base,
    paddingTop: 10,
    paddingBottom: 2,
  },
  resultsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});
