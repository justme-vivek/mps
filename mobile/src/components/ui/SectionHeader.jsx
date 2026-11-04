import React from 'react';
import { Pressable, View } from 'react-native';
import Text from './Text';

/** Serif section title with an optional "See all" action (44px tap target). */
export default function SectionHeader({ title, subtitle, actionLabel = null, onAction = null }) {
  return (
    <View className="mb-1 min-h-[44px] flex-row items-center justify-between">
      <View className="flex-1 pr-3">
        <Text className="font-serif text-[22px] leading-7 text-ink">{title}</Text>
        {subtitle ? <Text className="text-[13px] text-ink-muted">{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="link"
          accessibilityLabel={`${actionLabel}: ${title}`}
          className="min-h-[44px] justify-center px-1"
        >
          <Text className="text-[15px] font-bold text-primary">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
