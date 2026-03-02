import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CHAT_ROUTES } from '../constants/api-routes';
import apiClient from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(CHAT_ROUTES.CONVERSATION(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      showSuccessToast('Conversation deleted');
    },
  });
}
