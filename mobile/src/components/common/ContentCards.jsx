import React from 'react';
import { Text, View } from 'react-native';
import { FileText, MapPin } from 'lucide-react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import FavoriteButton from './FavoriteButton';
import { formatDate } from '../../utils/format';

export function NoticeCard({ notice, onPress }) {
  return (
    <Card className="mb-3" onPress={onPress}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <View className="mb-1.5 flex-row flex-wrap items-center" style={{ gap: 6 }}>
            {notice.isPinned ? <Badge label="Pinned" tone="accent" /> : null}
            {notice.isImportant ? <Badge label="Important" tone="danger" /> : null}
            {notice.pdfUrl ? (
              <View className="flex-row items-center" style={{ gap: 3 }}>
                <FileText size={12} color="#6B7280" />
                <Text className="text-[11px] font-semibold text-ink-muted">PDF</Text>
              </View>
            ) : null}
          </View>
          <Text className="text-[15px] font-bold leading-5 text-ink" numberOfLines={2}>
            {notice.title}
          </Text>
          <Text className="mt-1 text-[13px] leading-4 text-ink-muted" numberOfLines={2}>
            {notice.content}
          </Text>
          <Text className="mt-2 text-xs font-medium text-ink-faint">{formatDate(notice.date)}</Text>
        </View>
        <FavoriteButton itemType="notice" itemId={notice._id} />
      </View>
    </Card>
  );
}

export function EventCard({ event, onPress }) {
  const date = new Date(event.date);
  const day = Number.isNaN(date.getTime()) ? '--' : date.getDate();
  const month = Number.isNaN(date.getTime()) ? '' : date.toLocaleString('en', { month: 'short' }).toUpperCase();
  return (
    <Card className="mb-3" onPress={onPress}>
      <View className="flex-row items-stretch">
        <View className="mr-3 w-14 items-center justify-center rounded-2xl bg-primary-50 py-2">
          <Text className="text-xl font-extrabold text-primary-700">{day}</Text>
          <Text className="text-[11px] font-bold text-primary-600">{month}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold leading-5 text-ink" numberOfLines={2}>
            {event.title}
          </Text>
          {event.location ? (
            <View className="mt-1.5 flex-row items-center" style={{ gap: 4 }}>
              <MapPin size={13} color="#6B7280" />
              <Text className="flex-1 text-[13px] text-ink-muted" numberOfLines={1}>
                {event.location}
              </Text>
            </View>
          ) : null}
          <Text className="mt-1.5 text-xs font-medium text-ink-faint">{formatDate(event.date)}</Text>
        </View>
        <FavoriteButton itemType="event" itemId={event._id} />
      </View>
    </Card>
  );
}
