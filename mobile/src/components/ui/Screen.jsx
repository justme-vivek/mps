import React, { useRef } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { colors, layout } from '../../theme/tokens';

/**
 * Base screen container: safe-area padding, optional scroll, pull-to-refresh
 * wired to a react-query refetch, and a centred content column that is
 * 1200px wide on laptops and full width on phones.
 */
export default function Screen({
  children,
  scroll = true,
  padded = true,
  refresh = null, // { refreshing, onRefresh }
  onEndReached = null, // lazy loading: called near the bottom (must be idempotent)
  bottomTabBar = false,
  className = '',
  maxWidth = layout.maxContentWidth,
}) {
  const insets = useSafeAreaInsets();
  const viewport = useRef(0);
  const { isWide, gutter } = useBreakpoint();

  const horizontal = padded ? gutter : 0;
  const top = padded ? 12 : 0;
  // Phones keep room for the bottom tab bar; laptops use a top nav instead.
  const bottom = padded ? (bottomTabBar && !isWide ? 104 : 40) : 0;

  const column = {
    width: '100%',
    maxWidth,
    alignSelf: 'center',
    paddingHorizontal: horizontal,
    paddingTop: top,
    paddingBottom: bottom,
  };

  const content = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEventThrottle={100}
      onLayout={(e) => {
        viewport.current = e.nativeEvent.layout.height;
      }}
      onScroll={
        onEndReached
          ? ({ nativeEvent: { contentOffset, layoutMeasurement, contentSize } }) => {
              if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 480) onEndReached();
            }
          : undefined
      }
      // Tall screens may not scroll at all: keep loading until the page is filled.
      onContentSizeChange={onEndReached ? (_, h) => h <= viewport.current + 120 && onEndReached() : undefined}
      refreshControl={
        refresh ? (
          <RefreshControl refreshing={refresh.refreshing} onRefresh={refresh.onRefresh} tintColor={colors.pen} />
        ) : undefined
      }
    >
      <View style={column}>{children}</View>
    </ScrollView>
  ) : (
    <View className="flex-1" style={column}>
      {children}
    </View>
  );

  return (
    <View className={`flex-1 bg-surface-alt ${className}`} style={{ paddingTop: scroll ? insets.top : 0 }}>
      {content}
    </View>
  );
}
