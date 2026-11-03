import React from 'react';
import { FlatList, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarX2 } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import { EventCard } from '../../src/components/common/ContentCards';
import { useEvents } from '../../src/features/events/eventService';

export default function EventsScreen() {
  const router = useRouter();
  const { data: events = [], isLoading, refetch, isRefetching } = useEvents();

  const sorted = [...(events || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Screen>
      <Text className="mb-3 text-2xl font-black text-ink">Events</Text>
      {isLoading ? (
        <View style={{ gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => router.push(`/events/${item._id}`)} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={<CalendarX2 size={32} color="#9CA3AF" />}
              title="No events yet"
              message="School events will appear here once scheduled."
            />
          }
          onRefresh={refetch}
          refreshing={isRefetching}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}
