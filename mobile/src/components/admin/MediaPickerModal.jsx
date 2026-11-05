import React, { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { FileText, Trash2 } from 'lucide-react-native';
import Text from '../ui/Text';
import { useMediaAssets, useMediaMutations } from '../../features/media/mediaService';
import { ik } from '../../utils/ik';
import { formatBytes } from '../../utils/format';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { colors } from '../../theme/tokens';

/** Admin media library picker — choose (or delete) an already-uploaded asset. */
export default function MediaPickerModal({ visible, type = 'image', onClose, onSelect }) {
  const { isMedium } = useBreakpoint();
  const { data: assets = [], isLoading } = useMediaAssets(visible ? type : undefined);
  const { remove } = useMediaMutations();
  const [deleting, setDeleting] = useState(null);

  const confirmDelete = () => {
    remove.mutate(deleting._id, {
      onSettled: () => setDeleting(null),
    });
  };

  return (
    <Modal visible={visible} animationType={isMedium ? 'fade' : 'slide'} transparent onRequestClose={onClose}>
      <View className={`flex-1 bg-primary-900/60 ${isMedium ? 'items-center justify-center px-6' : 'justify-end'}`}>
        {!isMedium ? <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Close library" /> : null}
        <View
          className={`w-full border-line bg-surface px-5 pb-6 pt-4 ${
            isMedium ? 'h-[70%] max-w-[640px] rounded-card border-[1.5px]' : 'h-[70%] rounded-t-[28px] border-t-[1.5px]'
          }`}
        >
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-serif text-[22px] text-ink">Media library{type === 'pdf' ? ' (PDF)' : ''}</Text>
            <Pressable onPress={onClose} accessibilityRole="button" className="min-h-[44px] justify-center px-2">
              <Text className="text-[15px] font-bold text-primary">Done</Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View className="flex-row flex-wrap" style={{ gap: 10 }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} style={{ width: 96, height: 96 }} />
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
            <View className="flex-1 overflow-hidden">
              <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                {assets.map((item) => (
                  <View
                    key={item._id}
                    className="overflow-hidden rounded-xl border-[1.5px] border-line bg-surface-alt"
                    style={{ width: isMedium ? 130 : 100 }}
                  >
                    <Pressable
                      onPress={() => onSelect(item)}
                      accessibilityRole="button"
                      accessibilityLabel={`Use ${item.name}`}
                    >
                      {item.type === 'image' ? (
                        <Image
                          source={{ uri: ik(item.url, 'w-300,q-70') }}
                          style={{ width: '100%', height: 96 }}
                          contentFit="cover"
                          transition={150}
                          accessibilityLabel={item.name}
                        />
                      ) : (
                        <View className="h-24 items-center justify-center">
                          <FileText size={26} color={colors.pen} />
                          <Text className="mt-1 px-1 text-[12px] text-ink-soft" numberOfLines={1}>
                            {item.name}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                    <View className="flex-row items-center justify-between pl-2">
                      <Text className="flex-1 text-[12px] text-ink-faint" numberOfLines={1}>
                        {formatBytes(item.size)}
                      </Text>
                      <Pressable
                        onPress={() => setDeleting(item)}
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${item.name}`}
                        className="h-11 w-11 items-center justify-center"
                      >
                        <Trash2 size={16} color={colors.danger} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
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
