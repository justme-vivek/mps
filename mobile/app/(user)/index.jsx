import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, CalendarDays, Download, Heart, Images, Sparkles } from 'lucide-react-native';
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
import { ik } from '../../src/utils/ik';

const QUICK_ACTIONS = [
  { label: 'Notices', icon: Bell, route: '/notices' },
  { label: 'Events', icon: CalendarDays, route: '/events' },
  { label: 'Gallery', icon: Images, route: '/gallery' },
  { label: 'Favourites', icon: Heart, route: '/favorites' },
];

export default function UserHome() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: banners = [], isLoading: bannersLoading } = useBanners();
  const { data: notices = [], isLoading: noticesLoading } = useNotices();
  const { data: events = [], isLoading: eventsLoading } = useEvents();

  const hero = (banners || []).find((b) => b.isActive) || null;
  const latestNotices = (notices || []).filter((n) => n.status !== 'draft').slice(0, 3);
  const now = new Date();
  const upcomingEvents = (events || [])
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <Screen>
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xs font-semibold text-ink-muted">Modern Public School</Text>
          <Text className="text-2xl font-black text-ink">
            {user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}
          </Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full bg-primary-600">
          <Text className="text-lg font-black text-white">
            {user ? user.name.charAt(0).toUpperCase() : 'M'}
          </Text>
        </View>
      </View>

      {/* Hero banner */}
      {bannersLoading ? (
        <Skeleton className="mb-5 h-48 w-full rounded-3xl" />
      ) : hero ? (
        <Image source={{ uri: ik(hero.imageUrl, 'w-1000,q-80') }} className="mb-5 h-48 w-full rounded-3xl" contentFit="cover" transition={250} />
      ) : (
        <View className="mb-5 h-48 w-full justify-end rounded-3xl bg-primary-700 p-5">
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <Sparkles size={16} color="#FDE68A" />
            <Text className="text-xs font-bold text-primary-100">ADMISSIONS OPEN 2026-27</Text>
          </View>
          <Text className="mt-1.5 text-xl font-extrabold leading-6 text-white">
            Empowering Minds, Nurturing Ambitions.
          </Text>
        </View>
      )}

      {/* Guest sign-in nudge */}
      {!user ? (
        <Card className="mb-5 border-primary-100 bg-primary-50">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[15px] font-bold text-primary-700">Unlock full access</Text>
              <Text className="mt-0.5 text-[13px] text-primary-600">
                Sign in to save favourites, download files and share.
              </Text>
            </View>
            <Button title="Sign in" size="sm" onPress={() => router.push('/login')} />
          </View>
        </Card>
      ) : null}

      {/* Quick actions */}
      <View className="mb-6 flex-row justify-between">
        {QUICK_ACTIONS.map(({ label, icon: Icon, route }) => (
          <Pressable key={label} onPress={() => router.push(route)} className="w-[23%] items-center rounded-2xl border border-line bg-surface py-3">
            <Icon size={20} color="#4F46E5" />
            <Text className="mt-1.5 text-[11px] font-bold text-ink-soft">{label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Notices */}
      <SectionHeader title="Notice Board" actionLabel="See all" onAction={() => router.push('/notices')} />
      {noticesLoading ? (
        <Skeleton className="mb-3 h-28 w-full" />
      ) : (
        <View className="mb-6">
          {latestNotices.map((notice) => (
            <NoticeCard key={notice._id} notice={notice} onPress={() => router.push(`/notices/${notice._id}`)} />
          ))}
          {latestNotices.length === 0 ? (
            <Card className="items-center py-6">
              <Text className="text-sm text-ink-muted">No notices right now.</Text>
            </Card>
          ) : null}
        </View>
      )}

      {/* Events */}
      <SectionHeader title="Upcoming Events" actionLabel="See all" onAction={() => router.push('/events')} />
      {eventsLoading ? (
        <Skeleton className="mb-3 h-24 w-full" />
      ) : (
        <View className="mb-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} event={event} onPress={() => router.push(`/events/${event._id}`)} />
          ))}
          {upcomingEvents.length === 0 ? (
            <Card className="items-center py-6">
              <Text className="text-sm text-ink-muted">No upcoming events scheduled.</Text>
            </Card>
          ) : null}
        </View>
      )}

      {/* Downloads nudge */}
      <Card onPress={() => router.push('/downloads')} className="border-primary-100 bg-primary-50">
        <View className="flex-row items-center">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
            <Download size={18} color="#FFFFFF" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-[15px] font-bold text-primary-700">Downloads</Text>
            <Text className="text-[12px] text-primary-600">Forms, circulars and syllabi (PDF)</Text>
          </View>
        </View>
      </Card>
    </Screen>
  );
}
