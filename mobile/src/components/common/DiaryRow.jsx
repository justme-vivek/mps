import React from 'react';
import { Pressable, View } from 'react-native';
import Text from '../ui/Text';
import { useBreakpoint } from '../../hooks/useBreakpoint';

/**
 * The signature element: one line of the school diary.
 * Date sits in the margin column, a red margin line runs down the row, and a
 * ruled line closes it. Stack rows to get the continuous ruled page.
 */
export default function DiaryRow({
  date,
  title,
  subtitle = null,
  isNew = false,
  badges = null,
  right = null,
  onPress = null,
  first = false,
  accessibilityLabel,
}) {
  const { dateWidth } = useBreakpoint();
  const d = new Date(date);
  const valid = !Number.isNaN(d.getTime());
  const day = valid ? String(d.getDate()).padStart(2, '0') : '--';
  const month = valid ? d.toLocaleString('en', { month: 'short' }) : '';
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? accessibilityLabel || title : undefined}
      className={`relative min-h-[68px] flex-row items-center border-b-[1.5px] border-line bg-surface active:bg-surface-sunken ${
        first ? 'border-t-[1.5px]' : ''
      }`}
    >
      {/* the red margin line */}
      <View
        pointerEvents="none"
        className="absolute bottom-0 top-0 w-[1.5px] bg-margin"
        style={{ left: dateWidth }}
      />
      <View style={{ width: dateWidth }} className="items-center">
        <Text className="font-serif text-[22px] leading-6 text-ink">{day}</Text>
        <Text className="text-[12px] text-ink-muted">{month}</Text>
      </View>
      <View className="min-w-0 flex-1 py-3 pl-4 pr-1">
        <Text className="text-[15px] font-bold leading-5 text-ink" numberOfLines={2}>
          {isNew ? <Text className="bg-accent text-ink">{' New '}</Text> : null}
          {isNew ? ' ' : ''}
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 text-[13px] leading-[18px] text-ink-muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        {badges ? (
          <View className="mt-1.5 flex-row flex-wrap" style={{ gap: 6 }}>
            {badges}
          </View>
        ) : null}
      </View>
      {right}
    </Wrapper>
  );
}
