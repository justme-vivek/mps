import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, buildUploadPayload } from '../../services/api';

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
