import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, buildUploadPayload } from '../../services/api';

const keys = {
  all: ['downloads'],
  list: () => ['downloads', 'list'],
};

const fetchAll = async () => (await api.get('/downloads')).data;
const create = async ({ fields, file }) =>
  (await api.post('/downloads', buildUploadPayload(fields, 'file', file))).data;
const update = async ({ id, fields, file }) =>
  (await api.put(`/downloads/${id}`, buildUploadPayload(fields, 'file', file))).data;
const remove = async (id) => (await api.delete(`/downloads/${id}`)).data;
const incrementDownload = async (id) =>
  (await api.post(`/downloads/${id}/download`)).data;

export const downloadService = { keys, fetchAll, create, update, remove, incrementDownload };

export function useDownloads() {
  return useQuery({ queryKey: keys.list(), queryFn: fetchAll });
}

export function useIncrementDownload() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: incrementDownload,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
