import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterState, Fit, Occasion, Gender } from '../../types/product';
import { COLORS, RADIUS, TYPOGRAPHY, SPACING } from '../../constants/theme';
import { Button } from '../common/Button';

interface FilterModalProps {
  visible: boolean;
  filters: Partial<FilterState>;
  onApplyFilters: (newFilters: Partial<FilterState>) => void;
  onClose: () => void;
  brands: { id: string; name: string }[];
}

type TabType =
  | 'Brand'
  | 'Gender'
  | 'Size'
  | 'Color'
  | 'Price'
  | 'Rating'
  | 'Discount'
  | 'Fit'
  | 'Occasion';

const TABS: TabType[] = [
  'Brand',
  'Gender',
  'Size',
  'Color',
  'Price',
  'Rating',
  'Discount',
  'Fit',
  'Occasion',
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
const COLORS_LIST = [
  'Obsidian Black',
  'Vintage White',
  'Sage Green',
  'Sand Dune',
  'Sky Blue',
  'Raw Deep Indigo',
  'Olive Slate',
  'Charcoal Black',
  'Champagne',
  'Royal Emerald',
  'Blush Pink',
  'Chalk White',
];
const FITS: Fit[] = ['Slim', 'Regular', 'Relaxed', 'Oversized', 'Tailored'];
const OCCASIONS: Occasion[] = ['Casual', 'Formal', 'Party', 'Festive', 'Sports', 'Work'];
const GENDERS: { id: Gender; label: string }[] = [
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'kids', label: 'Kids' },
  { id: 'unisex', label: 'Unisex' },
];

const PRICE_TIERS: { label: string; range: [number, number] }[] = [
  { label: 'Under ₹999', range: [0, 999] },
  { label: '₹1,000 to ₹1,999', range: [1000, 1999] },
  { label: '₹2,000 to ₹3,499', range: [2000, 3499] },
  { label: '₹3,500 and Above', range: [3500, 20000] },
];

const RATINGS = [
  { label: '4.5★ & above', value: 4.5 },
  { label: '4.0★ & above', value: 4.0 },
  { label: '3.5★ & above', value: 3.5 },
];

const DISCOUNTS = [
  { label: '50% or more', value: 50 },
  { label: '40% or more', value: 40 },
  { label: '30% or more', value: 30 },
  { label: '20% or more', value: 20 },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  onApplyFilters,
  onClose,
  brands,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('Brand');
  const [draft, setDraft] = useState<Partial<FilterState>>(filters);

  // Sync draft when opened
  React.useEffect(() => {
    setDraft(filters);
  }, [filters, visible]);

  const toggleArrayItem = <T,>(arr: T[] | undefined, item: T): T[] => {
    const list = arr ? [...arr] : [];
    const index = list.indexOf(item);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(item);
    }
    return list;
  };

  const clearAll = () => {
    setDraft({});
  };

  const handleApply = () => {
    onApplyFilters(draft);
    onClose();
  };

  // Helper for active filter count per tab
  const getTabBadgeCount = (tab: TabType): number => {
    switch (tab) {
      case 'Brand':
        return draft.brandIds?.length || 0;
      case 'Gender':
        return draft.genders?.length || 0;
      case 'Size':
        return draft.sizes?.length || 0;
      case 'Color':
        return draft.colors?.length || 0;
      case 'Price':
        return draft.priceRange ? 1 : 0;
      case 'Rating':
        return draft.minRating ? 1 : 0;
      case 'Discount':
        return draft.minDiscount ? 1 : 0;
      case 'Fit':
        return draft.fits?.length || 0;
      case 'Occasion':
        return draft.occasions?.length || 0;
      default:
        return 0;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Brand':
        return (
          <ScrollView style={styles.optionScrollView}>
            {brands.map((b) => {
              const checked = draft.brandIds?.includes(b.id) || false;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={styles.checkboxRow}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      brandIds: toggleArrayItem(prev.brandIds, b.id),
                    }))
                  }
                >
                  <View style={[styles.checkbox, checked && styles.checkedBox]}>
                    {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>{b.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        );

      case 'Gender':
        return (
          <ScrollView style={styles.optionScrollView}>
            {GENDERS.map((g) => {
              const checked = draft.genders?.includes(g.id) || false;
              return (
                <TouchableOpacity
                  key={g.id}
                  style={styles.checkboxRow}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      genders: toggleArrayItem(prev.genders, g.id),
                    }))
                  }
                >
                  <View style={[styles.checkbox, checked && styles.checkedBox]}>
                    {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>{g.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        );

      case 'Size':
        return (
          <ScrollView style={styles.optionScrollView}>
            <View style={styles.chipsWrap}>
              {SIZES.map((sz) => {
                const selected = draft.sizes?.includes(sz) || false;
                return (
                  <TouchableOpacity
                    key={sz}
                    style={[styles.chipPill, selected && styles.selectedChip]}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        sizes: toggleArrayItem(prev.sizes, sz),
                      }))
                    }
                  >
                    <Text style={[styles.chipText, selected && styles.selectedChipText]}>
                      {sz}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        );

      case 'Color':
        return (
          <ScrollView style={styles.optionScrollView}>
            {COLORS_LIST.map((colorName) => {
              const checked = draft.colors?.includes(colorName) || false;
              return (
                <TouchableOpacity
                  key={colorName}
                  style={styles.checkboxRow}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      colors: toggleArrayItem(prev.colors, colorName),
                    }))
                  }
                >
                  <View style={[styles.checkbox, checked && styles.checkedBox]}>
                    {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>{colorName}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        );

      case 'Price':
        return (
          <ScrollView style={styles.optionScrollView}>
            {PRICE_TIERS.map((tier, idx) => {
              const checked =
                draft.priceRange &&
                draft.priceRange[0] === tier.range[0] &&
                draft.priceRange[1] === tier.range[1];

              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.checkboxRow}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      priceRange: checked ? undefined : tier.range,
                    }))
                  }
                >
                  <View style={[styles.radio, checked && styles.checkedRadio]}>
                    {checked && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.checkboxLabel}>{tier.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        );

      case 'Rating':
        return (
          <ScrollView style={styles.optionScrollView}>
            {RATINGS.map((r, idx) => {
              const checked = draft.minRating === r.value;
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.checkboxRow}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      minRating: checked ? undefined : r.value,
                    }))
                  }
                >
                  <View style={[styles.radio, checked && styles.checkedRadio]}>
                    {checked && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.checkboxLabel}>{r.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        );

      case 'Discount':
        return (
          <ScrollView style={styles.optionScrollView}>
            {DISCOUNTS.map((d, idx) => {
              const checked = draft.minDiscount === d.value;
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.checkboxRow}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      minDiscount: checked ? undefined : d.value,
                    }))
                  }
                >
                  <View style={[styles.radio, checked && styles.checkedRadio]}>
                    {checked && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.checkboxLabel}>{d.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        );

      case 'Fit':
        return (
          <ScrollView style={styles.optionScrollView}>
            {FITS.map((fit) => {
              const checked = draft.fits?.includes(fit) || false;
              return (
                <TouchableOpacity
                  key={fit}
                  style={styles.checkboxRow}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      fits: toggleArrayItem(prev.fits, fit),
                    }))
                  }
                >
                  <View style={[styles.checkbox, checked && styles.checkedBox]}>
                    {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>{fit}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        );

      case 'Occasion':
        return (
          <ScrollView style={styles.optionScrollView}>
            {OCCASIONS.map((occ) => {
              const checked = draft.occasions?.includes(occ) || false;
              return (
                <TouchableOpacity
                  key={occ}
                  style={styles.checkboxRow}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      occasions: toggleArrayItem(prev.occasions, occ),
                    }))
                  }
                >
                  <View style={[styles.checkbox, checked && styles.checkedBox]}>
                    {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>{occ}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FILTERS</Text>
          <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
            <Text style={styles.clearText}>CLEAR ALL</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* 2-Pane Split */}
        <View style={styles.splitBody}>
          {/* Left Vertical Tabs */}
          <View style={styles.leftPane}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                const count = getTabBadgeCount(tab);

                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tabItem, isActive && styles.activeTabItem]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                      {tab}
                    </Text>
                    {count > 0 && (
                      <View style={styles.tabBadge}>
                        <Text style={styles.tabBadgeText}>{count}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Right Options Pane */}
          <View style={styles.rightPane}>{renderTabContent()}</View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>CLOSE</Text>
          </TouchableOpacity>
          <Button
            title="APPLY"
            variant="primary"
            size="md"
            onPress={handleApply}
            style={styles.applyBtn}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingTop: 44,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  clearBtn: {
    marginLeft: 'auto',
    marginRight: 16,
  },
  clearText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.rose,
  },
  closeBtn: {
    padding: 4,
  },
  splitBody: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPane: {
    width: '35%',
    backgroundColor: COLORS.surfaceSubtle,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  tabItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  activeTabItem: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  tabLabel: {
    ...TYPOGRAPHY.captionBold,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  activeTabLabel: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  tabBadge: {
    backgroundColor: COLORS.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  rightPane: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  optionScrollView: {
    padding: SPACING.base,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkedRadio: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipPill: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: RADIUS.md,
    height: 48,
  },
  cancelBtnText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
    letterSpacing: 0.8,
  },
  applyBtn: {
    flex: 1,
    height: 48,
  },
});
