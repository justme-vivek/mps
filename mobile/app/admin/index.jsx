import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, CalendarDays, DownloadCloud, Images, Megaphone } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
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
  const { data: banners = [] } = useBanners();
  const { data: notices = [], isLoading: noticesLoading } = useNotices();
  const { data: events = [] } = useEvents();
  const { data: gallery = [] } = useGallery();
  const { data: downloads = [] } = useDownloads();

  const recent = [...(notices || [])].slice(0, 4);
  const downloadsCount = (downloads || []).reduce((sum, d) => sum + (d.downloadCount || 0), 0);

  return (
    <Screen>
      <Text className="mb-1 text-2xl font-black text-ink">Dashboard</Text>
      <Text className="mb-4 text-[13px] text-ink-muted">Overview of school content</Text>

      <View className="mb-3 flex-row" style={{ gap: 10 }}>
        <StatCard icon={<Bell size={16} color="#4F46E5" />} value={notices?.length ?? 0} label="Notices" />
        <StatCard icon={<CalendarDays size={16} color="#B45309" />} value={events?.length ?? 0} label="Events" tone="accent" />
      </View>
      <View className="mb-5 flex-row" style={{ gap: 10 }}>
        <StatCard icon={<Images size={16} color="#16A34A" />} value={gallery?.length ?? 0} label="Photos" tone="success" />
        <StatCard icon={<DownloadCloud size={16} color="#4F46E5" />} value={downloadsCount} label="PDF downloads" />
      </View>

      <SectionHeader title="Quick actions" />
      <View className="mb-6 flex-row flex-wrap justify-between" style={{ rowGap: 10 }}>
        {ACTIONS.map(({ label, icon: Icon, route }) => (
          <Pressable
            key={label}
            onPress={() => router.push(route)}
            className="w-[48.5%] flex-row items-center rounded-2xl border border-line bg-surface px-3.5 py-3.5"
          >
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
              <Icon size={16} color="#4F46E5" />
            </View>
            <Text className="ml-2.5 text-[13px] font-bold text-ink">{label}</Text>
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
