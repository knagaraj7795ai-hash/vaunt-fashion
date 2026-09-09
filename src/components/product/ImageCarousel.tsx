import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface ImageCarouselProps {
  images: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (slide !== activeIndex) {
      setActiveIndex(slide);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => `img_${index}`}
        renderItem={({ item }) => (
          <View style={styles.imageSlide}>
            <Image source={{ uri: item }} style={styles.image} contentFit="cover" transition={300} />
          </View>
        )}
      />

      {images.length > 1 && (
        <View style={styles.paginationDots}>
          {images.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  imageSlide: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.15,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  activeDot: {
    width: 20,
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
});
