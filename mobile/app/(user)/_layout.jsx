import React from 'react';
import { Tabs } from 'expo-router';
import DiaryTabBar from '../../src/components/common/DiaryTabBar';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { colors } from '../../src/theme/tokens';

/**
 * Student / guest area. The tab bar is custom (DiaryTabBar): a bottom bar on
 * phones and tablets, a top navigation bar from 1024px up.
 */
export default function UserLayout() {
  const { isWide } = useBreakpoint();
  return (
    <Tabs
      tabBar={(props) => <DiaryTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarPosition: isWide ? 'top' : 'bottom',
        sceneStyle: { backgroundColor: colors.paper },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="notices" options={{ title: 'Notices' }} />
      <Tabs.Screen name="events" options={{ title: 'Events' }} />
      <Tabs.Screen name="gallery" options={{ title: 'Gallery' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
      {/* Detail / feature screens — hidden from the tab bar */}
      <Tabs.Screen name="notices/[id]" options={{ href: null }} />
      <Tabs.Screen name="events/[id]" options={{ href: null }} />
      <Tabs.Screen name="favorites" options={{ href: null }} />
      <Tabs.Screen name="downloads" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
