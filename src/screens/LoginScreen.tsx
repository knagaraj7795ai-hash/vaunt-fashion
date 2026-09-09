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
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login, loginAsGuest } = useUser();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ field?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { field?: string; password?: string } = {};
    if (!emailOrPhone.trim()) {
      newErrors.field = 'Email or phone number is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await login(emailOrPhone.trim(), password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Invalid credentials');
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brandLogo}>VAUNT</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account to continue</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email or Phone Number"
              placeholder="Enter email or phone"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Ionicons name="person-outline" size={18} color={COLORS.textMuted} />}
              error={errors.field}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
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
              title="SIGN IN"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onPress={handleLogin}
              style={styles.loginBtn}
            />
          </View>

          {/* Demo Credentials */}
          <View style={styles.demoCard}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.accent} />
            <View style={styles.demoTextContainer}>
              <Text style={styles.demoTitle}>Demo Credentials</Text>
              <Text style={styles.demoText}>Email: aryan.sharma@example.in</Text>
              <Text style={styles.demoText}>Password: vaunt123</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.guestBtn}
            onPress={() => loginAsGuest()}
            activeOpacity={0.7}
          >
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
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
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    marginBottom: SPACING.xxl,
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
  loginBtn: {
    marginTop: SPACING.sm,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EFF6FF',
    padding: SPACING.base,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  demoTextContainer: {
    flex: 1,
  },
  demoTitle: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.accent,
    marginBottom: 4,
  },
  demoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  footerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  footerLink: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.accent,
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  guestText: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.textMuted,
  },
});
