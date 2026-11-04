import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, buildUploadPayload } from '../../services/api';
import { useInfiniteList } from '../../hooks/useInfiniteList';

const keys = {
  all: ['events'],
  list: () => ['events', 'list'],
  detail: (id) => ['events', 'detail', id],
};

const fetchAll = async () => (await api.get('/events')).data;
const fetchById = async (id) => (await api.get(`/events/${id}`)).data;
const create = async ({ fields, file }) =>
  (await api.post('/events', buildUploadPayload(fields, 'bannerFile', file))).data;
const update = async ({ id, fields, file }) =>
  (await api.put(`/events/${id}`, buildUploadPayload(fields, 'bannerFile', file))).data;
const remove = async (id) => (await api.delete(`/events/${id}`)).data;

export const eventService = { keys, fetchAll, fetchById, create, update, remove };

export function useEvents() {
  return useQuery({ queryKey: keys.list(), queryFn: fetchAll });
}

export function useEvent(id) {
  return useQuery({ queryKey: keys.detail(id), queryFn: () => fetchById(id), enabled: !!id });
}

/** Most recent events for the home screen; caller filters for upcoming. */
export function useLatestEvents(limit = 20) {
  return useQuery({
    queryKey: [...keys.all, 'latest', limit],
    queryFn: async () => (await api.get('/events', { params: { limit, page: 1 } })).data,
  });
}

export function useEventsInfinite() {
  return useInfiniteList({ key: keys.all, path: '/events' });
}
