import React from 'react';
import { FileDown } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import DataBoundary from '../../src/components/feedback/DataBoundary';
import LoadMoreFooter from '../../src/components/feedback/LoadMoreFooter';
import { CardSkeleton } from '../../src/components/feedback/skeletons';
import DownloadCard from '../../src/components/common/DownloadCard';
import { useDownloadsInfinite } from '../../src/features/downloads/downloadService';
import { usePdfDownload } from '../../src/hooks/usePdfDownload';
import { colors } from '../../src/theme/tokens';

export default function DownloadsScreen() {
  const list = useDownloadsInfinite();
  const { run, busyId } = usePdfDownload();

  return (
    <Screen
      bottomTabBar
      maxWidth={880}
      onEndReached={list.loadMore}
      refresh={{ refreshing: list.isRefetching && !list.isFetchingNextPage, onRefresh: list.refetch }}
    >
      <PageTitle title="Downloads" subtitle="Forms, circulars and syllabi. Sign in to download and share." />

      <DataBoundary
        query={list}
        skeleton={<CardSkeleton count={4} />}
        empty={{
          icon: <FileDown size={32} color={colors.inkFaint} />,
          title: 'No downloads yet',
          message: 'School documents will appear here once published.',
        }}
      >
        {(downloads) => (
          <>
            {downloads.map((item) => (
              <DownloadCard
                key={item._id}
                download={item}
                downloading={busyId === item._id}
                onDownload={() => run({ _id: item._id, title: item.title, fileUrl: item.fileUrl })}
              />
            ))}
            <LoadMoreFooter list={list} skeleton={<CardSkeleton count={2} />} />
          </>
        )}
      </DataBoundary>
    </Screen>
  );
}
