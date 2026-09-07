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
import { Category } from '../../types/category';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../constants/theme';

interface CategoryCirclesProps {
  categories: Category[];
}

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({ categories }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCategoryPress = (cat: Category) => {
    navigation.navigate('ProductListing', {
      title: cat.name,
      categoryId: cat.id,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            onPress={() => handleCategoryPress(cat)}
            style={styles.circleItem}
          >
            <View style={styles.imageRing}>
              <Image source={{ uri: cat.imageUrl }} style={styles.circleImage} />
            </View>
            <Text style={styles.categoryName} numberOfLines={1}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    gap: 16,
  },
  circleItem: {
    alignItems: 'center',
    width: 68,
  },
  imageRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.border,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceSubtle,
    ...SHADOWS.sm,
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    ...TYPOGRAPHY.micro,
    fontSize: 11,
    color: COLORS.textPrimary,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
});
