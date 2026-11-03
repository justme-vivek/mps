import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { FileText, Plus, Trash2, Upload } from 'lucide-react-native';
import { Image } from 'expo-image';
import Screen from '../../src/components/ui/Screen';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import ConfirmDialog from '../../src/components/ui/ConfirmDialog';
import Badge from '../../src/components/ui/Badge';
import { useMediaAssets, useMediaMutations } from '../../src/features/media/mediaService';
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
  const [type, setType] = useState(undefined);
  const { data: assets = [], isLoading } = useMediaAssets(type);
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

  return (
    <Screen>
      <View className="mb-3 flex-row" style={{ gap: 8 }}>
        {FILTERS.map(({ key, label }) => (
          <Pressable
            key={label}
            onPress={() => setType(key)}
            className={`rounded-full px-3.5 py-1.5 ${type === key ? 'bg-primary-600' : 'bg-surface-sunken'}`}
          >
            <Text className={`text-[12px] font-bold ${type === key ? 'text-white' : 'text-ink-soft'}`}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <View className="mb-4 flex-row" style={{ gap: 10 }}>
        <Pressable
          onPress={() => handleUpload(pickImage)}
          disabled={uploading}
          className="flex-1 flex-row items-center justify-center rounded-2xl bg-primary-600 py-3"
        >
          <Upload size={16} color="#FFFFFF" />
          <Text className="ml-1.5 text-[13px] font-bold text-white">{uploading ? 'Uploading…' : 'Image'}</Text>
        </Pressable>
        <Pressable
          onPress={() => handleUpload(pickPdf)}
          disabled={uploading}
          className="flex-1 flex-row items-center justify-center rounded-2xl border border-primary-600 py-3"
        >
          <Upload size={16} color="#4F46E5" />
          <Text className="ml-1.5 text-[13px] font-bold text-primary-600">PDF</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-row flex-wrap" style={{ gap: 10 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28" style={{ width: 104 }} />
          ))}
        </View>
      ) : (
        <FlatList
          data={assets || []}
          keyExtractor={(item) => item._id}
          numColumns={3}
          columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="flex-1 overflow-hidden rounded-2xl border border-line bg-surface">
              <View className="h-24">
                {item.type === 'image' ? (
                  <Image source={{ uri: ik(item.url, 'w-300,q-70') }} className="h-full w-full" contentFit="cover" transition={150} />
                ) : (
                  <View className="h-full items-center justify-center">
                    <FileText size={28} color="#DC2626" />
                  </View>
                )}
              </View>
              <View className="px-2 py-1.5">
                <Text className="text-[11px] font-semibold text-ink-soft" numberOfLines={1}>
                  {item.name}
                </Text>
                <View className="mt-1 flex-row items-center justify-between">
                  <Badge label={item.type === 'image' ? 'Image' : 'PDF'} tone={item.type === 'image' ? 'primary' : 'danger'} />
                  <Text className="text-[10px] text-ink-faint">{formatBytes(item.size)}</Text>
                </View>
                <Pressable
                  onPress={() => setDeleting(item)}
                  className="mt-2 flex-row items-center justify-center rounded-lg bg-danger-50 py-1.5"
                >
                  <Trash2 size={13} color="#DC2626" />
                  <Text className="ml-1 text-[11px] font-bold text-danger">Delete</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              title="Media library is empty"
              message="Upload images and PDFs here — every upload is stored in ImageKit."
            />
          }
        />
      )}

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
