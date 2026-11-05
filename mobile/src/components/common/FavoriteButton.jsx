import React from 'react';
import { Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../features/auth/AuthContext';
import { useFavoriteIds, useToggleFavorite } from '../../features/favorites/favoriteService';
import { useToast } from '../ui/Toast';
import { colors } from '../../theme/tokens';

/**
 * Heart toggle for favouriting content. Requires a logged-in account —
 * guests are prompted to sign in instead. 44px tap target.
 */
export default function FavoriteButton({ itemType, itemId, size = 20, onDark = false }) {
  const { status } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { data: favIds } = useFavoriteIds(itemType);
  const toggle = useToggleFavorite();

  const isFavorite = favIds?.has(itemId) || false;

  const handlePress = () => {
    if (status !== 'authenticated') {
      toast.show('Sign in to save favourites', 'info');
      router.push('/login');
      return;
    }
    toggle.mutate({ itemType, itemId });
  };

  const idle = onDark ? '#FFFFFF' : colors.inkFaint;
  const active = onDark ? colors.marker : colors.danger;

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remove from favourites' : 'Save to favourites'}
      accessibilityState={{ selected: isFavorite }}
      className="h-11 w-11 items-center justify-center"
    >
      <Heart size={size} color={isFavorite ? active : idle} fill={isFavorite ? active : 'transparent'} />
    </Pressable>
  );
}
