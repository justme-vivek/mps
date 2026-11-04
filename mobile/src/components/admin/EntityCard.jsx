import React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Pencil, Trash2 } from 'lucide-react-native';
import Text from '../ui/Text';
import { ik } from '../../utils/ik';
import { colors } from '../../theme/tokens';

/** Admin list card with thumbnail, meta and edit/delete actions (44px targets). */
export default function EntityCard({ title, subtitle, imageUrl, badges = null, meta = null, onEdit, onDelete }) {
  return (
    <View className="mb-3 rounded-2xl border-[1.5px] border-line bg-surface p-3.5">
      <View className="flex-row items-center">
        {imageUrl ? (
          <Image
            source={{ uri: ik(imageUrl, 'w-200,q-70') }}
            style={{ width: 56, height: 56, borderRadius: 12, marginRight: 12, backgroundColor: '#EDF1FB' }}
            contentFit="cover"
            transition={150}
            accessibilityLabel={title}
          />
        ) : null}
        <View className="min-w-0 flex-1">
          <Text className="text-[16px] font-bold text-ink" numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-0.5 text-[14px] text-ink-muted" numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
          {meta ? <Text className="mt-1 text-[12px] text-ink-faint">{meta}</Text> : null}
        </View>
        <View className="ml-2 flex-row">
          <Pressable
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${title}`}
            className="h-11 w-11 items-center justify-center"
          >
            <Pencil size={18} color={colors.ink} />
          </Pressable>
          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${title}`}
            className="h-11 w-11 items-center justify-center"
          >
            <Trash2 size={18} color={colors.danger} />
          </Pressable>
        </View>
      </View>
      {badges ? (
        <View className="mt-2 flex-row flex-wrap" style={{ gap: 6 }}>
          {badges}
        </View>
      ) : null}
    </View>
  );
}
