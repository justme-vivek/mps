import React from 'react';
import { View } from 'react-native';
import { FileDown } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import DownloadCard from '../../src/components/common/DownloadCard';
import { useDownloads } from '../../src/features/downloads/downloadService';
import { usePdfDownload } from '../../src/hooks/usePdfDownload';
import { colors } from '../../src/theme/tokens';

export default function DownloadsScreen() {
  const { data: downloads = [], isLoading, refetch, isRefetching } = useDownloads();
  const { run, busyId } = usePdfDownload();

  return (
    <Screen bottomTabBar maxWidth={880} refresh={{ refreshing: isRefetching, onRefresh: refetch }}>
      <PageTitle title="Downloads" subtitle="Forms, circulars and syllabi. Sign in to download and share." />

      {isLoading ? (
        <View style={{ gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </View>
      ) : (downloads || []).length ? (
        (downloads || []).map((item) => (
          <DownloadCard
            key={item._id}
            download={item}
            downloading={busyId === item._id}
            onDownload={() => run({ _id: item._id, title: item.title, fileUrl: item.fileUrl })}
          />
        ))
      ) : (
        <EmptyState
          icon={<FileDown size={32} color={colors.inkFaint} />}
          title="No downloads yet"
          message="School documents will appear here once published."
        />
      )}
    </Screen>
  );
}
