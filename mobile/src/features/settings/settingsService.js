import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';

const keys = { all: ['settings'] };

const fetchSettings = async () => (await api.get('/settings')).data;
const updateSettings = async (payload) => (await api.put('/settings', payload)).data;

export const settingsService = { keys, fetchSettings, updateSettings };

export function useSettings() {
  return useQuery({ queryKey: keys.all, queryFn: fetchSettings });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => qc.setQueryData(keys.all, data),
  });
}
