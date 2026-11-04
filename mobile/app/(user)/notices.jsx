import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { BellOff } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import { NoticeCard } from '../../src/components/common/ContentCards';
import { useNotices } from '../../src/features/notices/noticeService';
import { colors } from '../../src/theme/tokens';

export default function NoticesScreen() {
  const router = useRouter();
  const { data: notices = [], isLoading, refetch, isRefetching } = useNotices();

  const published = (notices || []).filter((n) => n.status !== 'draft');

  return (
    <Screen bottomTabBar maxWidth={880} refresh={{ refreshing: isRefetching, onRefresh: refetch }}>
      <PageTitle title="Notices" subtitle="Circulars and announcements from school" />

      {isLoading ? (
        <View style={{ gap: 8 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[68px] w-full" />
          ))}
        </View>
      ) : published.length ? (
        published.map((item, i) => (
          <NoticeCard key={item._id} notice={item} first={i === 0} onPress={() => router.push(`/notices/${item._id}`)} />
        ))
      ) : (
        <EmptyState
          icon={<BellOff size={32} color={colors.inkFaint} />}
          title="No notices yet"
          message="School notices will appear here as soon as they are published."
        />
      )}
    </Screen>
  );
}
