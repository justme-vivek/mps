import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../components/ui/Toast';
import { apiErrorMessage } from '../services/api';

/**
 * Shared CRUD mutations for admin entity screens.
 * Wires toasts + cache invalidation so every admin screen stays thin.
 */
export function useEntityMutations({ service, keys, noun }) {
  const qc = useQueryClient();
  const toast = useToast();
  const done = () => qc.invalidateQueries({ queryKey: keys.all });

  const create = useMutation({
    mutationFn: service.create,
    onSuccess: () => {
      toast.show(`${noun} created`, 'success');
      done();
    },
    onError: (error) => toast.show(apiErrorMessage(error), 'error'),
  });

  const update = useMutation({
    mutationFn: service.update,
    onSuccess: () => {
      toast.show(`${noun} updated`, 'success');
      done();
    },
    onError: (error) => toast.show(apiErrorMessage(error), 'error'),
  });

  const remove = useMutation({
    mutationFn: service.remove,
    onSuccess: () => {
      toast.show(`${noun} deleted`, 'success');
      done();
    },
    onError: (error) => toast.show(apiErrorMessage(error), 'error'),
  });

  return { create, update, remove };
}
