import React from 'react';
import { Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import Text from '../ui/Text';

/**
 * Extended add button pinned to the bottom-right of an admin list screen.
 * It carries a label ("New notice") so it reads as an action, not an icon puzzle.
 */
export default function AdminAddFab({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="absolute bottom-6 right-5 min-h-[56px] flex-row items-center rounded-full border-[1.5px] border-primary-700 bg-primary px-5"
      style={{ gap: 8 }}
    >
      <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
      <Text className="text-[15px] font-bold text-white">{label}</Text>
    </Pressable>
  );
}
