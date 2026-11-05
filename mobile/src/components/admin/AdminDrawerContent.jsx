import React from 'react';
import { View } from 'react-native';
import Text from '../ui/Text';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { colors } from '../../theme/tokens';

/** Navy sidebar: school monogram, then the admin sections. */
export default function AdminDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 4 }}>
      <View className="mb-5 flex-row items-center px-3" style={{ gap: 12 }}>
        <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-accent">
          <Text className="font-serif text-[24px] text-primary-700">M</Text>
        </View>
        <View className="flex-1">
          <Text className="font-serif text-[18px] leading-6 text-white">Modern Public School</Text>
          <Text className="text-[13px]" style={{ color: colors.line }}>
            Admin
          </Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
