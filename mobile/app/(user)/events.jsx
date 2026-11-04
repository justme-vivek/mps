import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarX2 } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import { EventCard } from '../../src/components/common/ContentCards';
import { useEvents } from '../../src/features/events/eventService';
import { colors } from '../../src/theme/tokens';

export default function EventsScreen() {
  const router = useRouter();
  const { data: events = [], isLoading, refetch, isRefetching } = useEvents();

  const sorted = [...(events || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Screen bottomTabBar maxWidth={880} refresh={{ refreshing: isRefetching, onRefresh: refetch }}>
      <PageTitle title="Events" subtitle="What is happening at school" />

      {isLoading ? (
        <View style={{ gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[68px] w-full" />
          ))}
        </View>
      ) : sorted.length ? (
        sorted.map((item, i) => (
          <EventCard key={item._id} event={item} first={i === 0} onPress={() => router.push(`/events/${item._id}`)} />
        ))
      ) : (
        <EmptyState
          icon={<CalendarX2 size={32} color={colors.inkFaint} />}
          title="No events yet"
          message="School events will appear here once scheduled."
        />
      )}
    </Screen>
  );
}
