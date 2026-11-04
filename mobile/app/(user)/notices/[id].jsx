import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, FileText } from 'lucide-react-native';
import Text from '../../../src/components/ui/Text';
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
import { colors } from '../../../src/theme/tokens';

function BackButton({ router }) {
  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/notices'))}
      accessibilityRole="button"
      accessibilityLabel="Back to notices"
      className="h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-line bg-surface"
    >
      <ChevronLeft size={22} color={colors.ink} />
    </Pressable>
  );
}

export default function NoticeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: notice, isLoading } = useNotice(id);
  const { run: downloadRun, busyId } = usePdfDownload();

  if (isLoading) {
    return (
      <Screen maxWidth={760}>
        <Skeleton className="mb-4 h-8 w-2/3" />
        <Skeleton className="mb-6 h-64 w-full" />
      </Screen>
    );
  }

  if (!notice) {
    return (
      <Screen maxWidth={760}>
        <View className="mb-4 flex-row">
          <BackButton router={router} />
        </View>
        <EmptyState title="Notice not found" message="It may have been removed." />
      </Screen>
    );
  }

  return (
    <Screen maxWidth={760}>
      <View className="mb-4 flex-row items-center justify-between">
        <BackButton router={router} />
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

      <Text accessibilityRole="header" className="font-serif text-[30px] leading-[38px] text-ink">
        {notice.title}
      </Text>
      <Text className="mt-1 text-[14px] text-ink-muted">{formatDate(notice.date)}</Text>

      <Card className="mt-4">
        <Text className="text-[16px] leading-[26px] text-ink-soft">{notice.content}</Text>
      </Card>

      {notice.pdfUrl ? (
        <Card className="mt-4">
          <View className="flex-row items-center">
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
              <FileText size={20} color={colors.pen} />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-[16px] font-bold text-ink">Attached PDF</Text>
              <Text className="text-[13px] text-ink-muted">Download it to read offline or share</Text>
            </View>
          </View>
          <View className="mt-3">
            <Button
              title="Download PDF"
              loading={busyId === notice._id}
              onPress={() => downloadRun({ _id: notice._id, title: notice.title, fileUrl: notice.pdfUrl })}
            />
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}
