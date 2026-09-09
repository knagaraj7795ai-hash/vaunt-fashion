import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Share,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Product, ProductColor, Review } from '../types/product';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { Header } from '../components/common/Header';
import { ImageCarousel } from '../components/product/ImageCarousel';
import { PriceDisplay, formatINR } from '../components/common/PriceDisplay';
import { RatingStars } from '../components/common/RatingStars';
import { SizeSelector } from '../components/product/SizeSelector';
import { ColorSelector } from '../components/product/ColorSelector';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

type RouteProps = RouteProp<RootStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { productId } = route.params;

  const { addToCart, isItemInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addProductToRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [sizeGuideVisible, setSizeGuideVisible] = useState(false);
  const [pincode, setPincode] = useState('560102');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>('Delivery by Thursday, 10 Sep • Free on orders above ₹999');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const p = await productService.getProductById(productId);
      if (p) {
        setProduct(p);
        setSelectedSize(p.inStockSizes[0] || p.sizes[0] || '');
        setSelectedColor(p.colors[0] || { name: 'Default', hex: '#000000' });
        addProductToRecentlyViewed(p);

        const [sim, revs] = await Promise.all([
          productService.getSimilarProducts(p.id, 6),
          productService.getProductReviews(p.id),
        ]);
        setSimilarProducts(sim);
        setReviews(revs);
      }
    };
    load();
  }, [productId]);

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `Check out ${product.name} on VAUNT: ${formatINR(product.price)}`,
      });
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  const handleCheckPincode = () => {
    if (pincode.trim().length === 6) {
      setDeliveryStatus('Standard Delivery: 2-3 Business Days • Cash on Delivery available');
    } else {
      setDeliveryStatus('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedColor) return;
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please select a size before adding to cart.');
      return;
    }

    addToCart(product, selectedSize, selectedColor, 1);
    setToastMessage(`Added to cart (${selectedSize})`);
  };

  const handleBuyNow = () => {
    if (!product || !selectedColor) return;
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please select a size to proceed to checkout.');
      return;
    }

    addToCart(product, selectedSize, selectedColor, 1);
    navigation.navigate('Cart');
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header showBack title="Product" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading style details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const wishlisted = isInWishlist(product.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header showBack title={product.brandName} showLocation={false} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Full-width Product Gallery */}
        <ImageCarousel images={product.images} />

        <View style={styles.content}>
          {/* Brand & Title */}
          <View style={styles.titleSection}>
            <View style={styles.brandRow}>
              <Text style={styles.brandName}>{product.brandName}</Text>
              <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
                <Ionicons name="share-social-outline" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.productName}>{product.name}</Text>
            {product.tagline && <Text style={styles.tagline}>{product.tagline}</Text>}

            {/* Rating pill */}
            <View style={styles.ratingRow}>
              <RatingStars
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="md"
              />
              <Text style={styles.verifiedText}>Verified Customer Purchases</Text>
            </View>
          </View>

          {/* Pricing Block */}
          <View style={styles.priceBlock}>
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              size="xl"
              showSavings
            />
            <Text style={styles.taxNote}>Inclusive of all applicable taxes</Text>
          </View>

          {/* Promotional Offer Callout */}
          <View style={styles.offerBanner}>
            <View style={styles.offerHeader}>
              <Ionicons name="pricetag" size={16} color={COLORS.emerald} />
              <Text style={styles.offerTitle}>BANK & CART OFFERS</Text>
            </View>
            <Text style={styles.offerText}>
              • Flat ₹200 off on first order with code <Text style={styles.boldText}>FIRSTORDER</Text>
            </Text>
            <Text style={styles.offerText}>
              • 15% instant discount on orders above ₹1,499 with code <Text style={styles.boldText}>NEWUSER</Text>
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Offers')}>
              <Text style={styles.viewOffersLink}>View All 5 Active Offers →</Text>
            </TouchableOpacity>
          </View>

          {/* Color Selector */}
          <ColorSelector
            colors={product.colors}
            selectedColor={selectedColor!}
            onSelectColor={(col) => setSelectedColor(col)}
          />

          {/* Size Selector */}
          <SizeSelector
            sizes={product.sizes}
            inStockSizes={product.inStockSizes}
            selectedSize={selectedSize}
            onSelectSize={(sz) => setSelectedSize(sz)}
            onOpenSizeGuide={() => setSizeGuideVisible(true)}
          />

          {/* Delivery & Pincode Checker */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>DELIVERY OPTIONS</Text>
            <View style={styles.pincodeRow}>
              <Input
                placeholder="Enter 6-digit Indian PIN Code"
                keyboardType="numeric"
                maxLength={6}
                value={pincode}
                onChangeText={setPincode}
                containerStyle={styles.pincodeInput}
              />
              <Button
                title="CHECK"
                variant="outline"
                size="sm"
                onPress={handleCheckPincode}
                style={styles.checkBtn}
              />
            </View>
            {deliveryStatus && (
              <View style={styles.deliveryFeedback}>
                <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.emerald} />
                <Text style={styles.deliveryStatusText}>{deliveryStatus}</Text>
              </View>
            )}
          </View>

          {/* Product Details & Specifications */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>PRODUCT SPECIFICATIONS</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>

            <View style={styles.specGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Fabric</Text>
                <Text style={styles.specValue}>{product.material}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Fit</Text>
                <Text style={styles.specValue}>{product.fit}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Occasion</Text>
                <Text style={styles.specValue}>{product.occasion}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Gender</Text>
                <Text style={styles.specValue}>{product.gender.toUpperCase()}</Text>
              </View>
              {product.specifications.map((spec, i) => (
                <View key={i} style={styles.specItem}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Material & Care */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>FABRIC & CARE INSTRUCTIONS</Text>
            {product.careInstructions.map((inst, i) => (
              <View key={i} style={styles.careBullet}>
                <Ionicons name="checkmark-sharp" size={14} color={COLORS.primary} />
                <Text style={styles.careText}>{inst}</Text>
              </View>
            ))}
          </View>

          {/* Easy Return Guarantee */}
          <View style={styles.guaranteeCard}>
            <Ionicons name="refresh-circle-outline" size={24} color={COLORS.primary} />
            <View style={styles.guaranteeText}>
              <Text style={styles.guaranteeTitle}>14-Day Hassle-Free Returns & Exchanges</Text>
              <Text style={styles.guaranteeSub}>
                Complimentary doorstep pickup with immediate replacement or refund.
              </Text>
            </View>
          </View>

          {/* Customer Reviews Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>RATINGS & REVIEWS</Text>
            <View style={styles.overallRatingRow}>
              <View style={styles.ratingBigCol}>
                <Text style={styles.bigScore}>{product.rating.toFixed(1)}</Text>
                <RatingStars rating={product.rating} pillMode={false} showCount={false} />
                <Text style={styles.verifiedCount}>{product.reviewCount} Verified Ratings</Text>
              </View>
              <View style={styles.ratingBarCol}>
                {[
                  { stars: 5, pct: 82 },
                  { stars: 4, pct: 13 },
                  { stars: 3, pct: 3 },
                  { stars: 2, pct: 1 },
                  { stars: 1, pct: 1 },
                ].map((bar) => (
                  <View key={bar.stars} style={styles.barRow}>
                    <Text style={styles.starNum}>{bar.stars}★</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${bar.pct}%` }]} />
                    </View>
                    <Text style={styles.barPct}>{bar.pct}%</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Individual Reviews */}
            <View style={styles.reviewsList}>
              {reviews.map((rev) => (
                <View key={rev.id} style={styles.reviewItem}>
                  <View style={styles.revHeader}>
                    <View style={styles.revUser}>
                      <Text style={styles.revName}>{rev.userName}</Text>
                      {rev.verifiedPurchase && (
                        <View style={styles.verifiedBadge}>
                          <Ionicons name="checkmark-circle" size={12} color={COLORS.emerald} />
                          <Text style={styles.verifiedBadgeText}>Verified Buyer</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.revDate}>{rev.date}</Text>
                  </View>

                  <View style={styles.revStarRow}>
                    <RatingStars rating={rev.rating} pillMode={false} showCount={false} size="sm" />
                    <Text style={styles.revTitle}>{rev.title}</Text>
                  </View>

                  <Text style={styles.revComment}>{rev.comment}</Text>
                  {rev.sizeBought && (
                    <Text style={styles.sizeBoughtText}>Size bought: {rev.sizeBought}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <ProductCarousel
              badgeText="YOU MAY ALSO LIKE"
              title="Similar Styles"
              products={similarProducts}
            />
          )}

          <View style={styles.bottomBuffer} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.wishlistBarBtn}
          onPress={() => toggleWishlist(product)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={22}
            color={wishlisted ? COLORS.rose : COLORS.textPrimary}
          />
          <Text style={[styles.wishlistBarText, wishlisted && { color: COLORS.rose }]}>
            {wishlisted ? 'WISHLISTED' : 'WISHLIST'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Ionicons name="bag-handle-outline" size={18} color={COLORS.textInverse} />
          <Text style={styles.addToCartText}>
            {isItemInCart(product.id, selectedSize) ? 'ADD MORE' : 'ADD TO CART'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowBtn}
          onPress={handleBuyNow}
          activeOpacity={0.8}
        >
          <Text style={styles.buyNowText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>

      {/* Size Guide Modal */}
      <SizeGuideModal
        visible={sizeGuideVisible}
        onClose={() => setSizeGuideVisible(false)}
      />

      {/* Action Toast Feedback */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
          actionLabel="GO TO CART"
          onAction={() => {
            setToastMessage(null);
            navigation.navigate('Cart');
          }}
        />
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  content: {
    paddingHorizontal: SPACING.base,
  },
  titleSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandName: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  shareBtn: {
    padding: 6,
  },
  productName: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tagline: {
    ...TYPOGRAPHY.caption,
    color: COLORS.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  verifiedText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  priceBlock: {
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  taxNote: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  offerBanner: {
    backgroundColor: COLORS.emeraldLight,
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.2)',
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  offerTitle: {
    ...TYPOGRAPHY.micro,
    color: COLORS.emerald,
    fontWeight: '800',
    letterSpacing: 1,
  },
  offerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
  },
  viewOffersLink: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.emerald,
    marginTop: 6,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: RADIUS.md,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sectionHeading: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  pincodeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  pincodeInput: {
    flex: 1,
    marginBottom: 0,
  },
  checkBtn: {
    height: 48,
    paddingHorizontal: 16,
  },
  deliveryFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  deliveryStatusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.emerald,
    fontWeight: '600',
    flex: 1,
  },
  descriptionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 14,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
  },
  specItem: {
    width: '50%',
    paddingVertical: 6,
  },
  specLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  specValue: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  careBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  careText: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: RADIUS.md,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  guaranteeText: {
    flex: 1,
  },
  guaranteeTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  guaranteeSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  overallRatingRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  ratingBigCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigScore: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  verifiedCount: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  ratingBarCol: {
    flex: 1,
    justifyContent: 'center',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  starNum: {
    ...TYPOGRAPHY.micro,
    width: 20,
    color: COLORS.textMuted,
  },
  barTrack: {
    flex: 1,
    height: 5,
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.emerald,
  },
  barPct: {
    ...TYPOGRAPHY.micro,
    width: 28,
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  reviewsList: {
    gap: 14,
  },
  reviewItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 12,
  },
  revHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  revUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  revName: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedBadgeText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.emerald,
    fontSize: 9,
  },
  revDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 10,
  },
  revStarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  revTitle: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  revComment: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  sizeBoughtText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 4,
    fontSize: 11,
  },
  bottomBuffer: {
    height: 90,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.base,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  wishlistBarBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  wishlistBarText: {
    ...TYPOGRAPHY.micro,
    fontSize: 9,
    color: COLORS.textPrimary,
    marginTop: 2,
    fontWeight: '700',
  },
  addToCartBtn: {
    flex: 1.2,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: RADIUS.md,
  },
  addToCartText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textInverse,
    letterSpacing: 0.6,
  },
  buyNowBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: RADIUS.md,
  },
  buyNowText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textInverse,
    letterSpacing: 0.6,
  },
});
