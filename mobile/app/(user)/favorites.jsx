import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HeartOff } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import Badge from '../../src/components/ui/Badge';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useFavorites, useRemoveFavorite } from '../../src/features/favorites/favoriteService';
import { formatDate } from '../../src/utils/format';

const TYPE_LABELS = { notice: 'Notice', event: 'Event', gallery: 'Photo' };

export default function FavoritesScreen() {
  const router = useRouter();
  const { status } = useAuth();
  const { data: favorites = [], isLoading } = useFavorites();
  const remove = useRemoveFavorite();

  if (status !== 'authenticated') {
    return (
      <Screen>
        <Text className="mb-3 text-2xl font-black text-ink">Favourites</Text>
        <EmptyState
          icon={<HeartOff size={32} color="#9CA3AF" />}
          title="Sign in required"
          message="Create an account or sign in to save your favourite notices, events and photos."
          actionLabel="Sign in"
          Button={Button}
          onAction={() => router.push('/login')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text className="mb-3 text-2xl font-black text-ink">Favourites</Text>

      {isLoading ? (
        <View style={{ gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card
              className="mb-3"
              onPress={() => {
                if (item.itemType === 'notice') router.push(`/notices/${item.itemId}`);
                else if (item.itemType === 'event') router.push(`/events/${item.itemId}`);
                else router.push('/gallery');
              }}
            >
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Badge label={TYPE_LABELS[item.itemType] || 'Item'} tone="primary" />
                  <Text className="mt-1.5 text-[15px] font-bold text-ink" numberOfLines={1}>
                    {item.item?.title || 'Untitled'}
                  </Text>
                  <Text className="mt-0.5 text-[12px] text-ink-faint">
                    Saved {formatDate(item.createdAt)}
                  </Text>
                </View>
                <Text
                  onPress={() => remove.mutate(item._id)}
                  className="ml-2 rounded-full bg-danger-50 px-3 py-1.5 text-[12px] font-bold text-danger"
                >
                  Remove
                </Text>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <EmptyState
              icon={<HeartOff size={32} color="#9CA3AF" />}
              title="Nothing saved yet"
              message="Tap the heart on any notice, event or photo to save it here."
            />
          }
        />
      )}
    </Screen>
  );
}
