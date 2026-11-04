import React, { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import Text from '../../src/components/ui/Text';
import { FileText, Trash2, Upload } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import { colors } from '../../src/theme/tokens';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import ConfirmDialog from '../../src/components/ui/ConfirmDialog';
import Badge from '../../src/components/ui/Badge';
import { useDownloads, downloadService } from '../../src/features/downloads/downloadService';
import { useEntityMutations } from '../../src/hooks/useEntityMutations';
import { pickPdf } from '../../src/utils/pickers';
import { useToast } from '../../src/components/ui/Toast';
import { apiErrorMessage } from '../../src/services/api';
import { toDateInput } from '../../src/utils/format';

export default function AdminDownloads() {
  const toast = useToast();
  const { data: downloads = [], isLoading } = useDownloads();
  const { create, remove } = useEntityMutations({
    service: downloadService,
    keys: downloadService.keys,
    noun: 'Download',
  });
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Simplified flow: pick a PDF → publish immediately with its filename as title.
  const handleUpload = async () => {
    try {
      setUploading(true);
      const file = await pickPdf();
      if (!file) return;
      const title = file.name.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ');
      await create.mutateAsync({ fields: { title, category: 'General' }, file });
      toast.show('PDF published to downloads', 'success');
    } catch (error) {
      toast.show(apiErrorMessage(error, 'Upload failed'), 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Screen scroll={false} maxWidth={960}>
      <PageTitle title="Downloads" subtitle="PDFs published here appear in the app's Downloads screen." />

      <Pressable
        onPress={handleUpload}
        disabled={uploading}
        accessibilityRole="button"
        accessibilityLabel="Publish a PDF"
        className="mb-4 min-h-[48px] flex-row items-center justify-center rounded-2xl border-[1.5px] border-primary-700 bg-primary-600"
      >
        <Upload size={16} color="#FFFFFF" />
        <Text className="ml-2 text-[14px] font-bold text-white">
          {uploading ? 'Uploading…' : 'Publish a PDF'}
        </Text>
      </Pressable>

      {isLoading ? (
        <Skeleton className="h-20 w-full" />
      ) : (
        <FlatList
          data={downloads || []}
          keyExtractor={(item) => item._id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="mb-3 flex-row items-center rounded-card border-[1.5px] border-line bg-surface p-3.5">
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-danger-50">
                <FileText size={20} color={colors.danger} />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-ink" numberOfLines={1}>
                  {item.title}
                </Text>
                <View className="mt-1 flex-row items-center" style={{ gap: 6 }}>
                  <Badge label={item.category || 'General'} tone="neutral" />
                  <Text className="text-[12px] text-ink-muted">{item.downloadCount} downloads</Text>
                  <Text className="text-[12px] text-ink-faint">· {toDateInput(item.createdAt)}</Text>
                </View>
              </View>
              <Pressable
                onPress={() => setDeleting(item)}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${item.title}`}
                className="ml-2 h-11 w-11 items-center justify-center rounded-full bg-danger-50"
              >
                <Trash2 size={18} color={colors.danger} />
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              title="No downloads yet"
              message="Publish admission forms, circulars and syllabi as PDFs."
            />
          }
        />
      )}

      <ConfirmDialog
        visible={!!deleting}
        title="Delete download?"
        message={`"${deleting?.title}" will be removed along with its PDF file.`}
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting._id, { onSettled: () => setDeleting(null) })}
        onCancel={() => setDeleting(null)}
      />
    </Screen>
  );
}
