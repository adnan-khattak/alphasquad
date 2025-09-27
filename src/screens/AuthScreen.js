import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Home');
    }, 1500);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>α</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Welcome back' : 'Join alpha squad'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
            />

            {!isLogin && (
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
              />
            )}

            <TouchableOpacity
              style={[styles.authButton, loading && styles.disabledButton]}
              onPress={handleAuth}
              disabled={loading}
            >
              <Text style={styles.authButtonText}>
                {loading
                  ? 'Processing...'
                  : isLogin
                  ? 'Login'
                  : 'Sign up'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleAuthMode}
            >
              <Text style={styles.toggleText}>
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: 60,
    fontWeight: '300',
    color: COLORS.accent,
    marginBottom: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
  formContainer: {
    paddingHorizontal: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  authButton: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  disabledButton: {
    opacity: 0.6,
  },
  authButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.background,
  },
  toggleButton: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  toggleText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});

export default AuthScreen;

