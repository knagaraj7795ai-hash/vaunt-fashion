import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Product } from '../../types/product';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { PriceDisplay } from '../common/PriceDisplay';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  cardWidth?: number;
  style?: ViewStyle;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = (SCREEN_WIDTH - SPACING.base * 3) / 2;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cardWidth = DEFAULT_CARD_WIDTH,
  style,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handlePress = () => {
    navigation.navigate('ProductDetails', { productId: product.id });
  };

  const handleWishlistPress = (e: any) => {
    e.stopPropagation?.();
    toggleWishlist(product);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handlePress}
      style={[styles.card, { width: cardWidth }, style]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />

        {/* Top Badges */}
        <View style={styles.topBadgeRow}>
          {product.isNew ? (
            <Badge label="NEW" variant="primary" size="sm" />
          ) : product.discount >= 50 ? (
            <Badge label="50% OFF" variant="error" size="sm" />
          ) : product.isBestSeller ? (
            <Badge label="BESTSELLER" variant="warning" size="sm" />
          ) : null}
        </View>

        {/* Floating Wishlist Heart */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleWishlistPress}
          style={styles.wishlistBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={18}
            color={wishlisted ? COLORS.rose : COLORS.textPrimary}
          />
        </TouchableOpacity>

        {/* Floating Rating Pill */}
        <View style={styles.ratingBadge}>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.brandName} numberOfLines={1}>
          {product.brandName}
        </Text>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
          size="sm"
          style={styles.priceDisplay}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 0.85,
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgeRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  detailsContainer: {
    padding: 10,
  },
  brandName: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  productName: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 4,
  },
  priceDisplay: {
    marginTop: 2,
  },
});
