import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import Screen from '../../../src/components/ui/Screen';
import Card from '../../../src/components/ui/Card';
import Skeleton from '../../../src/components/ui/Skeleton';
import EmptyState from '../../../src/components/ui/EmptyState';
import ContentActions from '../../../src/components/common/ContentActions';
import { useEvent } from '../../../src/features/events/eventService';
import { formatDate } from '../../../src/utils/format';
import { ik } from '../../../src/utils/ik';

export default function EventDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: event, isLoading } = useEvent(id);

  if (isLoading) {
    return (
      <Screen>
        <Skeleton className="mb-4 h-8 w-2/3" />
        <Skeleton className="mb-6 h-52 w-full" />
        <Skeleton className="h-24 w-full" />
      </Screen>
    );
  }

  if (!event) {
    return (
      <Screen>
        <EmptyState title="Event not found" message="It may have been removed." />
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} hitSlop={8} className="h-10 w-10 items-center justify-center rounded-full bg-surface">
          <ChevronLeft size={22} color="#111827" />
        </Pressable>
        <ContentActions
          itemType="event"
          itemId={event._id}
          title={event.title}
          shareText={`MPS Event: ${event.title} — ${formatDate(event.date)}`}
        />
      </View>

      <Text className="text-2xl font-black leading-7 text-ink">{event.title}</Text>
      <Text className="mt-1 text-[13px] font-medium text-ink-faint">{formatDate(event.date)}</Text>

      {event.location ? (
        <View className="mt-2 flex-row items-center" style={{ gap: 5 }}>
          <MapPin size={15} color="#6B7280" />
          <Text className="text-[13px] font-semibold text-ink-muted">{event.location}</Text>
        </View>
      ) : null}

      {event.bannerUrl ? (
        <Image
          source={{ uri: ik(event.bannerUrl, 'w-1000,q-80') }}
          className="mt-4 h-52 w-full rounded-3xl"
          contentFit="cover"
          transition={250}
        />
      ) : null}

      <Card className="mt-4">
        <Text className="text-[15px] leading-6 text-ink-soft">{event.description}</Text>
      </Card>
    </Screen>
  );
}
