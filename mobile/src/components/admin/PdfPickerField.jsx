import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { FileText, Library, Upload } from 'lucide-react-native';
import Text from '../ui/Text';
import { pickPdf } from '../../utils/pickers';
import { useMediaMutations } from '../../features/media/mediaService';
import { apiErrorMessage } from '../../services/api';
import { useToast } from '../ui/Toast';
import MediaPickerModal from './MediaPickerModal';
import { colors } from '../../theme/tokens';

/**
 * PDF attachment field for admin forms.
 * value shape: { url: string|null, file: object|null, name?: string }
 */
export default function PdfPickerField({ label = 'PDF attachment', value, onChange }) {
  const toast = useToast();
  const { upload } = useMediaMutations();
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleDevicePick = async () => {
    try {
      const file = await pickPdf();
      if (!file) return;
      setUploading(true);
      const asset = await upload.mutateAsync(file);
      onChange({ url: asset.url, file: null, name: asset.name });
    } catch (error) {
      toast.show(apiErrorMessage(error, 'Upload failed'), 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-[14px] font-bold text-ink-soft">{label}</Text>
      <View className="min-h-[48px] flex-row items-center rounded-2xl border-[1.5px] border-line bg-surface px-4 py-3">
        <FileText size={18} color={value?.url ? colors.pen : colors.inkFaint} />
        <Text className="ml-2 flex-1 text-[14px] text-ink-soft" numberOfLines={1}>
          {value?.name || value?.url || 'No PDF attached'}
        </Text>
      </View>
      <View className="mt-2 flex-row" style={{ gap: 10 }}>
        <Pressable
          onPress={handleDevicePick}
          disabled={uploading}
          accessibilityRole="button"
          accessibilityLabel="Upload PDF from device"
          className="min-h-[44px] flex-1 flex-row items-center justify-center rounded-xl border-[1.5px] border-line bg-surface"
        >
          <Upload size={16} color={colors.pen} />
          <Text className="ml-1.5 text-[14px] font-bold text-primary">{uploading ? 'Uploading…' : 'Device'}</Text>
        </Pressable>
        <Pressable
          onPress={() => setLibraryOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Choose PDF from media library"
          className="min-h-[44px] flex-1 flex-row items-center justify-center rounded-xl border-[1.5px] border-line bg-surface"
        >
          <Library size={16} color={colors.pen} />
          <Text className="ml-1.5 text-[14px] font-bold text-primary">Media library</Text>
        </Pressable>
      </View>
      <MediaPickerModal
        visible={libraryOpen}
        type="pdf"
        onClose={() => setLibraryOpen(false)}
        onSelect={(asset) => {
          onChange({ url: asset.url, file: null, name: asset.name });
          setLibraryOpen(false);
        }}
      />
    </View>
  );
}
