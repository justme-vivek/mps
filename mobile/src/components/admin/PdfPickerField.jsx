import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { FileText, Library, Upload } from 'lucide-react-native';
import { pickPdf } from '../../utils/pickers';
import { useMediaMutations } from '../../features/media/mediaService';
import { apiErrorMessage } from '../../services/api';
import { useToast } from '../ui/Toast';
import MediaPickerModal from './MediaPickerModal';

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
      <Text className="mb-1.5 text-[13px] font-semibold text-ink-soft">{label}</Text>
      <View className="flex-row items-center rounded-2xl border border-line bg-surface px-4 py-3">
        <FileText size={18} color={value?.url ? '#DC2626' : '#9CA3AF'} />
        <Text className="ml-2 flex-1 text-[13px] text-ink-soft" numberOfLines={1}>
          {value?.name || value?.url || 'No PDF attached'}
        </Text>
      </View>
      <View className="mt-2 flex-row" style={{ gap: 10 }}>
        <Pressable
          onPress={handleDevicePick}
          disabled={uploading}
          className="flex-1 flex-row items-center justify-center rounded-xl border border-line bg-surface py-2.5"
        >
          {uploading ? (
            <Upload size={16} color="#4F46E5" />
          ) : (
            <Upload size={16} color="#4F46E5" />
          )}
          <Text className="ml-1.5 text-[13px] font-bold text-primary-600">
            {uploading ? 'Uploading…' : 'Device'}
          </Text>
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
