import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DOCUMENTS_ROUTES } from '../constants/api-routes';
import apiClient from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(DOCUMENTS_ROUTES.DOCUMENT(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      showSuccessToast('Document deleted');
    },
  });
}
