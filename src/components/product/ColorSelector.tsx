import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ProductColor } from '../../types/product';
import { COLORS, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColor: ProductColor;
  onSelectColor: (color: ProductColor) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>COLOR: </Text>
        <Text style={styles.selectedName}>{selectedColor.name}</Text>
      </View>

      <View style={styles.swatchRow}>
        {colors.map((color) => {
          const isSelected = selectedColor.name === color.name;

          return (
            <TouchableOpacity
              key={color.name}
              activeOpacity={0.8}
              onPress={() => onSelectColor(color)}
              style={[
                styles.swatchRing,
                isSelected && styles.selectedRing,
              ]}
            >
              <View style={[styles.swatchDot, { backgroundColor: color.hex }]} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  selectedName: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 12,
  },
  swatchRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRing: {
    borderColor: COLORS.primary,
  },
  swatchDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});
