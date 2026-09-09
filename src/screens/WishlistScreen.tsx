import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Product } from '../types/product';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Header } from '../components/common/Header';
import { ProductGrid } from '../components/product/ProductGrid';
import { EmptyState } from '../components/common/EmptyState';
import { SizeSelector } from '../components/product/SizeSelector';
import { Button } from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { wishlist, clearWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [chosenSize, setChosenSize] = useState<string>('');

  const handleClearAll = () => {
    Alert.alert('Clear Wishlist', 'Are you sure you want to remove all saved items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearWishlist },
    ]);
  };

  const handleMoveToCart = () => {
    if (!selectedProduct) return;
    if (!chosenSize) {
      Alert.alert('Select Size', 'Please select a size to move to cart.');
      return;
    }

    addToCart(selectedProduct, chosenSize, selectedProduct.colors[0], 1);
    removeFromWishlist(selectedProduct.id);
    setSelectedProduct(null);
    setChosenSize('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header title="My Wishlist" showLocation={false} />

      {wishlist.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.topInfoBar}>
            <Text style={styles.countText}>{wishlist.length} Items Saved</Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ProductGrid products={wishlist} />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="heart-dislike-outline"
            title="Your Wishlist is Empty"
            message="Explore our curated fashion collections and tap the heart icon to save styles you adore."
            buttonTitle="START SHOPPING"
            onButtonPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' } as any)}
          />
        </View>
      )}

      {/* Move to Cart Size Selection Modal */}
      {selectedProduct && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Size to Move to Cart</Text>
                <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                  <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.productName}>{selectedProduct.name}</Text>

              <SizeSelector
                sizes={selectedProduct.sizes}
                inStockSizes={selectedProduct.inStockSizes}
                selectedSize={chosenSize}
                onSelectSize={setChosenSize}
              />

              <Button
                title="CONFIRM & MOVE TO CART"
                variant="primary"
                size="md"
                onPress={handleMoveToCart}
                style={styles.modalConfirmBtn}
              />
            </View>
          </View>
        </Modal>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    justifyContent: 'center',
    padding: SPACING.base,
  },
  topInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  countText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textSecondary,
  },
  clearAllText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.rose,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
  },
  productName: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  modalConfirmBtn: {
    marginTop: 16,
  },
});
