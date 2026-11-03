import React from 'react';
import { Text, View } from 'react-native';

export default function SectionHeader({ title, subtitle, actionLabel = null, onAction = null }) {
  return (
    <View className="mb-3 flex-row items-end justify-between">
      <View className="flex-1">
        <Text className="text-lg font-extrabold text-ink">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-[13px] text-ink-muted">{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Text onPress={onAction} className="text-[13px] font-bold text-primary-600">
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}
