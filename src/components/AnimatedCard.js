import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedCard = ({ children, style, delay = 0, ...props }) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
  }, []);

  const cardStyles = [
    styles.card,
    {
      backgroundColor: colors.surface,
      shadowColor: colors.textPrimary,
    },
    style,
  ];

  return (
    <Animated.View
      style={[
        cardStyles,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
});

export default AnimatedCard;
