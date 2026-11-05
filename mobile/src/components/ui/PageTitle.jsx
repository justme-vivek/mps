import React from 'react';
import { View } from 'react-native';
import Text from './Text';

/** Screen title in the serif face, with an optional one-line description. */
export default function PageTitle({ title, subtitle = null, right = null, className = '' }) {
  return (
    <View className={`mb-4 flex-row items-end justify-between ${className}`}>
      <View className="min-w-0 flex-1 pr-3">
        <Text accessibilityRole="header" className="font-serif text-[30px] leading-9 text-ink">
          {title}
        </Text>
        {subtitle ? <Text className="mt-1 text-[15px] leading-5 text-ink-muted">{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}
