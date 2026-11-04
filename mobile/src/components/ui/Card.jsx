import React from 'react';
import { Pressable, View } from 'react-native';

/** Flat bordered card. Diary style: no shadows, 20px radius. */
export default function Card({ children, className = '', onPress = null, accessibilityLabel }) {
  const base = 'rounded-card border-[1.5px] border-line bg-surface p-4';
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className={`${base} active:opacity-85 ${className}`}
      >
        {children}
      </Pressable>
    );
  }
  return <View className={`${base} ${className}`}>{children}</View>;
}
