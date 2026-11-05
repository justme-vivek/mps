import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, buildUploadPayload } from '../../services/api';
import { useInfiniteList } from '../../hooks/useInfiniteList';

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

/** Small slice for the home screen (one tiny request instead of the whole table). */
export function useLatestNotices(limit = 5) {
  return useQuery({
    queryKey: [...keys.all, 'latest', limit],
    queryFn: async () => (await api.get('/notices', { params: { status: 'published', limit, page: 1 } })).data,
  });
}

/** Lazy-loaded list. Pass `{ status: 'published' }` for the public feed. */
export function useNoticesInfinite(params = {}) {
  return useInfiniteList({ key: keys.all, path: '/notices', params });
}
