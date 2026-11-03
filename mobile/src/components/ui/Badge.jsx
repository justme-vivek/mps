import React from 'react';
import { Text, View } from 'react-native';

const TONES = {
  primary: 'bg-primary-50 text-primary-700',
  accent: 'bg-accent-100 text-[#B45309]',
  danger: 'bg-danger-50 text-danger',
  success: 'bg-success-50 text-success',
  neutral: 'bg-surface-sunken text-ink-soft',
};

export default function Badge({ label, tone = 'primary', className = '' }) {
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${TONES[tone]} ${className}`}>
      <Text className="text-[11px] font-bold">{label}</Text>
    </View>
  );
}
