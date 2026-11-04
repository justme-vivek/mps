import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';
import { useIsFetching } from '@tanstack/react-query';

/**
 * Thin indeterminate bar at the very top while anything is fetching. It only
 * appears after 350ms, so quick loads (and cached screens) never flash it.
 */
export default function TopProgress() {
  const fetching = useIsFetching() > 0;
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const run = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => setVisible(fetching), fetching ? 350 : 150);
    return () => clearTimeout(t);
  }, [fetching]);

  useEffect(() => {
    if (!visible) return undefined;
    const loop = Animated.loop(
      Animated.timing(run, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.cubic), useNativeDriver: Platform.OS !== 'web' })
    );
    loop.start();
    return () => loop.stop();
  }, [visible, run]);

  if (!visible) return null;
  const bar = width * 0.35;
  return (
    <View
      pointerEvents="none"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 90, overflow: 'hidden' }}
    >
      <Animated.View
        style={{
          width: bar,
          height: 3,
          backgroundColor: '#2A44B8',
          borderRadius: 2,
          transform: [{ translateX: run.interpolate({ inputRange: [0, 1], outputRange: [-bar, width] }) }],
        }}
      />
    </View>
  );
}
