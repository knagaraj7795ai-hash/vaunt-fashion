import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Product } from '../types/product';
import { Category, Brand, Banner } from '../types/category';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { Header } from '../components/common/Header';
import { BannerCarousel } from '../components/home/BannerCarousel';
import { CategoryCircles } from '../components/home/CategoryCircles';
import { DealOfTheDaySection } from '../components/home/DealOfTheDaySection';
import { BrandSpotlight } from '../components/home/BrandSpotlight';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { COLORS } from '../constants/theme';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { recentlyViewed } = useRecentlyViewed();

  const [refreshing, setRefreshing] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [under999, setUnder999] = useState<Product[]>([]);
  const [freshFits, setFreshFits] = useState<Product[]>([]);
  const [weekendStyles, setWeekendStyles] = useState<Product[]>([]);

  const loadHomeData = useCallback(async () => {
    try {
      const [
        loadedBanners,
        loadedCategories,
        loadedBrands,
        loadedTrending,
        loadedBestSellers,
        loadedNew,
        loadedDeals,
        loadedUnder999,
        loadedFreshFits,
        loadedWeekend,
      ] = await Promise.all([
        categoryService.getBanners(),
        categoryService.getCategories(),
        categoryService.getFeaturedBrands(),
        productService.getTrendingProducts(8),
        productService.getBestSellers(8),
        productService.getNewArrivals(8),
        productService.getDealsOfTheDay(),
        productService.getProductsByTag('under-999'),
        productService.getProductsByTag('fresh-fits'),
        productService.getProductsByTag('weekend-styles'),
      ]);

      setBanners(loadedBanners);
      setCategories(loadedCategories);
      setBrands(loadedBrands);
      setTrending(loadedTrending);
      setBestSellers(loadedBestSellers);
      setNewArrivals(loadedNew);
      setDeals(loadedDeals.slice(0, 6));
      setUnder999(loadedUnder999.slice(0, 8));
      setFreshFits(loadedFreshFits.slice(0, 8));
      setWeekendStyles(loadedWeekend.slice(0, 8));
    } catch (e) {
      console.warn('Failed to load home data', e);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const navigateToListing = (title: string, tag?: string, isDeal?: boolean) => {
    navigation.navigate('ProductListing', { title, tag, isDeal });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header />

      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Promotional Hero Banners */}
        <BannerCarousel banners={banners} />

        {/* Shop by Category Circles */}
        <CategoryCircles categories={categories} />

        {/* Deals of the Day with Countdown */}
        <DealOfTheDaySection products={deals} />

        {/* Fresh Fits */}
        <ProductCarousel
          badgeText="NEW COLLECTION"
          title="Fresh Fits"
          subtitle="Curated streetwear & minimalist contemporary pieces"
          products={freshFits}
          onSeeAll={() => navigateToListing('Fresh Fits', 'fresh-fits')}
        />

        {/* Trending This Week */}
        <ProductCarousel
          badgeText="HOT RIGHT NOW"
          title="Trending This Week"
          subtitle="What style-conscious individuals are buying most"
          products={trending}
          onSeeAll={() => navigateToListing('Trending This Week', 'trending')}
        />

        {/* Top Curated Brands */}
        <BrandSpotlight brands={brands} />

        {/* New Season Drops */}
        <ProductCarousel
          badgeText="JUST LANDED"
          title="New Season Drops"
          subtitle="Latest silhouettes in linen, selvedge, and silk"
          products={newArrivals}
          onSeeAll={() => navigateToListing('New Season Drops', 'new-season')}
        />

        {/* Under ₹999 Essentials */}
        <ProductCarousel
          badgeText="BUDGET LUXE"
          title="Under ₹999 Picks"
          subtitle="Substantial fabrics & everyday style at accessible prices"
          products={under999}
          onSeeAll={() => navigateToListing('Under ₹999 Picks', 'under-999')}
        />

        {/* Best Sellers */}
        <ProductCarousel
          badgeText="CUSTOMER FAVORITES"
          title="All-Time Best Sellers"
          subtitle="Consistently top-rated for comfort and durability"
          products={bestSellers}
          onSeeAll={() => navigateToListing('All-Time Best Sellers', 'best-seller')}
        />

        {/* Weekend Styles */}
        <ProductCarousel
          badgeText="EASY RESORT"
          title="Weekend Styles"
          subtitle="Relaxed shirts, breathable pants, and easy footwear"
          products={weekendStyles}
          onSeeAll={() => navigateToListing('Weekend Styles', 'weekend-styles')}
        />

        {/* Recently Viewed Carousel */}
        {recentlyViewed.length > 0 && (
          <ProductCarousel
            badgeText="CONTINUE BROWSING"
            title="Recently Viewed"
            products={recentlyViewed}
            onSeeAll={() => navigation.navigate('RecentlyViewed')}
          />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  bottomPadding: {
    height: 40,
  },
});
