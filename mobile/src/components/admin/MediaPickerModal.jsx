import React from 'react';
import { FlatList, Image, Modal, Pressable, Text, View } from 'react-native';
import { FileText, Trash2 } from 'lucide-react-native';
import { useMediaAssets, useMediaMutations } from '../../features/media/mediaService';
import { ik } from '../../utils/ik';
import { formatBytes } from '../../utils/format';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';
import ConfirmDialog from '../ui/ConfirmDialog';

/** Admin media library picker — choose (or delete) an already-uploaded asset. */
export default function MediaPickerModal({ visible, type = 'image', onClose, onSelect }) {
  const { data: assets = [], isLoading } = useMediaAssets(visible ? type : undefined);
  const { remove } = useMediaMutations();
  const [deleting, setDeleting] = useState(null);

  const confirmDelete = () => {
    remove.mutate(deleting._id, {
      onSettled: () => setDeleting(null),
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="h-[65%] rounded-t-3xl border-t border-line bg-surface px-5 pb-8 pt-3">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-extrabold text-ink">
              Media library{type === 'pdf' ? ' (PDF)' : ''}
            </Text>
            <Pressable onPress={onClose} className="p-1">
              <Text className="text-[13px] font-bold text-primary-600">Done</Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View className="flex-row flex-wrap" style={{ gap: 10 }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-24" style={{ width: 96 }} />
              ))}
            </View>
          ) : assets.length === 0 ? (
            <EmptyState
              title="Nothing here yet"
              message={
                type === 'pdf'
                  ? 'Upload a PDF from a form field (Device button) and it will appear here.'
                  : 'Upload images from a form field (Device button) and they will appear here.'
              }
            />
          ) : (
            <FlatList
              data={assets}
              keyExtractor={(item) => item._id}
              numColumns={3}
              columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <View className="flex-1 overflow-hidden rounded-xl border border-line bg-surface-alt">
                  <Pressable onPress={() => onSelect(item)}>
                    {item.type === 'image' ? (
                      <Image
                        source={{ uri: ik(item.url, 'w-300,q-70') }}
                        className="h-24 w-full"
                        contentFit="cover"
                        transition={150}
                      />
                    ) : (
                      <View className="h-24 items-center justify-center">
                        <FileText size={26} color="#DC2626" />
                        <Text className="mt-1 px-1 text-[10px] font-semibold text-ink-soft" numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                  <View className="flex-row items-center justify-between px-1.5 py-1">
                    <Text className="flex-1 text-[10px] text-ink-faint" numberOfLines={1}>
                      {formatBytes(item.size)}
                    </Text>
                    <Pressable onPress={() => setDeleting(item)} hitSlop={6} className="p-1">
                      <Trash2 size={14} color="#DC2626" />
                    </Pressable>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>

      <ConfirmDialog
        visible={!!deleting}
        title="Delete media?"
        message={`"${deleting?.name}" will be removed from ImageKit as well. Forms already using it may lose the file.`}
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </Modal>
  );
}
