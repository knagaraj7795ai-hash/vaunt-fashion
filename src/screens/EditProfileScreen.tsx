import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { useUser } from '../context/UserContext';
import { Header } from '../components/common/Header';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, updateProfile, isGuest } = useUser();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [gender, setGender] = useState(user.gender || '');
  const [dob, setDob] = useState(user.dob || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string; phone?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gender: gender as any,
      dob: dob || undefined,
    });
    setLoading(false);
    Alert.alert('Profile Updated', 'Your profile has been saved successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  if (isGuest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
        <Header title="Edit Profile" showLocation={false} />
        <View style={styles.guestContainer}>
          <Ionicons name="person-add-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.guestTitle}>Guest Account</Text>
          <Text style={styles.guestSubtitle}>
            Sign in or create an account to edit your profile and save your preferences.
          </Text>
          <Button
            title="SIGN IN"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: SPACING.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Header title="Edit Profile" showLocation={false} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.avatarBadge}>
              <Ionicons name="camera" size={12} color="#FFF" />
            </View>
          </View>
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            leftIcon={<Ionicons name="person-outline" size={18} color={COLORS.textMuted} />}
            error={errors.name}
          />

          <Input
            label="Email Address"
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Ionicons name="mail-outline" size={18} color={COLORS.textMuted} />}
            error={errors.email}
          />

          <Input
            label="Phone Number"
            placeholder="Enter 10-digit phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
            leftIcon={<Ionicons name="call-outline" size={18} color={COLORS.textMuted} />}
            error={errors.phone}
          />

          <Input
            label="Gender (Optional)"
            placeholder="Male / Female / Other"
            value={gender}
            onChangeText={setGender}
            autoCapitalize="words"
            leftIcon={<Ionicons name="male-female-outline" size={18} color={COLORS.textMuted} />}
          />

          <Input
            label="Date of Birth (Optional)"
            placeholder="DD/MM/YYYY"
            value={dob}
            onChangeText={setDob}
            keyboardType="numbers-and-punctuation"
            leftIcon={<Ionicons name="calendar-outline" size={18} color={COLORS.textMuted} />}
          />
        </View>

        <Button
          title="SAVE CHANGES"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onPress={handleSave}
          style={styles.saveBtn}
        />

        <Button
          title="CANCEL"
          variant="ghost"
          size="md"
          fullWidth
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
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
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxxl,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  avatarHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  saveBtn: {
    marginBottom: SPACING.base,
  },
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  guestTitle: {
    ...TYPOGRAPHY.title1,
    color: COLORS.textPrimary,
    marginTop: SPACING.base,
    marginBottom: SPACING.sm,
  },
  guestSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
