import React from 'react';
import { View } from 'react-native';
import Text from './Text';

// Status is always a word as well as a colour, never colour alone.
const TONES = {
  primary: ['bg-primary-50', 'text-primary-700'],
  accent: ['bg-accent-100', 'text-accent-ink'],
  danger: ['bg-danger-50', 'text-danger'],
  success: ['bg-success-50', 'text-success'],
  neutral: ['bg-surface-sunken', 'text-ink-soft'],
  // The highlighter: used only for what is new.
  marker: ['bg-accent', 'text-ink'],
};

export default function Badge({ label, tone = 'primary', className = '' }) {
  const [bg, text] = TONES[tone] || TONES.primary;
  return (
    <View className={`self-start rounded-md px-2.5 py-1 ${bg} ${className}`}>
      <Text className={`text-[12px] font-bold ${text}`}>{label}</Text>
    </View>
  );
}
