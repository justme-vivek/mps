import React from 'react';
import { Text, View } from 'react-native';

export default function StatCard({ icon = null, value, label, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary-50 text-primary-700',
    accent: 'bg-accent-100 text-[#B45309]',
    success: 'bg-success-50 text-success',
  };
  return (
    <View className="flex-1 rounded-3xl border border-line bg-surface p-4">
      <View className={`h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</View>
      <Text className="mt-2.5 text-2xl font-extrabold text-ink">{value}</Text>
      <Text className="text-[12px] font-medium text-ink-muted">{label}</Text>
    </View>
  );
}
