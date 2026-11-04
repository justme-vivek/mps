import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, Platform, View } from 'react-native';
import Text from './Text';
import { CheckCircle2, Info, XCircle } from 'lucide-react-native';
import { colors } from '../../theme/tokens';

const ToastContext = createContext(null);

const STYLES = {
  success: { bg: 'bg-success-50 border-success/40', icon: <CheckCircle2 size={18} color={colors.success} />, text: 'text-success' },
  error: { bg: 'bg-danger-50 border-danger/40', icon: <XCircle size={18} color={colors.danger} />, text: 'text-danger' },
  info: { bg: 'bg-primary-50 border-primary/40', icon: <Info size={18} color={colors.pen} />, text: 'text-primary-700' },
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);
  const useNativeDriver = Platform.OS !== 'web';

  const hide = useCallback(() => {
    Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver }).start();
  }, [opacity, useNativeDriver]);

  const show = useCallback(
    (message, type = 'info', duration = 2600) => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, type });
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver }).start();
      timer.current = setTimeout(hide, duration);
    },
    [hide, opacity, useNativeDriver]
  );

  const style = STYLES[toast?.type] || STYLES.info;

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          accessibilityLiveRegion="polite"
          style={{ opacity, position: 'absolute', left: 16, right: 16, top: 56, zIndex: 50, alignItems: 'center' }}
        >
          <View className={`w-full max-w-[560px] flex-row items-center rounded-2xl border-[1.5px] px-4 py-3 ${style.bg}`}>
            {style.icon}
            <Text className={`ml-2 flex-1 text-[14px] font-bold ${style.text}`} numberOfLines={3}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
