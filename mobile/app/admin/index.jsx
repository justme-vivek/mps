import React from 'react';
import { Pressable, View } from 'react-native';
import Text from '../../src/components/ui/Text';
import { useRouter } from 'expo-router';
import { Bell, CalendarDays, DownloadCloud, Images, Megaphone } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import StatCard from '../../src/components/ui/StatCard';
import Skeleton from '../../src/components/ui/Skeleton';
import SectionHeader from '../../src/components/ui/SectionHeader';
import Card from '../../src/components/ui/Card';
import { useBanners } from '../../src/features/banners/bannerService';
import { useNotices } from '../../src/features/notices/noticeService';
import { useEvents } from '../../src/features/events/eventService';
import { useGallery } from '../../src/features/gallery/galleryService';
import { useDownloads } from '../../src/features/downloads/downloadService';
import { formatDate } from '../../src/utils/format';

const ACTIONS = [
  { label: 'New Notice', icon: Megaphone, route: '/admin/notices' },
  { label: 'New Event', icon: CalendarDays, route: '/admin/events' },
  { label: 'Add Photo', icon: Images, route: '/admin/gallery' },
  { label: 'New Download', icon: DownloadCloud, route: '/admin/downloads' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { isWide } = useBreakpoint();
  const { data: banners = [] } = useBanners();
  const { data: notices = [], isLoading: noticesLoading } = useNotices();
  const { data: events = [] } = useEvents();
  const { data: gallery = [] } = useGallery();
  const { data: downloads = [] } = useDownloads();

  const recent = [...(notices || [])].slice(0, 4);
  const downloadsCount = (downloads || []).reduce((sum, d) => sum + (d.downloadCount || 0), 0);

  return (
    <Screen>
      <PageTitle title="Dashboard" subtitle="Overview of school content" />

      <View className="mb-5 flex-row flex-wrap" style={{ gap: 10 }}>
        {[
          { icon: <Bell size={16} color="#2A44B8" />, value: notices?.length ?? 0, label: 'Notices', highlight: true },
          { icon: <CalendarDays size={16} color="#6B4E00" />, value: events?.length ?? 0, label: 'Events', tone: 'accent' },
          { icon: <Images size={16} color="#0F6B38" />, value: gallery?.length ?? 0, label: 'Photos', tone: 'success' },
          { icon: <DownloadCloud size={16} color="#2A44B8" />, value: downloadsCount, label: 'PDF downloads' },
        ].map((stat) => (
          <View key={stat.label} style={{ flexGrow: 1, flexBasis: isWide ? '22%' : '45%' }}>
            <StatCard {...stat} />
          </View>
        ))}
      </View>

      <SectionHeader title="Quick actions" />
      <View className="mb-6 flex-row flex-wrap" style={{ gap: 10 }}>
        {ACTIONS.map(({ label, icon: Icon, route }) => (
          <Pressable
            key={label}
            onPress={() => router.push(route)}
            accessibilityRole="button"
            accessibilityLabel={label}
            className="min-h-[56px] flex-row items-center rounded-2xl border-[1.5px] border-line bg-surface px-3.5"
            style={{ flexGrow: 1, flexBasis: isWide ? '22%' : '45%' }}
          >
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
              <Icon size={16} color="#2A44B8" />
            </View>
            <Text className="ml-2.5 text-[14px] font-bold text-ink">{label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader
        title="Latest notices"
        subtitle={`${banners?.length ?? 0} banners · ${(downloads || []).length} downloads published`}
        actionLabel="Manage"
        onAction={() => router.push('/admin/notices')}
      />
      {noticesLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <View style={{ gap: 10 }}>
          {recent.map((n) => (
            <Card key={n._id} className="py-3">
              <Text className="text-[14px] font-bold text-ink" numberOfLines={1}>
                {n.title}
              </Text>
              <Text className="mt-0.5 text-[12px] text-ink-faint">
                {formatDate(n.date)} · {n.status === 'draft' ? 'Draft' : 'Published'}
              </Text>
            </Card>
          ))}
          {recent.length === 0 ? (
            <Card className="items-center py-5">
              <Text className="text-sm text-ink-muted">No notices yet — create your first one.</Text>
            </Card>
          ) : null}
        </View>
      )}
    </Screen>
  );
}
