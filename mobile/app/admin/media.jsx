import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Text from '../../src/components/ui/Text';
import { FileText, Trash2, Upload } from 'lucide-react-native';
import { Image } from 'expo-image';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import Chip from '../../src/components/ui/Chip';
import { colors } from '../../src/theme/tokens';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import AdminList from '../../src/components/admin/AdminList';
import { GridSkeleton } from '../../src/components/feedback/skeletons';
import EmptyState from '../../src/components/ui/EmptyState';
import ConfirmDialog from '../../src/components/ui/ConfirmDialog';
import Badge from '../../src/components/ui/Badge';
import { useMediaInfinite, useMediaMutations } from '../../src/features/media/mediaService';
import { pickImage, pickPdf } from '../../src/utils/pickers';
import { apiErrorMessage } from '../../src/services/api';
import { useToast } from '../../src/components/ui/Toast';
import { ik } from '../../src/utils/ik';
import { formatBytes } from '../../src/utils/format';

const FILTERS = [
  { key: undefined, label: 'All' },
  { key: 'image', label: 'Images' },
  { key: 'pdf', label: 'PDFs' },
];

export default function AdminMedia() {
  const toast = useToast();
  const { isWide, isMedium } = useBreakpoint();
  const [type, setType] = useState(undefined);
  const list = useMediaInfinite(type);
  const { upload, remove } = useMediaMutations();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleUpload = async (picker) => {
    try {
      setUploading(true);
      const file = await picker();
      if (!file) return;
      await upload.mutateAsync(file);
      toast.show('Uploaded to media library', 'success');
    } catch (error) {
      toast.show(apiErrorMessage(error, 'Upload failed'), 'error');
    } finally {
      setUploading(false);
    }
  };

  const cols = isWide ? 5 : isMedium ? 4 : 3;

  return (
    <Screen scroll={false} maxWidth={960}>
      <PageTitle title="Media library" subtitle="Images and PDFs stored in ImageKit." />

      <View className="mb-3 flex-row flex-wrap" style={{ gap: 8 }}>
        {FILTERS.map(({ key, label }) => (
          <Chip key={label} label={label} selected={type === key} onPress={() => setType(key)} />
        ))}
      </View>

      <View className="mb-4 flex-row" style={{ gap: 10 }}>
        <Pressable
          onPress={() => handleUpload(pickImage)}
          disabled={uploading}
          accessibilityRole="button"
          accessibilityLabel="Upload image"
          className="min-h-[48px] flex-1 flex-row items-center justify-center rounded-2xl border-[1.5px] border-primary-700 bg-primary-600"
        >
          <Upload size={16} color="#FFFFFF" />
          <Text className="ml-1.5 text-[14px] font-bold text-white">{uploading ? 'Uploading…' : 'Upload image'}</Text>
        </Pressable>
        <Pressable
          onPress={() => handleUpload(pickPdf)}
          disabled={uploading}
          accessibilityRole="button"
          accessibilityLabel="Upload PDF"
          className="min-h-[48px] flex-1 flex-row items-center justify-center rounded-2xl border-[1.5px] border-primary-600 bg-surface"
        >
          <Upload size={16} color={colors.pen} />
          <Text className="ml-1.5 text-[14px] font-bold text-primary">Upload PDF</Text>
        </Pressable>
      </View>

      <AdminList
        key={cols}
        list={list}
        numColumns={cols}
        columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
        skeleton={<GridSkeleton count={cols * 2} columns={cols} aspect={1.1} />}
        renderItem={({ item }) => (
            <View className="flex-1 overflow-hidden rounded-2xl border-[1.5px] border-line bg-surface" style={{ maxWidth: `${100 / cols - 1}%` }}>
              <View className="h-24 bg-surface-alt">
                {item.type === 'image' ? (
                  <Image
                    source={{ uri: ik(item.url, 'w-300,q-70') }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    transition={150}
                    accessibilityLabel={item.name}
                  />
                ) : (
                  <View className="h-full items-center justify-center">
                    <FileText size={28} color={colors.danger} />
                  </View>
                )}
              </View>
              <View className="px-2 pt-1.5">
                <Text className="text-[12px] font-bold text-ink-soft" numberOfLines={1}>
                  {item.name}
                </Text>
                <View className="mt-1 flex-row items-center justify-between">
                  <Badge label={item.type === 'image' ? 'Image' : 'PDF'} tone={item.type === 'image' ? 'primary' : 'danger'} />
                  <Text className="text-[12px] text-ink-faint">{formatBytes(item.size)}</Text>
                </View>
              </View>
              <Pressable
                onPress={() => setDeleting(item)}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${item.name}`}
                className="mt-1 min-h-[44px] flex-row items-center justify-center border-t-[1.5px] border-line"
              >
                <Trash2 size={14} color={colors.danger} />
                <Text className="ml-1 text-[13px] font-bold text-danger">Delete</Text>
              </Pressable>
            </View>
        )}
        empty={<EmptyState
              title="Media library is empty"
              message="Upload images and PDFs here — every upload is stored in ImageKit."
            />}
      />

      <ConfirmDialog
        visible={!!deleting}
        title="Delete media?"
        message={`"${deleting?.name}" will be removed from ImageKit. Forms already using it may lose the file.`}
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting._id, { onSettled: () => setDeleting(null) })}
        onCancel={() => setDeleting(null)}
      />
    </Screen>
  );
}
