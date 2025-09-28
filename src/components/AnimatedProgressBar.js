import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const AnimatedProgressBar = ({ 
  progress, 
  height = 6, 
  backgroundColor, 
  progressColor,
  borderRadius = 3,
  duration = 800,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [progress, duration]);

  return (
    <View
      style={{
        height,
        backgroundColor,
        borderRadius,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          height: '100%',
          backgroundColor: progressColor,
          borderRadius,
          width: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </View>
  );
};

export default AnimatedProgressBar;
