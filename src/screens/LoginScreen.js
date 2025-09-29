import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';

const LoginScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const result = await signIn(email.trim().toLowerCase(), password);
    if (result.success) {
      // Navigation will be handled by AuthContext state change
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address first');
      return;
    }
    // You can implement forgot password functionality here
    Alert.alert('Forgot Password', 'Password reset functionality will be implemented');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.xxl,
    },
    header: {
      alignItems: 'center',
      marginBottom: SPACING.xxxl,
    },
    logo: {
      fontSize: 64,
      marginBottom: SPACING.lg,
    },
    title: {
      fontSize: FONT_SIZES.xxxxl,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: SPACING.sm,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: FONT_SIZES.lg,
      color: colors.textSecondary,
      textAlign: 'center',
      fontWeight: '500',
    },
    form: {
      marginBottom: SPACING.xl,
    },
    inputGroup: {
      marginBottom: SPACING.xl,
    },
    label: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SPACING.md,
    },
    inputContainer: {
      position: 'relative',
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.xl,
      fontSize: FONT_SIZES.md,
      color: colors.textPrimary,
      borderWidth: 0,
      fontWeight: '500',
    },
    passwordToggle: {
      position: 'absolute',
      right: SPACING.lg,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
    errorText: {
      fontSize: FONT_SIZES.sm,
      color: colors.error,
      marginTop: SPACING.sm,
      fontWeight: '500',
    },
    loginButton: {
      backgroundColor: colors.accent,
      borderRadius: BORDER_RADIUS.xl,
      paddingVertical: SPACING.xl,
      alignItems: 'center',
      marginBottom: SPACING.lg,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    loginButtonText: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '700',
      color: colors.background,
    },
    disabledButton: {
      opacity: 0.6,
    },
    forgotPasswordButton: {
      alignItems: 'center',
      marginBottom: SPACING.xl,
    },
    forgotPasswordText: {
      fontSize: FONT_SIZES.md,
      color: colors.accent,
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: SPACING.xl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.textMuted,
    },
    dividerText: {
      marginHorizontal: SPACING.lg,
      fontSize: FONT_SIZES.sm,
      color: colors.textMuted,
      fontWeight: '500',
    },
    signupPrompt: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signupPromptText: {
      fontSize: FONT_SIZES.md,
      color: colors.textSecondary,
    },
    signupButton: {
      marginLeft: SPACING.sm,
    },
    signupButtonText: {
      fontSize: FONT_SIZES.md,
      color: colors.accent,
      fontWeight: '700',
    },
  });

  return (
    <GradientBackground colors={[colors.gradientStart, colors.gradientEnd]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
  
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingHorizontal: SPACING.xl,
              paddingVertical: SPACING.xxl,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: SPACING.xxxl }}>
              <Text style={{ fontSize: 56, marginBottom: SPACING.lg }}>📚</Text>
              <Text style={{
                fontSize: FONT_SIZES.xxxl,
                fontWeight: '800',
                color: colors.textPrimary,
                marginBottom: SPACING.sm,
              }}>
                Welcome Back
              </Text>
              <Text style={{
                fontSize: FONT_SIZES.md,
                color: colors.textSecondary,
                textAlign: 'center',
              }}>
                Sign in to continue your reading journey
              </Text>
            </View>
  
            {/* Email */}
            <View style={{ marginBottom: SPACING.lg }}>
              <Text style={{
                fontSize: FONT_SIZES.sm,
                fontWeight: '600',
                color: colors.textSecondary,
                marginBottom: SPACING.sm,
              }}>
                Email
              </Text>
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: BORDER_RADIUS.lg,
                paddingHorizontal: SPACING.lg,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <TextInput
                  style={{
                    flex: 1,
                    height: 50,
                    fontSize: FONT_SIZES.md,
                    color: colors.textPrimary,
                  }}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && (
                <Text style={{ fontSize: FONT_SIZES.sm, color: colors.error, marginTop: 4 }}>
                  {errors.email}
                </Text>
              )}
            </View>
  
            {/* Password */}
            <View style={{ marginBottom: SPACING.lg }}>
              <Text style={{
                fontSize: FONT_SIZES.sm,
                fontWeight: '600',
                color: colors.textSecondary,
                marginBottom: SPACING.sm,
              }}>
                Password
              </Text>
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: BORDER_RADIUS.lg,
                paddingHorizontal: SPACING.lg,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <TextInput
                  style={{
                    flex: 1,
                    height: 50,
                    fontSize: FONT_SIZES.md,
                    color: colors.textPrimary,
                  }}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={{ fontSize: FONT_SIZES.sm, color: colors.error, marginTop: 4 }}>
                  {errors.password}
                </Text>
              )}
            </View>
  
            {/* Sign In Button */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.accent,
                borderRadius: BORDER_RADIUS.lg,
                height: 52,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: SPACING.md,
                marginBottom: SPACING.lg,
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.25,
                shadowRadius: 5,
                elevation: 4,
              }}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={{
                fontSize: FONT_SIZES.lg,
                fontWeight: '700',
                color: colors.background,
              }}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
  
            {/* Forgot password */}
            <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'center', marginBottom: SPACING.xl }}>
              <Text style={{ fontSize: FONT_SIZES.sm, color: colors.accent, fontWeight: '600' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
  
            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.textMuted }} />
              <Text style={{ marginHorizontal: SPACING.md, color: colors.textMuted }}>or</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.textMuted }} />
            </View>
  
            {/* Sign Up */}
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: colors.textSecondary }}>Don’t have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{ marginLeft: 6, color: colors.accent, fontWeight: '700' }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
  
};

export default LoginScreen;
