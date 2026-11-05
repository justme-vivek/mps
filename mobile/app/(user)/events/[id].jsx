import React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import Text from '../../../src/components/ui/Text';
import Screen from '../../../src/components/ui/Screen';
import Card from '../../../src/components/ui/Card';
import Skeleton from '../../../src/components/ui/Skeleton';
import EmptyState from '../../../src/components/ui/EmptyState';
import ContentActions from '../../../src/components/common/ContentActions';
import { useEvent } from '../../../src/features/events/eventService';
import { formatDate } from '../../../src/utils/format';
import { ik } from '../../../src/utils/ik';
import { colors } from '../../../src/theme/tokens';

function BackButton({ router }) {
  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/events'))}
      accessibilityRole="button"
      accessibilityLabel="Back to events"
      className="h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-line bg-surface"
    >
      <ChevronLeft size={22} color={colors.ink} />
    </Pressable>
  );
}

export default function EventDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: event, isLoading } = useEvent(id);

  if (isLoading) {
    return (
      <Screen maxWidth={760}>
        <Skeleton className="mb-4 h-8 w-2/3" />
        <Skeleton className="mb-6 h-52 w-full" />
        <Skeleton className="h-24 w-full" />
      </Screen>
    );
  }

  if (!event) {
    return (
      <Screen maxWidth={760}>
        <View className="mb-4 flex-row">
          <BackButton router={router} />
        </View>
        <EmptyState title="Event not found" message="It may have been removed." />
      </Screen>
    );
  }

  return (
    <Screen maxWidth={760}>
      <View className="mb-4 flex-row items-center justify-between">
        <BackButton router={router} />
        <ContentActions
          itemType="event"
          itemId={event._id}
          title={event.title}
          shareText={`MPS Event: ${event.title} — ${formatDate(event.date)}`}
        />
      </View>

      <Text accessibilityRole="header" className="font-serif text-[30px] leading-[38px] text-ink">
        {event.title}
      </Text>
      <Text className="mt-1 text-[14px] text-ink-muted">{formatDate(event.date)}</Text>

      {event.location ? (
        <View className="mt-2 flex-row items-center" style={{ gap: 6 }}>
          <MapPin size={16} color={colors.inkMuted} />
          <Text className="text-[15px] font-bold text-ink-soft">{event.location}</Text>
        </View>
      ) : null}

      {event.bannerUrl ? (
        <Image
          source={{ uri: ik(event.bannerUrl, 'w-1000,q-80') }}
          style={{ width: '100%', height: 220, borderRadius: 20, marginTop: 16 }}
          contentFit="cover"
          transition={250}
          accessibilityLabel={event.title}
        />
      ) : null}

      <Card className="mt-4">
        <Text className="text-[16px] leading-[26px] text-ink-soft">{event.description}</Text>
      </Card>
    </Screen>
  );
}
