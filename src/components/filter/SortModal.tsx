import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SortOption } from '../../types/product';
import { COLORS, RADIUS, TYPOGRAPHY, SPACING } from '../../constants/theme';

interface SortModalProps {
  visible: boolean;
  currentSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  onClose: () => void;
}

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'recommended', label: 'Recommended (Trending & Bestsellers)' },
  { id: 'newest', label: "What's New / Fresh Drops" },
  { id: 'price_low_high', label: 'Price: Low to High' },
  { id: 'price_high_low', label: 'Price: High to Low' },
  { id: 'rating', label: 'Customer Rating (High to Low)' },
  { id: 'discount', label: 'Better Discount' },
];

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  currentSort,
  onSelectSort,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Sort By</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {SORT_OPTIONS.map((option) => {
              const isSelected = currentSort === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.7}
                  style={[styles.optionRow, isSelected && styles.selectedRow]}
                  onPress={() => {
                    onSelectSort(option.id);
                    onClose();
                  }}
                >
                  <Text style={[styles.optionLabel, isSelected && styles.selectedLabel]}>
                    {option.label}
                  </Text>
                  <View style={[styles.radioCircle, isSelected && styles.selectedRadio]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  title: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    paddingBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  selectedRow: {
    backgroundColor: COLORS.surfaceSubtle,
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  optionLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  selectedLabel: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
});
