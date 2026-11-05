import React from 'react';
import { View } from 'react-native';
import Skeleton from '../ui/Skeleton';
import { useBreakpoint } from '../../hooks/useBreakpoint';

/** Ruled-paper row placeholder: date column, margin line, two text lines. */
export function DiaryRowSkeleton({ count = 4 }) {
  const { dateWidth } = useBreakpoint();
  return (
    <View className="border-t-[1.5px] border-line">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} className="relative min-h-[76px] flex-row items-center border-b-[1.5px] border-line bg-surface">
          <View className="absolute bottom-0 top-0 w-[1.5px] bg-margin/30" style={{ left: dateWidth }} />
          <View style={{ width: dateWidth }} className="items-center">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="mt-1.5 h-3 w-7" />
          </View>
          <View className="flex-1 py-3 pl-4 pr-4">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="mt-2 h-3 w-3/5" />
          </View>
        </View>
      ))}
    </View>
  );
}

/** Admin EntityCard placeholder. */
export function ListCardSkeleton({ count = 4, thumb = false }) {
  return (
    <View style={{ gap: 12 }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} className="flex-row items-center rounded-2xl border-[1.5px] border-line bg-surface p-3.5">
          {thumb ? <Skeleton className="mr-3 h-14 w-14" /> : null}
          <View className="flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </View>
          <Skeleton className="ml-3 h-9 w-9 rounded-full" />
          <Skeleton className="ml-2 h-9 w-9 rounded-full" />
        </View>
      ))}
    </View>
  );
}

/** Responsive photo grid placeholder. */
export function GridSkeleton({ count = 6, columns = 2, gap = 10, aspect = 1 }) {
  return (
    <View className="flex-row flex-wrap" style={{ gap }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ width: `${100 / columns - 1.5}%`, flexGrow: 1 }}>
          <Skeleton className="w-full rounded-card" style={{ aspectRatio: aspect }} />
        </View>
      ))}
    </View>
  );
}

/** Tiles for download cards / simple rows. */
export function CardSkeleton({ count = 3 }) {
  return (
    <View style={{ gap: 12 }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} className="flex-row items-center rounded-card border-[1.5px] border-line bg-surface p-4">
          <Skeleton className="mr-3 h-11 w-11 rounded-xl" />
          <View className="flex-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-2 h-3 w-1/3" />
          </View>
        </View>
      ))}
    </View>
  );
}

export function HeroSkeleton({ height = 144 }) {
  return <Skeleton className="mb-5 w-full rounded-hero" style={{ height }} />;
}

export function StatGridSkeleton({ count = 4 }) {
  const { isWide } = useBreakpoint();
  return (
    <View className="flex-row flex-wrap" style={{ gap: 10 }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ flexGrow: 1, flexBasis: isWide ? '22%' : '45%' }}>
          <Skeleton className="h-[92px] w-full rounded-card" />
        </View>
      ))}
    </View>
  );
}
