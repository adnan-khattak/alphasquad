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
    <GradientBackground colors={[colors.gradientStart, colors.gradientEnd]}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
        
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
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  Sign in to continue your reading journey
                </Text>
              </AnimatedCard>

              {/* Login Form */}
              <AnimatedCard style={styles.form} delay={200}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, errors.email && { borderColor: colors.error, borderWidth: 1 }]}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                    />
                  </View>
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, errors.password && { borderColor: colors.error, borderWidth: 1 }]}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry={!showPassword}
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
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

                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </AnimatedCard>

              {/* Sign Up Prompt */}
              <AnimatedCard style={{ alignItems: 'center' }} delay={400}>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.signupPrompt}>
                  <Text style={styles.signupPromptText}>Don't have an account?</Text>
                  <TouchableOpacity
                    style={styles.signupButton}
                    onPress={() => navigation.navigate('SignUp')}
                  >
                    <Text style={styles.signupButtonText}>Sign Up</Text>
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

export default LoginScreen;
