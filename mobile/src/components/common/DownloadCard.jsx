import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Download, FileText } from 'lucide-react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatBytes } from '../../utils/format';

/** User-facing downloadable PDF card. Download is a signed-in feature. */
export default function DownloadCard({ download, onDownload, downloading = false }) {
  return (
    <Card className="mb-3">
      <View className="flex-row items-center">
        <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-danger-50">
          <FileText size={20} color="#DC2626" />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-ink" numberOfLines={1}>
            {download.title}
          </Text>
          <View className="mt-1 flex-row items-center" style={{ gap: 6 }}>
            {download.category ? <Badge label={download.category} tone="neutral" /> : null}
            <Text className="text-[12px] text-ink-muted">
              {download.downloadCount} downloads
              {download.fileSize ? ` · ${formatBytes(download.fileSize)}` : ''}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onDownload}
          disabled={downloading}
          className={`ml-2 h-10 w-10 items-center justify-center rounded-full bg-primary-50 ${downloading ? 'opacity-50' : ''}`}
        >
          <Download size={18} color="#4F46E5" />
        </Pressable>
      </View>
      {download.description ? (
        <Text className="mt-2 text-[13px] text-ink-muted" numberOfLines={2}>
          {download.description}
        </Text>
      ) : null}
    </Card>
  );
}
