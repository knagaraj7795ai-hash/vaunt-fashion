import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { useUser } from '../context/UserContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    else if (phone.replace(/\s/g, '').length < 10) newErrors.phone = 'Enter a valid phone number';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await register(name.trim(), email.trim(), phone.trim(), password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Registration Failed', result.error || 'Try again');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brandLogo}>VAUNT</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join VAUNT for exclusive access and rewards</Text>
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
              placeholder="Enter your email"
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
              label="Password"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              }
              error={errors.password}
            />

            <Button
              title="CREATE ACCOUNT"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onPress={handleRegister}
              style={styles.registerBtn}
            />
          </View>

          {/* Benefits */}
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>VAUNT Member Benefits</Text>
            {[
              'Exclusive early access to new collections',
              'Earn Luxe Reward Points on every order',
              'Personalized style recommendations',
              'Priority customer support',
            ].map((benefit, i) => (
              <View key={i} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.emerald} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  backBtn: {
    marginBottom: SPACING.base,
    padding: 4,
    alignSelf: 'flex-start',
  },
  header: {
    marginBottom: SPACING.xl,
  },
  brandLogo: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 3,
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.display,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  registerBtn: {
    marginTop: SPACING.sm,
  },
  benefitsCard: {
    backgroundColor: COLORS.emeraldLight,
    padding: SPACING.base,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.2)',
  },
  benefitsTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.emerald,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  benefitText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  footerLink: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.accent,
  },
});
