import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, buildUploadPayload } from '../../services/api';

const keys = {
  all: ['media'],
  list: (type) => ['media', 'list', type || 'all'],
};

const fetchAssets = async (type) => (await api.get('/media', { params: type ? { type } : {} })).data;
const uploadAsset = async (file) => (await api.post('/media', buildUploadPayload({}, 'file', file))).data;
const deleteAsset = async (id) => (await api.delete(`/media/${id}`)).data;

export const mediaService = { keys, fetchAssets, uploadAsset, deleteAsset };

export function useMediaAssets(type) {
  return useQuery({ queryKey: keys.list(type), queryFn: () => fetchAssets(type) });
}

export function useMediaMutations() {
  const qc = useQueryClient();
  const done = () => qc.invalidateQueries({ queryKey: keys.all });
  const upload = useMutation({ mutationFn: uploadAsset, onSuccess: done });
  const remove = useMutation({ mutationFn: deleteAsset, onSuccess: done });
  return { upload, remove };
}
