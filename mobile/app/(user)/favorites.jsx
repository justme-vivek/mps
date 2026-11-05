import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HeartOff } from 'lucide-react-native';
import Text from '../../src/components/ui/Text';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import Badge from '../../src/components/ui/Badge';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useFavorites, useRemoveFavorite } from '../../src/features/favorites/favoriteService';
import { formatDate } from '../../src/utils/format';
import { colors } from '../../src/theme/tokens';

const TYPE_LABELS = { notice: 'Notice', event: 'Event', gallery: 'Photo' };

export default function FavoritesScreen() {
  const router = useRouter();
  const { status } = useAuth();
  const { data: favorites = [], isLoading } = useFavorites();
  const remove = useRemoveFavorite();

  if (status !== 'authenticated') {
    return (
      <Screen bottomTabBar maxWidth={880}>
        <PageTitle title="Favourites" />
        <EmptyState
          icon={<HeartOff size={32} color={colors.inkFaint} />}
          title="Sign in to see your favourites"
          message="Create an account or sign in to save your favourite notices, events and photos."
          actionLabel="Sign in"
          Button={Button}
          onAction={() => router.push('/login')}
        />
      </Screen>
    );
  }

  return (
    <Screen bottomTabBar maxWidth={880}>
      <PageTitle title="Favourites" subtitle="Everything you have saved" />

      {isLoading ? (
        <View style={{ gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </View>
      ) : favorites.length ? (
        favorites.map((item) => (
          <Card
            key={item._id}
            className="mb-3"
            accessibilityLabel={item.item?.title || 'Saved item'}
            onPress={() => {
              if (item.itemType === 'notice') router.push(`/notices/${item.itemId}`);
              else if (item.itemType === 'event') router.push(`/events/${item.itemId}`);
              else router.push('/gallery');
            }}
          >
            <View className="flex-row items-center">
              <View className="min-w-0 flex-1">
                <Badge label={TYPE_LABELS[item.itemType] || 'Item'} tone="primary" />
                <Text className="mt-1.5 text-[16px] font-bold text-ink" numberOfLines={1}>
                  {item.item?.title || 'Untitled'}
                </Text>
                <Text className="mt-0.5 text-[13px] text-ink-faint">Saved {formatDate(item.createdAt)}</Text>
              </View>
              <Pressable
                onPress={() => remove.mutate(item._id)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.item?.title || 'item'} from favourites`}
                className="ml-2 min-h-[44px] justify-center rounded-xl border-[1.5px] border-danger px-4"
              >
                <Text className="text-[14px] font-bold text-danger">Remove</Text>
              </Pressable>
            </View>
          </Card>
        ))
      ) : (
        <EmptyState
          icon={<HeartOff size={32} color={colors.inkFaint} />}
          title="Nothing saved yet"
          message="Tap the heart on any notice, event or photo to save it here."
        />
      )}
    </Screen>
  );
}
