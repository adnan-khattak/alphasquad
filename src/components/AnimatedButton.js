import React from 'react';
import { Pressable, Animated } from 'react-native';

const AnimatedButton = ({ 
  children, 
  onPress, 
  style, 
  disabled = false,
  ...props 
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={({ pressed }) => [
          style,
          disabled && { opacity: 0.6 },
        ]}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedButton;
