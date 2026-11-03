import React from 'react';
import { FlatList, Text } from 'react-native';
import { FileDown } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import DownloadCard from '../../src/components/common/DownloadCard';
import { useDownloads } from '../../src/features/downloads/downloadService';
import { usePdfDownload } from '../../src/hooks/usePdfDownload';

export default function DownloadsScreen() {
  const { data: downloads = [], isLoading, refetch, isRefetching } = useDownloads();
  const { run, busyId } = usePdfDownload();

  return (
    <Screen>
      <Text className="mb-1 text-2xl font-black text-ink">Downloads</Text>
      <Text className="mb-3 text-[13px] text-ink-muted">
        Forms, circulars and syllabi. Sign in to download and share.
      </Text>

      {isLoading ? (
        <View style={{ gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </View>
      ) : (
        <FlatList
          data={downloads || []}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }) => (
            <DownloadCard
              download={item}
              downloading={busyId === item._id}
              onDownload={() => run({ _id: item._id, title: item.title, fileUrl: item.fileUrl })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={<FileDown size={32} color="#9CA3AF" />}
              title="No downloads yet"
              message="School documents will appear here once published."
            />
          }
        />
      )}
    </Screen>
  );
}
