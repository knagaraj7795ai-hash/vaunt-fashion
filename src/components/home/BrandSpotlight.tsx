import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Brand } from '../../types/category';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface BrandSpotlightProps {
  brands: Brand[];
}

export const BrandSpotlight: React.FC<BrandSpotlightProps> = ({ brands }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBrandPress = (brand: Brand) => {
    navigation.navigate('ProductListing', {
      title: brand.name,
      brandId: brand.id,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badgeText}>CURATED LABELS</Text>
        <Text style={styles.title}>Top Brands & Ateliers</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            activeOpacity={0.88}
            onPress={() => handleBrandPress(brand)}
            style={styles.brandCard}
          >
            <Image source={{ uri: brand.logo }} style={styles.brandLogo} />
            <Text style={styles.brandName} numberOfLines={1}>
              {brand.name}
            </Text>
            <Text style={styles.tagline} numberOfLines={2}>
              {brand.tagline}
            </Text>
            <View style={styles.countPill}>
              <Text style={styles.countText}>{brand.productCount}+ Styles</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.lg,
  },
  header: {
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  badgeText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.accent,
    letterSpacing: 1,
  },
  title: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.md,
  },
  brandCard: {
    width: 150,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  brandLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: COLORS.surfaceSubtle,
  },
  brandName: {
    ...TYPOGRAPHY.headline,
    fontSize: 13,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  tagline: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    minHeight: 28,
  },
  countPill: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    marginTop: 8,
  },
  countText: {
    ...TYPOGRAPHY.micro,
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
});
