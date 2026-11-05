import React from 'react';
import { Pressable, View } from 'react-native';
import { Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import FavoriteButton from './FavoriteButton';
import { useAuth } from '../../features/auth/AuthContext';
import { useToast } from '../ui/Toast';
import { shareContent } from '../../utils/share';
import { colors } from '../../theme/tokens';

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
    <View className="flex-row items-center">
      <FavoriteButton itemType={itemType} itemId={itemId} size={22} />
      <Pressable
        onPress={handleShare}
        accessibilityRole="button"
        accessibilityLabel="Share"
        className="h-11 w-11 items-center justify-center"
      >
        <Share2 size={20} color={colors.inkFaint} />
      </Pressable>
    </View>
  );
}
