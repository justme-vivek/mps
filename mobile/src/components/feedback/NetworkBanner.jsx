import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, Hourglass, WifiOff } from 'lucide-react-native';
import Text from '../ui/Text';
import { useNetwork } from '../../services/network';

const LOOKS = {
  offline: { bg: '#1B2A59', fg: '#FFFFFF', accent: '#FFE066', icon: WifiOff, text: "You're offline — showing saved content" },
  slow: { bg: '#FFE066', fg: '#1B2A59', accent: '#1B2A59', icon: Hourglass, text: 'Slow connection — content may take a moment' },
  back: { bg: '#0F6B38', fg: '#FFFFFF', accent: '#FFFFFF', icon: CheckCircle2, text: 'Back online' },
};

/**
 * Slim status strip under the status bar. Slides in for offline / slow
 * connections and confirms recovery for two seconds. Never blocks touches.
 */
export default function NetworkBanner() {
  const { online, slow } = useNetwork();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState(null);
  const wasOffline = useRef(false);
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer;
    if (!online) {
      wasOffline.current = true;
      setMode('offline');
    } else if (wasOffline.current) {
      wasOffline.current = false;
      setMode('back');
      timer = setTimeout(() => setMode(null), 2000);
    } else {
      setMode(slow ? 'slow' : null);
    }
    return () => clearTimeout(timer);
  }, [online, slow]);

  useEffect(() => {
    Animated.timing(slide, { toValue: mode ? 1 : 0, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [mode, slide]);

  const look = LOOKS[mode] || LOOKS.offline;
  const Icon = look.icon;

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        opacity: slide,
        transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [-48, 0] }) }],
      }}
    >
      <View
        style={{ backgroundColor: look.bg, paddingTop: Math.max(insets.top, 6), paddingBottom: 6 }}
        className="flex-row items-center justify-center px-4"
      >
        <Icon size={15} color={look.accent} />
        <Text className="ml-2 text-[13px] font-bold" style={{ color: look.fg }}>
          {look.text}
        </Text>
      </View>
    </Animated.View>
  );
}
