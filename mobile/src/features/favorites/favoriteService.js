import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';

const keys = {
  all: ['favorites'],
  list: () => ['favorites', 'list'],
  ids: (itemType) => ['favorites', 'ids', itemType || 'all'],
};

const fetchFavorites = async () => (await api.get('/favorites')).data;
const fetchFavoriteIds = async (itemType) =>
  (await api.get('/favorites/ids', { params: itemType ? { itemType } : {} })).data;
const toggleFavorite = async ({ itemType, itemId }) =>
  (await api.post('/favorites', { itemType, itemId })).data;
const removeFavorite = async (id) => (await api.delete(`/favorites/${id}`)).data;

export const favoriteService = { keys, fetchFavorites, fetchFavoriteIds, toggleFavorite, removeFavorite };

/** Set of favourited item ids for one itemType (string ids). */
export function useFavoriteIds(itemType) {
  return useQuery({
    queryKey: keys.ids(itemType),
    queryFn: () => fetchFavoriteIds(itemType),
    select: (data) => new Set(data.ids),
  });
}

export function useFavorites() {
  return useQuery({ queryKey: keys.list(), queryFn: fetchFavorites });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}
