import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Address, AddressType } from '../types/address';
import { useAddress } from '../context/AddressContext';
import { Header } from '../components/common/Header';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

type RouteProps = RouteProp<RootStackParamList, 'AddressManagement'>;

export const AddressManagementScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { selectMode } = route.params || {};

  const {
    addresses,
    selectedAddress,
    selectAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddress();

  const [formVisible, setFormVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [type, setType] = useState<AddressType>('Home');
  const [isDefault, setIsDefault] = useState(false);

  const openAddForm = () => {
    setEditingAddress(null);
    setName('Aryan Sharma');
    setMobile('9876543210');
    setHouseFlat('');
    setStreet('');
    setArea('');
    setCity('Bengaluru');
    setState('Karnataka');
    setPincode('560102');
    setType('Home');
    setIsDefault(addresses.length === 0);
    setFormVisible(true);
  };

  const openEditForm = (addr: Address) => {
    setEditingAddress(addr);
    setName(addr.name);
    setMobile(addr.mobile);
    setHouseFlat(addr.houseFlat);
    setStreet(addr.street);
    setArea(addr.area);
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setType(addr.type);
    setIsDefault(addr.isDefault);
    setFormVisible(true);
  };

  const handleSaveAddress = async () => {
    if (!name.trim() || !mobile.trim() || !houseFlat.trim() || !pincode.trim() || !city.trim()) {
      Alert.alert('Incomplete Details', 'Please fill in all required address fields.');
      return;
    }

    if (editingAddress) {
      await updateAddress({
        ...editingAddress,
        name,
        mobile,
        houseFlat,
        street,
        area,
        city,
        state,
        pincode,
        type,
        isDefault,
      });
    } else {
      await addAddress({
        name,
        mobile,
        houseFlat,
        street,
        area,
        city,
        state,
        pincode,
        type,
        isDefault,
      });
    }

    setFormVisible(false);
  };

  const handleDelete = (addr: Address) => {
    Alert.alert('Delete Address', `Are you sure you want to delete ${addr.type} address?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteAddress(addr.id),
      },
    ]);
  };

  const handleSelect = (addr: Address) => {
    selectAddress(addr);
    if (selectMode) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header showBack title="Manage Addresses" showLocation={false} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Add Address CTA */}
        <TouchableOpacity style={styles.addCard} onPress={openAddForm} activeOpacity={0.8}>
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          <Text style={styles.addCardText}>ADD NEW ADDRESS</Text>
        </TouchableOpacity>

        {/* Address List */}
        <View style={styles.list}>
          {addresses.map((addr) => {
            const isSelected = selectedAddress?.id === addr.id;

            return (
              <TouchableOpacity
                key={addr.id}
                style={[styles.addressCard, isSelected && styles.selectedCard]}
                onPress={() => handleSelect(addr)}
                activeOpacity={0.9}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Text style={styles.addrName}>{addr.name}</Text>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{addr.type}</Text>
                    </View>
                    {addr.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                      </View>
                    )}
                  </View>

                  {selectMode && (
                    <View style={[styles.selectCircle, isSelected && styles.selectCircleActive]}>
                      {isSelected && <View style={styles.dot} />}
                    </View>
                  )}
                </View>

                <Text style={styles.addrText}>
                  {addr.houseFlat}, {addr.street}, {addr.area}
                </Text>
                <Text style={styles.addrText}>
                  {addr.city}, {addr.state} - {addr.pincode}
                </Text>
                <Text style={styles.mobileText}>Mobile: {addr.mobile}</Text>

                {/* Actions */}
                <View style={styles.actionsRow}>
                  {!addr.isDefault && (
                    <TouchableOpacity
                      onPress={() => setDefaultAddress(addr.id)}
                      style={styles.actionBtn}
                    >
                      <Text style={styles.actionBtnText}>Make Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => openEditForm(addr)} style={styles.actionBtn}>
                    <Text style={styles.actionBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(addr)} style={styles.actionBtn}>
                    <Text style={[styles.actionBtnText, { color: COLORS.rose }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomBuffer} />
      </ScrollView>

      {/* Add / Edit Address Modal */}
      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </Text>
            <TouchableOpacity onPress={() => setFormVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
            <Input label="Contact Name *" value={name} onChangeText={setName} />
            <Input
              label="10-Digit Mobile Number *"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <Input
              label="House / Flat / Building Name *"
              value={houseFlat}
              onChangeText={setHouseFlat}
            />
            <Input label="Street / Road / Colony" value={street} onChangeText={setStreet} />
            <Input label="Area / Sector / Landmark" value={area} onChangeText={setArea} />
            <View style={styles.twoCol}>
              <Input
                label="City *"
                value={city}
                onChangeText={setCity}
                containerStyle={{ flex: 1 }}
              />
              <Input
                label="PIN Code *"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
                containerStyle={{ flex: 1 }}
              />
            </View>
            <Input label="State" value={state} onChangeText={setState} />

            {/* Address Type */}
            <Text style={styles.fieldLabel}>Address Type</Text>
            <View style={styles.typeSelectorRow}>
              {(['Home', 'Work', 'Other'] as AddressType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeOption, type === t && styles.activeTypeOption]}
                  onPress={() => setType(t)}
                >
                  <Text style={[styles.typeOptionText, type === t && styles.activeTypeOptionText]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Default toggle */}
            <TouchableOpacity
              style={styles.defaultToggleRow}
              onPress={() => setIsDefault(!isDefault)}
            >
              <Ionicons
                name={isDefault ? 'checkbox' : 'square-outline'}
                size={22}
                color={isDefault ? COLORS.primary : COLORS.textMuted}
              />
              <Text style={styles.defaultToggleLabel}>Make this my default shipping address</Text>
            </TouchableOpacity>

            <Button
              title="SAVE ADDRESS"
              variant="primary"
              size="lg"
              onPress={handleSaveAddress}
              style={styles.saveBtn}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    padding: SPACING.base,
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
  },
  addCardText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  list: {
    gap: 12,
  },
  addressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addrName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  typeBadge: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  typeBadgeText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
  },
  defaultBadge: {
    backgroundColor: COLORS.amberLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  defaultBadgeText: {
    ...TYPOGRAPHY.micro,
    color: COLORS.amber,
    fontWeight: '800',
  },
  selectCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectCircleActive: {
    borderColor: COLORS.primary,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  addrText: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  mobileText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  actionBtn: {
    paddingVertical: 4,
  },
  actionBtnText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textPrimary,
  },
  bottomBuffer: {
    height: 50,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    ...TYPOGRAPHY.title2,
    color: COLORS.textPrimary,
  },
  modalForm: {
    padding: SPACING.base,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldLabel: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSubtle,
  },
  activeTypeOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeOptionText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textSecondary,
  },
  activeTypeOptionText: {
    color: '#FFFFFF',
  },
  defaultToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 12,
  },
  defaultToggleLabel: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  saveBtn: {
    marginTop: 16,
    marginBottom: 40,
  },
});
