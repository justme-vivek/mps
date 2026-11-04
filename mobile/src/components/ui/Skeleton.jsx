import React, { useEffect, useRef } from 'react';
import { Animated, Platform, View } from 'react-native';
import { cssInterop } from 'nativewind';

// Animated components are not NativeWind-aware by default; register once so
// `className` works on native and web alike.
const AnimatedView = Animated.createAnimatedComponent(View);
cssInterop(AnimatedView, { className: 'style' });

/** Pulsing placeholder block. */
export default function Skeleton({ className = '', style }) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== 'web';
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver }),
        Animated.timing(opacity, { toValue: 0.5, duration: 800, useNativeDriver }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <AnimatedView
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={`rounded-xl bg-surface-sunken ${className}`}
      style={[{ opacity }, style]}
    />
  );
}
