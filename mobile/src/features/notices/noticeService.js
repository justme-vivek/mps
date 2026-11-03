import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, buildUploadPayload } from '../../services/api';

const keys = {
  all: ['notices'],
  list: () => ['notices', 'list'],
  detail: (id) => ['notices', 'detail', id],
};

const fetchAll = async () => (await api.get('/notices')).data;
const fetchById = async (id) => (await api.get(`/notices/${id}`)).data;
const create = async ({ fields, file }) =>
  (await api.post('/notices', buildUploadPayload(fields, 'attachmentFile', file))).data;
const update = async ({ id, fields, file }) =>
  (await api.put(`/notices/${id}`, buildUploadPayload(fields, 'attachmentFile', file))).data;
const remove = async (id) => (await api.delete(`/notices/${id}`)).data;

export const noticeService = { keys, fetchAll, fetchById, create, update, remove };

export function useNotices() {
  return useQuery({ queryKey: keys.list(), queryFn: fetchAll });
}

export function useNotice(id) {
  return useQuery({ queryKey: keys.detail(id), queryFn: () => fetchById(id), enabled: !!id });
}
