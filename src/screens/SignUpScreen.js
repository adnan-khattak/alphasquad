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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';
import GradientBackground from '../components/GradientBackground';
import AnimatedCard from '../components/AnimatedCard';

const SignUpScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    const result = await signUp(
      formData.email.trim().toLowerCase(),
      formData.password,
      formData.fullName.trim()
    );

    if (result.success) {
      // Navigation will be handled by AuthContext state change
      // or user will need to verify email first
    }
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
      marginBottom: SPACING.lg,
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
    signupButton: {
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
    signupButtonText: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '700',
      color: colors.background,
    },
    disabledButton: {
      opacity: 0.6,
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
    loginPrompt: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginPromptText: {
      fontSize: FONT_SIZES.md,
      color: colors.textSecondary,
    },
    loginButton: {
      marginLeft: SPACING.sm,
    },
    loginButtonText: {
      fontSize: FONT_SIZES.md,
      color: colors.accent,
      fontWeight: '700',
    },
    backButton: {
      position: 'absolute',
      top: SPACING.xl,
      left: SPACING.xl,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
  });

  return (
    <GradientBackground colors={[colors.gradientStart, colors.gradientEnd]}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
        
        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {/* Header */}
              <AnimatedCard style={styles.header} delay={0}>
                <Text style={styles.logo}>📚</Text>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                  Join us and start tracking your reading progress
                </Text>
              </AnimatedCard>

              {/* Sign Up Form */}
              <AnimatedCard style={styles.form} delay={200}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={[styles.input, errors.fullName && { borderColor: colors.error, borderWidth: 1 }]}
                    value={formData.fullName}
                    onChangeText={(value) => handleInputChange('fullName', value)}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, errors.email && { borderColor: colors.error, borderWidth: 1 }]}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, errors.password && { borderColor: colors.error, borderWidth: 1 }]}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      placeholder="Create a password"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry={!showPassword}
                      returnKeyType="next"
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={colors.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, errors.confirmPassword && { borderColor: colors.error, borderWidth: 1 }]}
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      placeholder="Confirm your password"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry={!showConfirmPassword}
                      returnKeyType="done"
                      onSubmitEditing={handleSignUp}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={colors.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                </View>

                <TouchableOpacity
                  style={[styles.signupButton, loading && styles.disabledButton]}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  <Text style={styles.signupButtonText}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </TouchableOpacity>
              </AnimatedCard>

              {/* Login Prompt */}
              <AnimatedCard style={{ alignItems: 'center' }} delay={400}>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.loginPrompt}>
                  <Text style={styles.loginPromptText}>Already have an account?</Text>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </AnimatedCard>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default SignUpScreen;
