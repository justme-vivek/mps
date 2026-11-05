import React from 'react';
import { Pressable, View } from 'react-native';
import Text from '../ui/Text';
import { Download, FileText } from 'lucide-react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatBytes } from '../../utils/format';
import { colors } from '../../theme/tokens';

/** User-facing downloadable PDF card. Download is a signed-in feature. */
export default function DownloadCard({ download, onDownload, downloading = false }) {
  return (
    <Card className="mb-3">
      <View className="flex-row items-center">
        <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
          <FileText size={20} color={colors.pen} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-[15px] font-bold text-ink" numberOfLines={1}>
            {download.title}
          </Text>
          <View className="mt-1 flex-row flex-wrap items-center" style={{ gap: 6 }}>
            {download.category ? <Badge label={download.category} tone="neutral" /> : null}
            <Text className="text-[13px] text-ink-muted">
              {download.downloadCount} downloads
              {download.fileSize ? ` · ${formatBytes(download.fileSize)}` : ''}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onDownload}
          disabled={downloading}
          accessibilityRole="button"
          accessibilityLabel={`Download ${download.title}`}
          className={`ml-2 h-11 w-11 items-center justify-center rounded-xl border-[1.5px] border-primary bg-surface ${
            downloading ? 'opacity-50' : ''
          }`}
        >
          <Download size={18} color={colors.pen} />
        </Pressable>
      </View>
      {download.description ? (
        <Text className="mt-2 text-[14px] leading-5 text-ink-soft" numberOfLines={2}>
          {download.description}
        </Text>
      ) : null}
    </Card>
  );
}
