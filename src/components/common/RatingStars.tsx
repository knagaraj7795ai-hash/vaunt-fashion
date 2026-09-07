import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  pillMode?: boolean;
  style?: ViewStyle;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 'md',
  showCount = true,
  pillMode = true,
  style,
}) => {
  const iconSize = size === 'sm' ? 10 : size === 'lg' ? 16 : 12;

  if (pillMode) {
    return (
      <View style={[styles.pill, size === 'sm' ? styles.pillSm : styles.pillMd, style]}>
        <Text style={[styles.ratingNumber, size === 'sm' && styles.textSm]}>
          {rating.toFixed(1)}
        </Text>
        <Ionicons name="star" size={iconSize} color={COLORS.amber} style={styles.starIcon} />
        {showCount && reviewCount !== undefined && (
          <View style={styles.countContainer}>
            <View style={styles.separator} />
            <Text style={[styles.reviewCount, size === 'sm' && styles.textSm]}>{reviewCount}</Text>
          </View>
        )}
      </View>
    );
  }

  // Full star row mode
  return (
    <View style={[styles.starRow, style]}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= Math.round(rating) ? 'star' : 'star-outline'}
          size={iconSize}
          color={COLORS.amber}
          style={{ marginRight: 2 }}
        />
      ))}
      {showCount && reviewCount !== undefined && (
        <Text style={styles.reviewCountPlain}>({reviewCount} reviews)</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: RADIUS.xs,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  pillSm: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  pillMd: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  ratingNumber: {
    ...TYPOGRAPHY.captionBold,
    fontSize: 11,
    color: COLORS.textPrimary,
  },
  starIcon: {
    marginLeft: 3,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: 1,
    height: 9,
    backgroundColor: COLORS.borderDark,
    marginHorizontal: 4,
  },
  reviewCount: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  textSm: {
    fontSize: 9,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCountPlain: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginLeft: 6,
  },
});
