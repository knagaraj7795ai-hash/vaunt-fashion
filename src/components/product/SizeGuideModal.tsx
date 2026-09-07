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
import { COLORS, RADIUS, TYPOGRAPHY, SPACING } from '../../constants/theme';
import { Button } from '../common/Button';

interface SizeGuideModalProps {
  visible: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  visible,
  onClose,
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const chartData = [
    { size: 'S', chest: unit === 'in' ? '38"' : '96.5 cm', waist: unit === 'in' ? '30"' : '76.2 cm', length: unit === 'in' ? '27.5"' : '69.8 cm' },
    { size: 'M', chest: unit === 'in' ? '40"' : '101.6 cm', waist: unit === 'in' ? '32"' : '81.2 cm', length: unit === 'in' ? '28.5"' : '72.4 cm' },
    { size: 'L', chest: unit === 'in' ? '42"' : '106.7 cm', waist: unit === 'in' ? '34"' : '86.4 cm', length: unit === 'in' ? '29.5"' : '74.9 cm' },
    { size: 'XL', chest: unit === 'in' ? '44"' : '111.8 cm', waist: unit === 'in' ? '36"' : '91.4 cm', length: unit === 'in' ? '30.5"' : '77.5 cm' },
    { size: 'XXL', chest: unit === 'in' ? '46"' : '116.8 cm', waist: unit === 'in' ? '38"' : '96.5 cm', length: unit === 'in' ? '31.5"' : '80.0 cm' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Size & Measurement Guide</Text>
              <Text style={styles.subtitle}>Standard garment measurements</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Unit Switcher */}
          <View style={styles.unitSwitcher}>
            <TouchableOpacity
              style={[styles.unitTab, unit === 'in' && styles.activeUnitTab]}
              onPress={() => setUnit('in')}
            >
              <Text style={[styles.unitText, unit === 'in' && styles.activeUnitText]}>INCHES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitTab, unit === 'cm' && styles.activeUnitTab]}
              onPress={() => setUnit('cm')}
            >
              <Text style={[styles.unitText, unit === 'cm' && styles.activeUnitText]}>CENTIMETERS</Text>
            </TouchableOpacity>
          </View>

          {/* Table */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCol, styles.colHeader, { flex: 1 }]}>SIZE</Text>
              <Text style={[styles.tableCol, styles.colHeader, { flex: 1.5 }]}>CHEST</Text>
              <Text style={[styles.tableCol, styles.colHeader, { flex: 1.5 }]}>WAIST</Text>
              <Text style={[styles.tableCol, styles.colHeader, { flex: 1.5 }]}>LENGTH</Text>
            </View>

            <ScrollView style={styles.tableBody}>
              {chartData.map((row, idx) => (
                <View
                  key={row.size}
                  style={[styles.tableRow, idx % 2 === 1 && styles.alternateRow]}
                >
                  <Text style={[styles.tableCol, styles.sizeCol, { flex: 1 }]}>{row.size}</Text>
                  <Text style={[styles.tableCol, { flex: 1.5 }]}>{row.chest}</Text>
                  <Text style={[styles.tableCol, { flex: 1.5 }]}>{row.waist}</Text>
                  <Text style={[styles.tableCol, { flex: 1.5 }]}>{row.length}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.tipBox}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
            <Text style={styles.tipText}>
              For an oversized fit, choose your normal size. For a regular fit, consider sizing down.
            </Text>
          </View>

          <Button title="Got It" onPress={onClose} variant="primary" size="md" fullWidth />
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
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  unitSwitcher: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.sm,
    padding: 3,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  unitTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
  },
  activeUnitTab: {
    backgroundColor: COLORS.surface,
  },
  unitText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textMuted,
  },
  activeUnitText: {
    color: COLORS.textPrimary,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  colHeader: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textSecondary,
  },
  tableBody: {
    maxHeight: 180,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  alternateRow: {
    backgroundColor: COLORS.canvas,
  },
  tableCol: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  sizeCol: {
    fontWeight: '700',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceSubtle,
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: 20,
  },
  tipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
  },
});
