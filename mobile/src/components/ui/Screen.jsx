import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Base screen container with safe-area padding, optional scroll and
 * pull-to-refresh wired to a react-query refetch.
 */
export default function Screen({
  children,
  scroll = true,
  padded = true,
  refresh = null, // { refreshing, onRefresh }
  bottomTabBar = false,
  className = '',
}) {
  const insets = useSafeAreaInsets();
  const padding = `px-5 pt-3 ${bottomTabBar ? 'pb-28' : 'pb-10'} ${padded ? '' : 'px-0 pt-0'}`;

  const content = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName={padding}
      refreshControl={
        refresh ? (
          <RefreshControl refreshing={refresh.refreshing} onRefresh={refresh.onRefresh} tintColor="#4F46E5" />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${padding}`}>{children}</View>
  );

  return (
    <View className={`flex-1 bg-surface-alt ${className}`} style={{ paddingTop: scroll ? insets.top : 0 }}>
      {content}
    </View>
  );
}
