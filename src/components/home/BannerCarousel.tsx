import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Banner } from '../../types/category';
import { COLORS, RADIUS, TYPOGRAPHY, SPACING } from '../../constants/theme';

interface BannerCarouselProps {
  banners: Banner[];
}

const getMaxWidth = () => {
  const { width } = Dimensions.get('window');
  return width;
};

const BANNER_WIDTH = getMaxWidth() - SPACING.base * 2;
const BANNER_HEIGHT = BANNER_WIDTH * 0.58;

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeIndex, banners.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / BANNER_WIDTH);
    if (slide >= 0 && slide < banners.length && slide !== activeIndex) {
      setActiveIndex(slide);
    }
  };

  const handleBannerPress = (banner: Banner) => {
    navigation.navigate('ProductListing', {
      title: banner.title,
      categoryId: banner.categoryId,
      subCategoryId: banner.subCategoryId,
      tag: banner.tagFilter,
    });
  };

  const getItemLayout = (_: any, index: number) => ({
    length: BANNER_WIDTH + SPACING.base,
    offset: (BANNER_WIDTH + SPACING.base) * index,
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={BANNER_WIDTH + SPACING.base}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        getItemLayout={getItemLayout}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => handleBannerPress(item)}
            style={styles.bannerCard}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} contentFit="cover" transition={300} />
            <View style={styles.overlayGradient}>
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>
              <Text style={styles.bannerTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.bannerSubtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
              <View style={styles.discountPill}>
                <Text style={styles.discountText}>{item.discountText}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Pagination indicators */}
      <View style={styles.paginationRow}>
        {banners.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.indicator,
              idx === activeIndex ? styles.activeIndicator : styles.inactiveIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  listContent: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.base,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.primary,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.88,
  },
  overlayGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  tagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    marginBottom: 6,
  },
  tagText: {
    ...TYPOGRAPHY.micro,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  bannerTitle: {
    ...TYPOGRAPHY.title1,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bannerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    marginBottom: 8,
  },
  discountPill: {
    backgroundColor: COLORS.amber,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  discountText: {
    ...TYPOGRAPHY.captionBold,
    color: '#000000',
    fontSize: 11,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  indicator: {
    height: 4,
    borderRadius: 2,
  },
  activeIndicator: {
    width: 22,
    backgroundColor: COLORS.primary,
  },
  inactiveIndicator: {
    width: 6,
    backgroundColor: COLORS.borderDark,
  },
});
