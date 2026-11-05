import React from 'react';
import { View } from 'react-native';
import Text from './Text';

/**
 * Big serif number with a plain label. `highlight` puts the highlighter
 * behind the number: use it on at most one stat per screen.
 */
export default function StatCard({ icon = null, value, label, highlight = false }) {
  return (
    <View className="w-full rounded-card border-[1.5px] border-line bg-surface px-4 py-3.5">
      <View className="flex-row">
        <Text className={`font-serif text-[34px] leading-10 text-ink ${highlight ? 'bg-accent px-1.5' : ''}`}>
          {value}
        </Text>
      </View>
      <View className="mt-1 flex-row items-center" style={{ gap: 6 }}>
        {icon}
        <Text className="flex-1 text-[14px] text-ink-soft">{label}</Text>
      </View>
    </View>
  );
}
