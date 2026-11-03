import React from 'react';
import { Pressable, View } from 'react-native';
import { Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import FavoriteButton from './FavoriteButton';
import { useAuth } from '../../features/auth/AuthContext';
import { useToast } from '../ui/Toast';
import { shareContent } from '../../utils/share';

/**
 * Row of content actions (favourite + share).
 * Both are signed-in features — guests get a sign-in prompt.
 */
export default function ContentActions({ itemType, itemId, title, shareText }) {
  const { status } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleShare = () => {
    if (status !== 'authenticated') {
      toast.show('Sign in to share content', 'info');
      router.push('/login');
      return;
    }
    shareContent({ title, text: shareText });
  };

  return (
    <View className="flex-row items-center" style={{ gap: 4 }}>
      <FavoriteButton itemType={itemType} itemId={itemId} size={22} />
      <Pressable onPress={handleShare} hitSlop={10} className="p-1.5">
        <Share2 size={20} color="#9CA3AF" />
      </Pressable>
    </View>
  );
}
