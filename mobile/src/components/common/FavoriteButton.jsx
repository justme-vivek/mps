import React from 'react';
import { Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../features/auth/AuthContext';
import { useFavoriteIds, useToggleFavorite } from '../../features/favorites/favoriteService';
import { useToast } from '../ui/Toast';

/**
 * Heart toggle for favouriting content. Requires a logged-in account —
 * guests are prompted to sign in instead.
 */
export default function FavoriteButton({ itemType, itemId, size = 20 }) {
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

  return (
    <Pressable onPress={handlePress} hitSlop={10} className="p-1.5">
      <Heart
        size={size}
        color={isFavorite ? '#DC2626' : '#9CA3AF'}
        fill={isFavorite ? '#DC2626' : 'transparent'}
      />
    </Pressable>
  );
}
