import React from 'react';
import { useRouter } from 'expo-router';
import { CalendarX2 } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import DataBoundary from '../../src/components/feedback/DataBoundary';
import LoadMoreFooter from '../../src/components/feedback/LoadMoreFooter';
import { DiaryRowSkeleton } from '../../src/components/feedback/skeletons';
import { EventCard } from '../../src/components/common/ContentCards';
import { useEventsInfinite } from '../../src/features/events/eventService';
import { colors } from '../../src/theme/tokens';

export default function EventsScreen() {
  const router = useRouter();
  const list = useEventsInfinite();

  return (
    <Screen
      bottomTabBar
      maxWidth={880}
      onEndReached={list.loadMore}
      refresh={{ refreshing: list.isRefetching && !list.isFetchingNextPage, onRefresh: list.refetch }}
    >
      <PageTitle title="Events" subtitle="What is happening at school" />

      <DataBoundary
        query={list}
        skeleton={<DiaryRowSkeleton count={4} />}
        empty={{
          icon: <CalendarX2 size={32} color={colors.inkFaint} />,
          title: 'No events yet',
          message: 'School events will appear here once scheduled.',
        }}
      >
        {(events) => (
          <>
            {events.map((item, i) => (
              <EventCard key={item._id} event={item} first={i === 0} onPress={() => router.push(`/events/${item._id}`)} />
            ))}
            <LoadMoreFooter list={list} skeleton={<DiaryRowSkeleton count={2} />} />
          </>
        )}
      </DataBoundary>
    </Screen>
  );
}
