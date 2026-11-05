import React from 'react';
import { Pressable, View } from 'react-native';
import Text from '../ui/Text';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, CalendarDays, Download, Home, Images, LayoutGrid } from 'lucide-react-native';
import { useAuth } from '../../features/auth/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { colors, layout } from '../../theme/tokens';

const PHONE_TABS = [
  { name: 'index', label: 'Home', Icon: Home },
  { name: 'notices', label: 'Notices', Icon: Bell },
  { name: 'events', label: 'Events', Icon: CalendarDays },
  { name: 'gallery', label: 'Gallery', Icon: Images },
  { name: 'more', label: 'More', Icon: LayoutGrid },
];

const WIDE_TABS = [
  { name: 'index', label: 'Home' },
  { name: 'notices', label: 'Notices' },
  { name: 'events', label: 'Events' },
  { name: 'gallery', label: 'Gallery' },
  { name: 'downloads', label: 'Downloads' },
  { name: 'more', label: 'More' },
];

// Detail screens highlight the tab they belong to.
const PARENT_TAB = { 'notices/[id]': 'notices', 'events/[id]': 'events', favorites: 'more', profile: 'more' };

function useTabPress(state, navigation) {
  return (name) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;
    const focused = state.routes[state.index].name === name;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
  };
}

function Monogram() {
  return (
    <View className="h-10 w-10 items-center justify-center rounded-[14px] bg-primary-700">
      <Text className="font-serif text-[22px] text-accent">M</Text>
    </View>
  );
}

/** Phones and tablets: bottom tab bar, 72px plus the safe area. */
function BottomBar({ activeKey, press }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      accessibilityRole="tablist"
      className="flex-row border-t-[1.5px] border-line bg-surface"
      style={{ height: 72 + insets.bottom, paddingBottom: insets.bottom }}
    >
      {PHONE_TABS.map(({ name, label, Icon }) => {
        const active = activeKey === name;
        return (
          <Pressable
            key={name}
            onPress={() => press(name)}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            className="flex-1 items-center justify-center"
            style={{ gap: 4 }}
          >
            <Icon size={24} color={active ? colors.pen : colors.inkMuted} strokeWidth={2} />
            <Text className={`text-[12px] ${active ? 'font-bold text-primary' : 'text-ink-muted'}`}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Laptops: a top navigation bar that wraps onto a second line when it must. */
function TopBar({ activeKey, press }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { status, user } = useAuth();
  return (
    <View className="border-b-[1.5px] border-line bg-surface" style={{ paddingTop: insets.top }}>
      <View
        className="w-full flex-row flex-wrap items-center justify-between"
        style={{
          maxWidth: layout.maxContentWidth,
          alignSelf: 'center',
          paddingHorizontal: layout.marginXWide,
          paddingVertical: 8,
          rowGap: 4,
          columnGap: 24,
        }}
      >
        <Pressable
          onPress={() => press('index')}
          accessibilityRole="link"
          accessibilityLabel="Modern Public School, home"
          className="flex-row items-center"
          style={{ gap: 12 }}
        >
          <Monogram />
          <Text className="font-serif text-[20px] text-ink">Modern Public School</Text>
        </Pressable>

        <View accessibilityRole="tablist" className="flex-row flex-wrap items-center">
          {WIDE_TABS.map(({ name, label }) => {
            const active = activeKey === name;
            return (
              <Pressable
                key={name}
                onPress={() => press(name)}
                accessibilityRole="link"
                accessibilityLabel={label}
                accessibilityState={{ selected: active }}
                className="min-h-[44px] justify-center px-3.5"
              >
                <Text
                  className={`rounded px-2 py-0.5 text-[15px] ${
                    active ? 'bg-accent font-bold text-ink' : 'text-ink-soft'
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {status === 'authenticated' ? (
          <Pressable
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            className="h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-surface"
          >
            <Text className="text-[16px] font-bold text-ink">{(user?.name || 'U').charAt(0).toUpperCase()}</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.push('/login')}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            className="min-h-[44px] justify-center rounded-xl bg-primary px-6"
          >
            <Text className="text-[15px] font-bold text-white">Sign in</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/** Custom tab bar for the (user) group: bottom on phones, top on laptops. */
export default function DiaryTabBar({ state, navigation }) {
  const { isWide } = useBreakpoint();
  const press = useTabPress(state, navigation);
  const current = state.routes[state.index].name;
  const activeKey = PARENT_TAB[current] || current;
  return isWide ? <TopBar activeKey={activeKey} press={press} /> : <BottomBar activeKey={activeKey} press={press} />;
}
