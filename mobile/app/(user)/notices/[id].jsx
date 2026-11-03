import React from 'react';
import { Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, FileText } from 'lucide-react-native';
import Screen from '../../../src/components/ui/Screen';
import Card from '../../../src/components/ui/Card';
import Button from '../../../src/components/ui/Button';
import Skeleton from '../../../src/components/ui/Skeleton';
import Badge from '../../../src/components/ui/Badge';
import EmptyState from '../../../src/components/ui/EmptyState';
import ContentActions from '../../../src/components/common/ContentActions';
import { useNotice } from '../../../src/features/notices/noticeService';
import { usePdfDownload } from '../../../src/hooks/usePdfDownload';
import { formatDate } from '../../../src/utils/format';
import { Pressable } from 'react-native';

export default function NoticeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: notice, isLoading } = useNotice(id);
  const { run: downloadRun, busyId } = usePdfDownload();

  if (isLoading) {
    return (
      <Screen>
        <Skeleton className="mb-4 h-8 w-2/3" />
        <Skeleton className="mb-6 h-64 w-full" />
      </Screen>
    );
  }

  if (!notice) {
    return (
      <Screen>
        <EmptyState title="Notice not found" message="It may have been removed." />
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} hitSlop={8} className="h-10 w-10 items-center justify-center rounded-full bg-surface">
          <ChevronLeft size={22} color="#111827" />
        </Pressable>
        <ContentActions
          itemType="notice"
          itemId={notice._id}
          title={notice.title}
          shareText={`Notice from MPS: ${notice.title}`}
        />
      </View>

      <View className="mb-2 flex-row flex-wrap items-center" style={{ gap: 6 }}>
        {notice.isPinned ? <Badge label="Pinned" tone="accent" /> : null}
        {notice.isImportant ? <Badge label="Important" tone="danger" /> : null}
      </View>

      <Text className="text-2xl font-black leading-7 text-ink">{notice.title}</Text>
      <Text className="mt-1 text-[13px] font-medium text-ink-faint">{formatDate(notice.date)}</Text>

      <Card className="mt-4">
        <Text className="text-[15px] leading-6 text-ink-soft">{notice.content}</Text>
      </Card>

      {notice.pdfUrl ? (
        <Card className="mt-4">
          <View className="flex-row items-center">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-danger-50">
              <FileText size={20} color="#DC2626" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-[15px] font-bold text-ink">Attached PDF</Text>
              <Text className="text-[12px] text-ink-muted">Tap below to download and share</Text>
            </View>
          </View>
          <View className="mt-3 flex-row" style={{ gap: 10 }}>
            <View className="flex-1">
              <Button
                title="Download"
                loading={busyId === notice._id}
                onPress={() => downloadRun({ _id: notice._id, title: notice.title, fileUrl: notice.pdfUrl })}
              />
            </View>
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}
