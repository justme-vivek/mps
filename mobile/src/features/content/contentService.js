import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';

const keys = { section: (id) => ['content', id] };

const fetchSection = async (sectionId) => (await api.get(`/content/${sectionId}`)).data;
const updateSection = async ({ sectionId, payload }) =>
  (await api.put(`/content/${sectionId}`, payload)).data;

export const contentService = { keys, fetchSection, updateSection };

export function useContentSection(sectionId) {
  return useQuery({ queryKey: keys.section(sectionId), queryFn: () => fetchSection(sectionId) });
}

export function useUpdateContentSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateSection,
    onSuccess: (data) => qc.setQueryData(keys.section(data.sectionId), data),
  });
}
