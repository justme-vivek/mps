import React from 'react';
import { Pressable } from 'react-native';
import Text from './Text';

/** Filter chip. The selected chip is solid ink; the rest are outlined. 44px tall. */
export default function Chip({ label, selected = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`min-h-[44px] justify-center rounded-full border-[1.5px] px-[18px] ${
        selected ? 'border-ink bg-ink' : 'border-line bg-surface'
      }`}
    >
      <Text className={`text-[14px] font-bold ${selected ? 'text-white' : 'text-ink'}`}>{label}</Text>
    </Pressable>
  );
}
