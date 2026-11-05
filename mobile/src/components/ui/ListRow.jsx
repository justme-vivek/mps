import React from 'react';
import { Pressable, View } from 'react-native';
import Text from './Text';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/tokens';

/** Tap-ready list row with title, subtitle, optional right node and chevron. */
export default function ListRow({ title, subtitle, right = null, chevron = true, icon = null, onPress, className = '' }) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? title : undefined}
      className={`min-h-[56px] flex-row items-center rounded-2xl border-[1.5px] border-line bg-surface px-4 py-3 active:opacity-80 ${className}`}
    >
      {icon}
      <View className="flex-1">
        <Text className="text-[15px] font-bold text-ink" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 text-[13px] text-ink-muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
      {chevron && onPress ? <ChevronRight size={18} color={colors.inkFaint} /> : null}
    </Wrapper>
  );
}
