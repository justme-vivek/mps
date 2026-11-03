import React from 'react';
import { Pressable, View } from 'react-native';

export default function Card({ children, className = '', onPress = null }) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={({ pressed }) =>
          `rounded-3xl border border-line bg-surface p-4 shadow-sm ${pressed ? 'opacity-85' : ''} ${className}`
        }
      >
        {children}
      </Pressable>
    );
  }
  return <View className={`rounded-3xl border border-line bg-surface p-4 shadow-sm ${className}`}>{children}</View>;
}

