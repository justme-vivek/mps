import React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Bell, CalendarDays, Download, Heart, Images } from 'lucide-react-native';
import Text from '../../src/components/ui/Text';
import Screen from '../../src/components/ui/Screen';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import Skeleton from '../../src/components/ui/Skeleton';
import SectionHeader from '../../src/components/ui/SectionHeader';
import { NoticeCard, EventCard } from '../../src/components/common/ContentCards';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useBanners } from '../../src/features/banners/bannerService';
import { useNotices } from '../../src/features/notices/noticeService';
import { useEvents } from '../../src/features/events/eventService';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import { colors } from '../../src/theme/tokens';
import { ik } from '../../src/utils/ik';

const QUICK_ACTIONS = [
  { label: 'Notices', icon: Bell, route: '/notices' },
  { label: 'Events', icon: CalendarDays, route: '/events' },
  { label: 'Gallery', icon: Images, route: '/gallery' },
  { label: 'Saved', icon: Heart, route: '/favorites' },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/** Phones and tablets: monogram, greeting, profile button. Laptops use the top nav instead. */
function GreetingHeader({ user, router }) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center" style={{ gap: 12 }}>
        <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-primary-700">
          <Text className="font-serif text-[24px] text-accent">M</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[13px] text-ink-muted">Modern Public School</Text>
          <Text className="font-serif text-[24px] leading-7 text-ink" numberOfLines={1}>
            {user ? `${greeting()}, ${(user.name || 'there').split(' ')[0]}` : 'Welcome'}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => router.push(user ? '/profile' : '/login')}
        accessibilityRole="button"
        accessibilityLabel={user ? 'Open profile' : 'Sign in'}
        className="h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-surface"
      >
        <Text className="text-[16px] font-bold text-ink">{user ? user.name.charAt(0).toUpperCase() : '?'}</Text>
      </Pressable>
    </View>
  );
}

function HeroCard({ banner, loading, tall }) {
  const height = tall ? 280 : 144;
  if (loading) return <Skeleton className="mb-5 w-full rounded-hero" style={{ height }} />;
  if (banner) {
    return (
      <Image
        source={{ uri: ik(banner.imageUrl, 'w-1400,q-80') }}
        style={{ width: '100%', height, borderRadius: 28, marginBottom: 20, backgroundColor: '#1B2A59' }}
        contentFit="cover"
        transition={250}
        accessibilityLabel={banner.title || 'School banner'}
      />
    );
  }
  return (
    <View className="mb-5 w-full justify-end rounded-hero bg-primary-700 p-5" style={{ height }}>
      <View className="mb-2 self-start rounded-md bg-accent px-3 py-1">
        <Text className="text-[13px] font-bold text-ink">Admissions open 2026–27</Text>
      </View>
      <Text className="font-serif text-[22px] leading-7 text-white">Empowering Minds, Nurturing Ambitions.</Text>
    </View>
  );
}

function SignInNudge({ router }) {
  return (
    <Card className="mb-5 border-primary-100 bg-primary-50">
      <View className="flex-row flex-wrap items-center justify-between" style={{ gap: 12 }}>
        <View className="min-w-[200px] flex-1">
          <Text className="text-[16px] font-bold text-primary-700">Unlock full access</Text>
          <Text className="mt-0.5 text-[14px] text-ink-soft">Sign in to save favourites, download files and share.</Text>
        </View>
        <Button title="Sign in" size="sm" onPress={() => router.push('/login')} />
      </View>
    </Card>
  );
}

function QuickActions({ router }) {
  return (
    <View className="mb-6 flex-row" style={{ gap: 10 }}>
      {QUICK_ACTIONS.map(({ label, icon: Icon, route }) => (
        <Pressable
          key={label}
          onPress={() => router.push(route)}
          accessibilityRole="button"
          accessibilityLabel={label}
          className="min-h-[80px] flex-1 items-center justify-center rounded-[18px] border-[1.5px] border-line bg-surface"
          style={{ gap: 6 }}
        >
          <Icon size={22} color={colors.pen} />
          <Text className="text-[13px] font-bold text-ink">{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function RowSkeletons({ count }) {
  return (
    <View style={{ gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[68px] w-full" />
      ))}
    </View>
  );
}

function SideLink({ icon: Icon, title, text, route, router }) {
  return (
    <Card onPress={() => router.push(route)} className="mb-3 border-primary-100 bg-primary-50">
      <View className="flex-row items-center">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary">
          <Icon size={20} color="#FFFFFF" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-[16px] font-bold text-primary-700">{title}</Text>
          <Text className="text-[13px] text-ink-soft">{text}</Text>
        </View>
      </View>
    </Card>
  );
}

export default function UserHome() {
  const router = useRouter();
  const { user } = useAuth();
  const { isMedium, isWide } = useBreakpoint();
  const banners = useBanners();
  const notices = useNotices();
  const events = useEvents();

  const hero = (banners.data || []).find((b) => b.isActive) || null;
  const latestNotices = (notices.data || []).filter((n) => n.status !== 'draft').slice(0, isWide ? 5 : 3);
  const now = new Date();
  const upcoming = (events.data || [])
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, isWide ? 4 : 3);

  const refresh = {
    refreshing: notices.isRefetching || events.isRefetching,
    onRefresh: () => {
      banners.refetch();
      notices.refetch();
      events.refetch();
    },
  };

  const noticeBoard = (
    <View className="mb-6">
      <SectionHeader title="Notice board" actionLabel="See all" onAction={() => router.push('/notices')} />
      {notices.isLoading ? (
        <RowSkeletons count={3} />
      ) : latestNotices.length ? (
        latestNotices.map((n, i) => (
          <NoticeCard key={n._id} notice={n} first={i === 0} onPress={() => router.push(`/notices/${n._id}`)} />
        ))
      ) : (
        <Card className="items-center py-6">
          <Text className="text-[15px] text-ink-muted">No notices right now.</Text>
        </Card>
      )}
    </View>
  );

  const comingUp = (
    <View className="mb-6">
      <SectionHeader title="Coming up" actionLabel="See all" onAction={() => router.push('/events')} />
      {events.isLoading ? (
        <RowSkeletons count={2} />
      ) : upcoming.length ? (
        upcoming.map((e, i) => (
          <EventCard key={e._id} event={e} first={i === 0} onPress={() => router.push(`/events/${e._id}`)} />
        ))
      ) : (
        <Card className="items-center py-6">
          <Text className="text-[15px] text-ink-muted">No upcoming events scheduled.</Text>
        </Card>
      )}
    </View>
  );

  const links = (
    <View>
      <SideLink icon={Download} title="Downloads" text="Forms, circulars and syllabi (PDF)" route="/downloads" router={router} />
      <SideLink icon={Images} title="Gallery" text="Moments from school life" route="/gallery" router={router} />
    </View>
  );

  if (isWide) {
    return (
      <Screen refresh={refresh} bottomTabBar>
        {hero ? <HeroCard banner={hero} loading={false} tall /> : null}
        <View className="mb-4 flex-row items-center" style={{ gap: 40 }}>
          <View className="flex-1" style={{ gap: 18 }}>
            <View className="self-start rounded-md bg-accent px-3 py-1">
              <Text className="text-[14px] font-bold text-ink">Admissions open 2026–27</Text>
            </View>
            <Text accessibilityRole="header" className="font-serif text-[48px] leading-[54px] text-ink">
              Notices, events and forms from school, in one place
            </Text>
            <Text className="max-w-[520px] text-[18px] leading-7 text-ink-soft">
              {user
                ? `${greeting()}, ${(user.name || 'there').split(' ')[0]}. Everything the school has shared is below.`
                : 'Sign in to save notices, download circulars and share them with your family. You can also browse as a guest.'}
            </Text>
            {!user ? (
              <View className="flex-row" style={{ gap: 12 }}>
                <Button title="Sign in" size="lg" onPress={() => router.push('/login')} />
              </View>
            ) : null}
          </View>
          <View className="flex-1">{comingUp}</View>
        </View>
        <View className="flex-row items-start" style={{ gap: 32 }}>
          <View style={{ flex: 2 }}>{noticeBoard}</View>
          <View style={{ flex: 1 }} className="pt-1">
            {links}
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen refresh={refresh} bottomTabBar>
      <GreetingHeader user={user} router={router} />
      <HeroCard banner={hero} loading={banners.isLoading} tall={false} />
      {!user ? <SignInNudge router={router} /> : null}
      <QuickActions router={router} />
      {isMedium ? (
        <View className="flex-row items-start" style={{ gap: 24 }}>
          <View className="flex-1">{noticeBoard}</View>
          <View className="flex-1">{comingUp}</View>
        </View>
      ) : (
        <>
          {noticeBoard}
          {comingUp}
        </>
      )}
      {links}
    </Screen>
  );
}
