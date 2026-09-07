import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface SizeSelectorProps {
  sizes: string[];
  inStockSizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  onOpenSizeGuide?: () => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  inStockSizes,
  selectedSize,
  onSelectSize,
  onOpenSizeGuide,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>SELECT SIZE</Text>
        {onOpenSizeGuide && (
          <TouchableOpacity style={styles.sizeGuideBtn} onPress={onOpenSizeGuide}>
            <Ionicons name="resize-outline" size={14} color={COLORS.accent} />
            <Text style={styles.sizeGuideText}>Size Guide</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sizePillsRow}>
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const isAvailable = inStockSizes.includes(size);

          return (
            <TouchableOpacity
              key={size}
              activeOpacity={0.8}
              disabled={!isAvailable}
              onPress={() => onSelectSize(size)}
              style={[
                styles.sizePill,
                isSelected && styles.selectedPill,
                !isAvailable && styles.disabledPill,
              ]}
            >
              <Text
                style={[
                  styles.sizeText,
                  isSelected && styles.selectedText,
                  !isAvailable && styles.disabledText,
                ]}
              >
                {size}
              </Text>
              {!isAvailable && <View style={styles.strikethrough} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedSize && inStockSizes.includes(selectedSize) && (
        <Text style={styles.stockHint}>
          <Ionicons name="checkmark-circle" size={12} color={COLORS.emerald} /> In stock & ready to ship
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    letterSpacing: 0.8,
  },
  sizeGuideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sizeGuideText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.accent,
  },
  sizePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizePill: {
    minWidth: 46,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  selectedPill: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  disabledPill: {
    backgroundColor: COLORS.surfaceSubtle,
    borderColor: COLORS.borderLight,
    opacity: 0.6,
  },
  sizeText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  selectedText: {
    color: COLORS.textInverse,
  },
  disabledText: {
    color: COLORS.textSubtle,
  },
  strikethrough: {
    position: 'absolute',
    width: '100%',
    height: 1.5,
    backgroundColor: COLORS.textSubtle,
    transform: [{ rotate: '-45deg' }],
  },
  stockHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.emerald,
    fontWeight: '600',
    marginTop: 8,
  },
});
