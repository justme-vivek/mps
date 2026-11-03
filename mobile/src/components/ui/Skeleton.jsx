import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/** Pulsing placeholder block. */
export default function Skeleton({ className = '' }) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View className={`rounded-2xl bg-surface-sunken ${className}`} style={{ opacity }} />;
}
