import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, buildUploadPayload } from '../../services/api';

const keys = {
  all: ['gallery'],
  list: () => ['gallery', 'list'],
};

const fetchAll = async () => (await api.get('/gallery')).data;
const create = async ({ fields, file }) =>
  (await api.post('/gallery', buildUploadPayload(fields, 'imageFile', file))).data;
const update = async ({ id, fields, file }) =>
  (await api.put(`/gallery/${id}`, buildUploadPayload(fields, 'imageFile', file))).data;
const remove = async (id) => (await api.delete(`/gallery/${id}`)).data;

export const galleryService = { keys, fetchAll, create, update, remove };

export function useGallery() {
  return useQuery({ queryKey: keys.list(), queryFn: fetchAll });
}
