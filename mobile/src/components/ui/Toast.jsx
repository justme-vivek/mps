import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { CheckCircle2, Info, XCircle } from 'lucide-react-native';

const ToastContext = createContext(null);

const STYLES = {
  success: { bg: 'bg-success-50 border-success/30', icon: <CheckCircle2 size={18} color="#16A34A" />, text: 'text-success' },
  error: { bg: 'bg-danger-50 border-danger/30', icon: <XCircle size={18} color="#DC2626" />, text: 'text-danger' },
  info: { bg: 'bg-primary-50 border-primary/30', icon: <Info size={18} color="#4F46E5" />, text: 'text-primary-700' },
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  const hide = useCallback(() => {
    Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start();
  }, [opacity]);

  const show = useCallback(
    (message, type = 'info', duration = 2600) => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, type });
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timer.current = setTimeout(hide, duration);
    },
    [hide, opacity]
  );

  const style = STYLES[toast?.type] || STYLES.info;

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          className="absolute left-4 right-4 top-14 z-50"
          style={{ opacity }}
        >
          <View className={`flex-row items-center rounded-2xl border px-4 py-3 shadow-lg ${style.bg}`}>
            {style.icon}
            <Text className={`ml-2 flex-1 text-sm font-medium ${style.text}`} numberOfLines={3}>
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
