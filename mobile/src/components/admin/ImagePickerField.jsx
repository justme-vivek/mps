import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { ImagePlus, Library } from 'lucide-react-native';
import { ik } from '../../utils/ik';
import { pickImage } from '../../utils/pickers';
import { useMediaMutations } from '../../features/media/mediaService';
import { apiErrorMessage } from '../../services/api';
import { useToast } from '../ui/Toast';
import MediaPickerModal from './MediaPickerModal';

/**
 * Image field for admin forms.
 * value shape: { url: string|null, file: object|null }
 * - "Device" picks + uploads straight to the media library (ImageKit)
 * - "Media library" picks an already-uploaded asset
 */
export default function ImagePickerField({ label = 'Image', value, onChange, required = false }) {
  const toast = useToast();
  const { upload } = useMediaMutations();
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleDevicePick = async () => {
    try {
      const file = await pickImage();
      if (!file) return;
      setUploading(true);
      const asset = await upload.mutateAsync(file);
      onChange({ url: asset.url, file: null });
    } catch (error) {
      toast.show(apiErrorMessage(error, 'Upload failed'), 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-[13px] font-semibold text-ink-soft">
        {label}
        {required ? ' *' : ''}
      </Text>
      <View
        className={`overflow-hidden rounded-2xl border border-dashed bg-surface-alt ${value?.url ? 'border-solid border-line' : 'border-line'}`}
        style={{ minHeight: value?.url ? undefined : 120 }}
      >
        {value?.url ? (
          <Image source={{ uri: ik(value.url, 'w-800,q-75') }} className="h-44 w-full" contentFit="cover" transition={200} />
        ) : (
          <View className="h-28 items-center justify-center">
            <ImagePlus size={28} color="#9CA3AF" />
            <Text className="mt-2 text-[13px] text-ink-faint">No image selected</Text>
          </View>
        )}
      </View>
      <View className="mt-2 flex-row" style={{ gap: 10 }}>
        <Pressable
          onPress={handleDevicePick}
          disabled={uploading}
          className="flex-1 flex-row items-center justify-center rounded-xl border border-line bg-surface py-2.5"
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : (
            <>
              <ImagePlus size={16} color="#4F46E5" />
              <Text className="ml-1.5 text-[13px] font-bold text-primary-600">Device</Text>
            </>
          )}
        </Pressable>
        <Pressable
          onPress={() => setLibraryOpen(true)}
          className="flex-1 flex-row items-center justify-center rounded-xl border border-line bg-surface py-2.5"
        >
          <Library size={16} color="#4F46E5" />
          <Text className="ml-1.5 text-[13px] font-bold text-primary-600">Media library</Text>
        </Pressable>
      </View>
      <MediaPickerModal
        visible={libraryOpen}
        type="image"
        onClose={() => setLibraryOpen(false)}
        onSelect={(asset) => {
          onChange({ url: asset.url, file: null });
          setLibraryOpen(false);
        }}
      />
    </View>
  );
}
