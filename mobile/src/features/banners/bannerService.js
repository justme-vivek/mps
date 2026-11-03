import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, buildUploadPayload } from '../../services/api';

const keys = {
  all: ['banners'],
  list: () => ['banners', 'list'],
};

const fetchAll = async () => (await api.get('/banners')).data;
const create = async ({ fields, file }) =>
  (await api.post('/banners', buildUploadPayload(fields, 'imageFile', file))).data;
const update = async ({ id, fields, file }) =>
  (await api.put(`/banners/${id}`, buildUploadPayload(fields, 'imageFile', file))).data;
const remove = async (id) => (await api.delete(`/banners/${id}`)).data;

export const bannerService = { keys, fetchAll, create, update, remove };

export function useBanners() {
  return useQuery({ queryKey: keys.list(), queryFn: fetchAll });
}
