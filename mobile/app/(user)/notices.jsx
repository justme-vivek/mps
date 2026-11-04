import React from 'react';
import { useRouter } from 'expo-router';
import { BellOff } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import DataBoundary from '../../src/components/feedback/DataBoundary';
import LoadMoreFooter from '../../src/components/feedback/LoadMoreFooter';
import { DiaryRowSkeleton } from '../../src/components/feedback/skeletons';
import { NoticeCard } from '../../src/components/common/ContentCards';
import { useNoticesInfinite } from '../../src/features/notices/noticeService';
import { colors } from '../../src/theme/tokens';

export default function NoticesScreen() {
  const router = useRouter();
  const list = useNoticesInfinite({ status: 'published' });

  return (
    <Screen
      bottomTabBar
      maxWidth={880}
      onEndReached={list.loadMore}
      refresh={{ refreshing: list.isRefetching && !list.isFetchingNextPage, onRefresh: list.refetch }}
    >
      <PageTitle title="Notices" subtitle="Circulars and announcements from school" />

      <DataBoundary
        query={list}
        skeleton={<DiaryRowSkeleton count={5} />}
        empty={{
          icon: <BellOff size={32} color={colors.inkFaint} />,
          title: 'No notices yet',
          message: 'School notices will appear here as soon as they are published.',
        }}
      >
        {(notices) => (
          <>
            {notices.map((item, i) => (
              <NoticeCard key={item._id} notice={item} first={i === 0} onPress={() => router.push(`/notices/${item._id}`)} />
            ))}
            <LoadMoreFooter list={list} skeleton={<DiaryRowSkeleton count={2} />} />
          </>
        )}
      </DataBoundary>
    </Screen>
  );
}
