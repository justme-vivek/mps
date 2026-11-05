import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';
import { cssInterop } from 'nativewind';

// Animated components are not NativeWind-aware by default; register once so
// `className` works on native and web alike.
const AnimatedView = Animated.createAnimatedComponent(View);
cssInterop(AnimatedView, { className: 'style' });

/**
 * Placeholder block with a soft light sweep ("shimmer") — the same loading
 * language video/feed apps use. Compose it into screen-shaped skeletons.
 */
export default function Skeleton({ className = '', style }) {
  const [width, setWidth] = useState(0);
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1300,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    loop.start();
    return () => loop.stop();
  }, [sweep]);

  const bar = Math.max(width * 0.6, 80);
  const translateX = sweep.interpolate({ inputRange: [0, 1], outputRange: [-bar, width + bar] });

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      className={`overflow-hidden rounded-xl bg-surface-sunken ${className}`}
      style={style}
    >
      {width > 0 ? (
        <AnimatedView
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: bar,
            backgroundColor: 'rgba(255,255,255,0.55)',
            transform: [{ translateX }, { skewX: '-18deg' }],
          }}
        />
      ) : null}
    </View>
  );
}
