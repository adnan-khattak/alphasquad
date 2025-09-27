import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZES } from '../constants/dimensions';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to auth screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.content}>
        {/* Minimalist Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          <Text style={styles.logoText}>α</Text>
          <Text style={styles.brandText}>ALPHA</Text>
          <View style={styles.line} />
        </Animated.View>

        {/* Minimal loading indicator */}
        <Animated.View
          style={[
            styles.loadingContainer,
            { opacity: fadeAnim },
          ]}
        >
          <View style={styles.minimalLoader} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoText: {
    fontSize: 80,
    fontWeight: '300',
    color: COLORS.accent,
    marginBottom: SPACING.lg,
  },
  brandText: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '300',
    color: COLORS.textPrimary,
    letterSpacing: 8,
    marginBottom: SPACING.lg,
  },
  line: {
    width: 60,
    height: 1,
    backgroundColor: COLORS.accent,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: SPACING.xxl,
    alignItems: 'center',
  },
  minimalLoader: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.accent,
    borderRadius: 1,
  },
});

export default SplashScreen;

