import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { Image as ExpoImage } from 'expo-image';
import { ik } from '../../utils/ik';

/** Admin list card with thumbnail, meta and edit/delete actions. */
export default function EntityCard({ title, subtitle, imageUrl, badges = null, meta = null, onEdit, onDelete }) {
  return (
    <View className="mb-3 rounded-3xl border border-line bg-surface p-3.5 shadow-sm">
      <View className="flex-row items-center">
        {imageUrl ? (
          <ExpoImage
            source={{ uri: ik(imageUrl, 'w-200,q-70') }}
            className="mr-3 h-14 w-14 rounded-2xl"
            contentFit="cover"
            transition={150}
          />
        ) : null}
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-ink" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-0.5 text-[13px] text-ink-muted" numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
          {meta ? <Text className="mt-1 text-[11px] font-medium text-ink-faint">{meta}</Text> : null}
        </View>
        <View className="ml-2 flex-row" style={{ gap: 6 }}>
          <Pressable onPress={onEdit} hitSlop={8} className="h-9 w-9 items-center justify-center rounded-full bg-primary-50">
            <Pencil size={16} color="#4F46E5" />
          </Pressable>
          <Pressable onPress={onDelete} hitSlop={8} className="h-9 w-9 items-center justify-center rounded-full bg-danger-50">
            <Trash2 size={16} color="#DC2626" />
          </Pressable>
        </View>
      </View>
      {badges ? <View className="mt-2 flex-row flex-wrap" style={{ gap: 6 }}>{badges}</View> : null}
    </View>
  );
}
