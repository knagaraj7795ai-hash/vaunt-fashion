import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  products: Product[];
  onSeeAll?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.44;

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  subtitle,
  badgeText,
  products,
  onSeeAll,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleArea}>
          {badgeText && <Text style={styles.badgeText}>{badgeText}</Text>}
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {onSeeAll && (
          <TouchableOpacity style={styles.seeAllBtn} onPress={onSeeAll}>
            <Text style={styles.seeAllText}>VIEW ALL</Text>
            <Ionicons name="arrow-forward" size={12} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.carouselContent}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            cardWidth={CARD_WIDTH}
            style={styles.cardSpacing}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  titleArea: {
    flex: 1,
  },
  badgeText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 2,
  },
  seeAllText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.primary,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  carouselContent: {
    paddingHorizontal: SPACING.base,
  },
  cardSpacing: {
    marginRight: SPACING.md,
  },
});
