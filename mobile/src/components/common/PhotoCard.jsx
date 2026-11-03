import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import FavoriteButton from './FavoriteButton';
import { ik } from '../../utils/ik';

/** Gallery grid tile with title overlay and favourite toggle. */
export default function PhotoCard({ photo, onPress, size }) {
  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-2xl border border-line bg-surface"
      style={{ width: size, height: size }}
    >
      <Image
        source={{ uri: ik(photo.imageUrl, 'w-500,q-75') }}
        className="h-full w-full"
        contentFit="cover"
        transition={200}
        recyclingKey={photo._id}
      />
      <View className="absolute inset-x-0 bottom-0 bg-black/45 px-2 pb-2 pt-6">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-[12px] font-bold text-white" numberOfLines={1}>
            {photo.title}
          </Text>
          <FavoriteButton itemType="gallery" itemId={photo._id} size={16} />
        </View>
      </View>
    </Pressable>
  );
}
