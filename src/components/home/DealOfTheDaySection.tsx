import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Product } from '../../types/product';
import { ProductCard } from '../product/ProductCard';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface DealOfTheDaySectionProps {
  products: Product[];
}

export const DealOfTheDaySection: React.FC<DealOfTheDaySectionProps> = ({ products }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (n: number) => n.toString().padStart(2, '0');

  const handleSeeAll = () => {
    navigation.navigate('ProductListing', {
      title: 'Deals of the Day',
      isDeal: true,
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <View style={styles.flashRow}>
            <Ionicons name="flash" size={16} color={COLORS.amber} />
            <Text style={styles.badgeText}>LIMITED TIME</Text>
          </View>
          <Text style={styles.title}>Deals of the Day</Text>
        </View>

        {/* Timer Blocks */}
        <View style={styles.timerContainer}>
          <View style={styles.timerBlock}>
            <Text style={styles.timerNumber}>{formatDigits(timeLeft.hours)}</Text>
            <Text style={styles.timerUnit}>H</Text>
          </View>
          <Text style={styles.colon}>:</Text>
          <View style={styles.timerBlock}>
            <Text style={styles.timerNumber}>{formatDigits(timeLeft.minutes)}</Text>
            <Text style={styles.timerUnit}>M</Text>
          </View>
          <Text style={styles.colon}>:</Text>
          <View style={styles.timerBlock}>
            <Text style={styles.timerNumber}>{formatDigits(timeLeft.seconds)}</Text>
            <Text style={styles.timerUnit}>S</Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsRow}
      >
        {products.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            cardWidth={165}
            style={styles.cardItem}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.viewAllBtn} onPress={handleSeeAll} activeOpacity={0.8}>
        <Text style={styles.viewAllText}>EXPLORE ALL DEALS (UP TO 50% OFF)</Text>
        <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.lg,
    backgroundColor: '#FEF3C7',
    paddingVertical: SPACING.base,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.md,
  },
  titleArea: {
    flex: 1,
  },
  flashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  badgeText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.amber,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    ...TYPOGRAPHY.title2,
    color: '#78350F',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timerBlock: {
    backgroundColor: '#78350F',
    borderRadius: RADIUS.xs,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  timerNumber: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  timerUnit: {
    color: '#FDE68A',
    fontSize: 9,
    fontWeight: '700',
  },
  colon: {
    color: '#78350F',
    fontWeight: '800',
    fontSize: 14,
  },
  cardsRow: {
    paddingHorizontal: SPACING.base,
  },
  cardItem: {
    marginRight: SPACING.md,
    backgroundColor: '#FFFFFF',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
    paddingVertical: 8,
  },
  viewAllText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.primary,
    letterSpacing: 0.6,
  },
});
