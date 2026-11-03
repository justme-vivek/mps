import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, buildUploadPayload } from '../../services/api';

const keys = {
  all: ['faculty'],
  list: () => ['faculty', 'list'],
};

const fetchAll = async () => (await api.get('/faculty')).data;
const create = async ({ fields, file }) =>
  (await api.post('/faculty', buildUploadPayload(fields, 'profileFile', file))).data;
const update = async ({ id, fields, file }) =>
  (await api.put(`/faculty/${id}`, buildUploadPayload(fields, 'profileFile', file))).data;
const remove = async (id) => (await api.delete(`/faculty/${id}`)).data;

export const facultyService = { keys, fetchAll, create, update, remove };

export function useFaculty() {
  return useQuery({ queryKey: keys.list(), queryFn: fetchAll });
}
