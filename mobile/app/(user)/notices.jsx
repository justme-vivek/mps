import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BellOff } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import { NoticeCard } from '../../src/components/common/ContentCards';
import { useNotices } from '../../src/features/notices/noticeService';

export default function NoticesScreen() {
  const router = useRouter();
  const { data: notices = [], isLoading, refetch, isRefetching } = useNotices();

  const published = (notices || []).filter((n) => n.status !== 'draft');

  return (
    <Screen>
      <Text className="mb-3 text-2xl font-black text-ink">Notice Board</Text>

      {isLoading ? (
        <View style={{ gap: 12 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </View>
      ) : (
        <FlatList
          data={published}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <NoticeCard notice={item} onPress={() => router.push(`/notices/${item._id}`)} />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={<BellOff size={32} color="#9CA3AF" />}
              title="No notices yet"
              message="School notices will appear here as soon as they are published."
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
