import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

/** Tap-ready list row with title, subtitle, optional right node and chevron. */
export default function ListRow({ title, subtitle, right = null, chevron = true, icon = null, onPress, className = '' }) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      className={({ pressed }) =>
        `flex-row items-center rounded-2xl border border-line bg-surface px-4 py-3.5 ${pressed ? 'opacity-80' : ''} ${className}`
      }
    >
      {icon}
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-ink" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 text-[13px] text-ink-muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
      {chevron && onPress ? <ChevronRight size={18} color="#9CA3AF" /> : null}
    </Wrapper>
  );
}

