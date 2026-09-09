import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Category, SubCategory } from '../types/category';
import { categoryService } from '../services/categoryService';
import { Header } from '../components/common/Header';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const CategoryScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const list = await categoryService.getCategories();
      setCategories(list);
      if (list.length > 0) {
        setActiveCategory(list[0]);
      }
    };
    fetch();
  }, []);

  const handleSubCategoryPress = (sub: SubCategory) => {
    if (!activeCategory) return;
    navigation.navigate('ProductListing', {
      title: sub.name,
      categoryId: activeCategory.id,
      subCategoryId: sub.id,
    });
  };

  const handleExploreAllCategory = () => {
    if (!activeCategory) return;
    navigation.navigate('ProductListing', {
      title: `${activeCategory.name} Collection`,
      categoryId: activeCategory.id,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header title="Browse Categories" showLocation={false} />

      <View style={styles.body}>
        {/* Left Vertical Categories Navigation */}
        <View style={styles.leftNav}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map((cat) => {
              const isActive = activeCategory?.id === cat.id;

              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryTab, isActive && styles.activeTab]}
                  onPress={() => setActiveCategory(cat)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.tabIconCircle, isActive && styles.activeIconCircle]}>
                    <Ionicons
                      name={cat.icon as any}
                      size={20}
                      color={isActive ? '#FFFFFF' : COLORS.textSecondary}
                    />
                  </View>
                  <Text style={[styles.tabTitle, isActive && styles.activeTabTitle]} numberOfLines={1}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Right Subcategories Grid */}
        <View style={styles.rightContent}>
          {activeCategory && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
              {/* Category Hero Banner */}
              <TouchableOpacity
                style={styles.heroBanner}
                onPress={handleExploreAllCategory}
                activeOpacity={0.9}
              >
                <Image source={{ uri: activeCategory.imageUrl }} style={styles.heroImage} contentFit="cover" transition={300} />
                <View style={styles.heroOverlay}>
                  <Text style={styles.heroTitle}>{activeCategory.name}</Text>
                  <Text style={styles.heroDesc} numberOfLines={2}>
                    {activeCategory.description}
                  </Text>
                  <View style={styles.exploreAllPill}>
                    <Text style={styles.exploreAllText}>Explore All Styles</Text>
                    <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>

              <Text style={styles.subCategoryHeading}>POPULAR SUBCATEGORIES</Text>

              {/* Subcategories Grid */}
              <View style={styles.subGrid}>
                {activeCategory.subCategories.map((sub) => (
                  <TouchableOpacity
                    key={sub.id}
                    style={styles.subCard}
                    onPress={() => handleSubCategoryPress(sub)}
                    activeOpacity={0.85}
                  >
                    {sub.imageUrl ? (
                      <Image source={{ uri: sub.imageUrl }} style={styles.subImage} contentFit="cover" transition={200} />
                    ) : (
                      <View style={styles.subImagePlaceholder}>
                        <Ionicons name="shirt-outline" size={24} color={COLORS.textMuted} />
                      </View>
                    )}
                    <View style={styles.subCardDetails}>
                      <Text style={styles.subName} numberOfLines={2}>
                        {sub.name}
                      </Text>
                      <Text style={styles.subCount}>{sub.itemCount}+ Items</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  leftNav: {
    width: 96,
    backgroundColor: COLORS.surfaceSubtle,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  categoryTab: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  activeTab: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  tabIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  activeIconCircle: {
    backgroundColor: COLORS.primary,
  },
  tabTitle: {
    ...TYPOGRAPHY.micro,
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  activeTabTitle: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  rightContent: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  scrollContainer: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  heroBanner: {
    width: '100%',
    height: 140,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    padding: 14,
    justifyContent: 'flex-end',
  },
  heroTitle: {
    ...TYPOGRAPHY.title1,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  heroDesc: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    marginBottom: 8,
  },
  exploreAllPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  exploreAllText: {
    ...TYPOGRAPHY.micro,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  subCategoryHeading: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginVertical: 10,
  },
  subGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  subCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  subImage: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.surfaceSubtle,
  },
  subImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCardDetails: {
    padding: 8,
  },
  subName: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    minHeight: 32,
  },
  subCount: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
