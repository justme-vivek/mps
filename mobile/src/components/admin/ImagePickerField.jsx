import React, { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { ImagePlus, Library } from 'lucide-react-native';
import Text from '../ui/Text';
import { ik } from '../../utils/ik';
import { pickImage } from '../../utils/pickers';
import { useMediaMutations } from '../../features/media/mediaService';
import { apiErrorMessage } from '../../services/api';
import { useToast } from '../ui/Toast';
import MediaPickerModal from './MediaPickerModal';
import { colors } from '../../theme/tokens';

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
      <Text className="mb-1.5 text-[14px] font-bold text-ink-soft">
        {label}
        {required ? ' *' : ''}
      </Text>
      <View className="overflow-hidden rounded-2xl border-[1.5px] border-dashed border-line bg-surface-alt">
        {value?.url ? (
          <Image
            source={{ uri: ik(value.url, 'w-800,q-75') }}
            style={{ width: '100%', height: 176 }}
            contentFit="cover"
            transition={200}
            accessibilityLabel={`${label} preview`}
          />
        ) : (
          <View className="h-28 items-center justify-center">
            <ImagePlus size={28} color={colors.inkFaint} />
            <Text className="mt-2 text-[14px] text-ink-muted">No image selected</Text>
          </View>
        )}
      </View>
      <View className="mt-2 flex-row" style={{ gap: 10 }}>
        <Pressable
          onPress={handleDevicePick}
          disabled={uploading}
          accessibilityRole="button"
          accessibilityLabel="Choose from device"
          className="min-h-[44px] flex-1 flex-row items-center justify-center rounded-xl border-[1.5px] border-line bg-surface"
        >
          {uploading ? (
            <ActivityIndicator size="small" color={colors.pen} />
          ) : (
            <>
              <ImagePlus size={16} color={colors.pen} />
              <Text className="ml-1.5 text-[14px] font-bold text-primary">Device</Text>
            </>
          )}
        </Pressable>
        <Pressable
          onPress={() => setLibraryOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Choose from media library"
          className="min-h-[44px] flex-1 flex-row items-center justify-center rounded-xl border-[1.5px] border-line bg-surface"
        >
          <Library size={16} color={colors.pen} />
          <Text className="ml-1.5 text-[14px] font-bold text-primary">Media library</Text>
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
