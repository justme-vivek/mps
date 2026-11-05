import React from 'react';
import { Pressable, View } from 'react-native';
import Text from '../ui/Text';
import { Image } from 'expo-image';
import FavoriteButton from './FavoriteButton';
import { ik } from '../../utils/ik';

/** Gallery grid tile with title bar and favourite toggle. */
export default function PhotoCard({ photo, onPress, size }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="imagebutton"
      accessibilityLabel={photo.title}
      className="overflow-hidden rounded-[18px] border-[1.5px] border-line bg-surface-sunken"
      style={{ width: size, height: size }}
    >
      <Image
        source={{ uri: ik(photo.imageUrl, 'w-500,q-75') }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={200}
        recyclingKey={photo._id}
        accessibilityLabel={photo.title}
      />
      <View className="absolute inset-x-0 bottom-0 flex-row items-center bg-primary-900/75 pl-3">
        <Text className="flex-1 text-[13px] font-bold text-white" numberOfLines={1}>
          {photo.title}
        </Text>
        <FavoriteButton itemType="gallery" itemId={photo._id} size={18} onDark />
      </View>
    </Pressable>
  );
}
